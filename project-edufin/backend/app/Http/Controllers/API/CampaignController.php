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

    /**
     * Buat donasi ke kampanye.
     */
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
            'payment_status' => 'success', // Simulasi untuk tugas
            'message'        => $request->message,
        ]);

        // Update total donasi kampanye
        $campaign->increment('current_amount', $request->amount);

        return response()->json([
            'success'  => true,
            'donation' => $donation,
        ]);
    }

    /**
     * [Admin] Buat kampanye baru.
     */
    public function store(Request $request)
    {
        $request->validate([
            'title'         => 'required|string',
            'description'   => 'required|string',
            'target_amount' => 'required|numeric|min:100000',
        ]);

        $campaign = Campaign::create($request->only([
            'title', 'description', 'target_amount', 'image_url'
        ]));

        return response()->json(['success' => true, 'campaign' => $campaign], 201);
    }
}
