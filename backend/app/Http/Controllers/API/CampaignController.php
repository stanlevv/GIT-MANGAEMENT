<?php

namespace App\Http\Controllers\API;

use App\Actions\Campaign\ProcessDonationAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Campaign\DonateRequest;
use App\Http\Requests\Campaign\StoreCampaignRequest;
use App\Http\Resources\CampaignResource;
use App\Http\Resources\DonationResource;
use App\Models\Campaign;
use Illuminate\Http\Request;

class CampaignController extends Controller
{
    /**
     * Daftar semua kampanye aktif (publik).
     */
    public function index()
    {
        $campaigns = Campaign::withCount('donations')
                             ->where('status', 'active')
                             ->latest()
                             ->get();

        return CampaignResource::collection($campaigns)
            ->additional(['success' => true]);
    }

    /**
     * Detail satu kampanye beserta daftar donasi.
     */
    public function show(Campaign $campaign)
    {
        $campaign->load(['donations' => function ($query) {
            $query->orderBy('created_at', 'desc')->limit(10);
        }]);

        return (new CampaignResource($campaign))
            ->additional(['success' => true]);
    }

    /**
     * Donasi ke kampanye — delegated to Action.
     */
    public function donate(DonateRequest $request, Campaign $campaign, ProcessDonationAction $action)
    {
        $donorId = auth()->check() ? auth()->id() : null;
        $result = $action->execute($campaign, $request->validated(), $donorId);

        return response()->json([
            'success'  => true,
            'donation' => new DonationResource($result['donation']),
            'order_id' => $result['order_id'],
        ]);
    }

    /**
     * Buat kampanye baru — authorization via StoreCampaignRequest.
     */
    public function store(StoreCampaignRequest $request)
    {
        $campaign = Campaign::create(array_merge(
            $request->safe()->only(['title', 'description', 'target_amount', 'image_url', 'type', 'start_date', 'end_date']),
            ['status' => $request->status ?? 'active', 'current_amount' => 0]
        ));

        $campaign->fundPool()->create(['balance' => 0]);

        return (new CampaignResource($campaign))
            ->additional(['success' => true])
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Update kampanye (Admin Sekolah only via middleware).
     */
    public function update(Request $request, Campaign $campaign)
    {
        $request->validate([
            'title'         => 'sometimes|string',
            'description'   => 'sometimes|string',
            'target_amount' => 'sometimes|numeric|min:100000',
            'type'          => 'sometimes|in:bantuan_siswa,proyek_sekolah',
            'start_date'    => 'nullable|date',
            'end_date'      => 'nullable|date|after_or_equal:start_date',
            'image_url'     => 'nullable|url',
            'status'        => 'sometimes|in:active,inactive,closed',
        ]);

        $campaign->update($request->only([
            'title', 'description', 'target_amount', 'image_url',
            'type', 'start_date', 'end_date', 'status'
        ]));

        return (new CampaignResource($campaign->fresh()))
            ->additional(['success' => true]);
    }

    /**
     * Hapus kampanye (tidak bisa jika ada donasi).
     */
    public function destroy(Request $request, Campaign $campaign)
    {
        if ($campaign->current_amount > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Kampanye tidak dapat dihapus karena sudah ada donasi masuk (Rp ' . number_format($campaign->current_amount, 0, ',', '.') . '). Ubah status menjadi "closed" untuk menonaktifkan.',
            ], 422);
        }

        $campaign->fundPool()?->delete();
        $campaign->delete();

        return response()->json(['success' => true, 'message' => 'Kampanye berhasil dihapus.']);
    }
}
