<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Campaign;
use App\Models\Donation;
use Illuminate\Http\Request;

class CampaignController extends Controller
{
    /**
     * Daftar semua kampanye (publik, tidak perlu login).
     */
    public function index()
    {
        $campaigns = Campaign::withCount('donations')
                             ->where('status', 'active')
                             ->latest()
                             ->get();

        return response()->json(['campaigns' => $campaigns]);
    }

    /**
     * Detail satu kampanye beserta daftar donasi.
     */
    public function show(Campaign $campaign)
    {
        $campaign->load(['donations' => function ($query) {
            $query->orderBy('created_at', 'desc')->limit(10);
        }]);

        return response()->json(['campaign' => $campaign]);
    }

    public function donate(Request $request, Campaign $campaign)
    {
        $request->validate([
            'amount'       => 'required|numeric|min:10000',
            'is_anonymous' => 'boolean',
            'message'      => 'nullable|string|max:255',
        ]);

        $donor_id = auth()->check() ? auth()->id() : null;

        $donation = Donation::create([
            'campaign_id'    => $campaign->id,
            'donor_id'       => $donor_id,
            'amount'         => $request->amount,
            'is_anonymous'   => $request->is_anonymous ?? false,
            'payment_status' => 'pending', 
            'message'        => $request->message,
        ]);

        $order_id = 'DON-' . $donation->id;

        // Simulasi untuk tugas: langsung update via Webhook atau anggap berhasil jika test
        // Pada produksi, kembalikan snap_token Midtrans

        // Jika kita ingin mensimulasikan pembayaran langsung berhasil (seperti sebelum webhook diintegrasikan penuh):
        $donation->update(['payment_status' => 'success']);
        $campaign->increment('current_amount', $request->amount);
        if ($campaign->fundPool) {
            $campaign->fundPool()->increment('balance', $request->amount);
        }

        return response()->json([
            'success'  => true,
            'donation' => $donation,
            'order_id' => $order_id
        ]);
    }

    public function store(Request $request)
    {
        $this->authorizeAdmin($request);

        $request->validate([
            'title'         => 'required|string',
            'description'   => 'required|string',
            'target_amount' => 'required|numeric|min:100000',
            'type'          => 'required|in:bantuan_siswa,proyek_sekolah',
            'start_date'    => 'nullable|date',
            'end_date'      => 'nullable|date|after_or_equal:start_date',
            'image_url'     => 'nullable|url',
            'status'        => 'nullable|in:active,inactive,closed',
        ]);

        $campaign = Campaign::create(array_merge(
            $request->only(['title', 'description', 'target_amount', 'image_url', 'type', 'start_date', 'end_date']),
            ['status' => $request->status ?? 'active', 'current_amount' => 0]
        ));

        $campaign->fundPool()->create(['balance' => 0]);

        return response()->json(['success' => true, 'campaign' => $campaign], 201);
    }

    /**
     * Update kampanye (Admin Sekolah only).
     */
    public function update(Request $request, Campaign $campaign)
    {
        $this->authorizeAdmin($request);

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

        return response()->json(['success' => true, 'campaign' => $campaign->fresh()]);
    }

    /**
     * Hapus kampanye (Admin Sekolah only).
     * Tidak bisa dihapus jika sudah ada donasi atau saldo pool > 0.
     */
    public function destroy(Request $request, Campaign $campaign)
    {
        $this->authorizeAdmin($request);

        if ($campaign->current_amount > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Kampanye tidak dapat dihapus karena sudah ada donasi masuk (Rp ' . number_format($campaign->current_amount, 0, ',', '.') . '). Ubah status menjadi "closed" untuk menonaktifkan.',
            ], 422);
        }

        // Hapus fund pool terkait terlebih dahulu
        $campaign->fundPool()->delete();
        $campaign->delete();

        return response()->json(['success' => true, 'message' => 'Kampanye berhasil dihapus.']);
    }

    /**
     * Helper: pastikan user adalah admin_sekolah.
     */
    private function authorizeAdmin(Request $request): void
    {
        if (!$request->user() || $request->user()->role !== 'admin_sekolah') {
            abort(403, 'Akses ditolak. Hanya Admin Sekolah yang dapat melakukan aksi ini.');
        }
    }
}
