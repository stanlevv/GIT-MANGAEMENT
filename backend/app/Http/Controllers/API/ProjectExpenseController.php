<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\ProjectExpense;
use App\Models\Campaign;
use Illuminate\Http\Request;

class ProjectExpenseController extends Controller
{
    /**
     * Dapatkan daftar pengeluaran proyek.
     */
    public function index()
    {
        $expenses = ProjectExpense::with(['campaign', 'admin'])->latest()->get();
        return response()->json(['expenses' => $expenses]);
    }

    /**
     * Catat pengeluaran proyek baru (Admin).
     */
    public function store(Request $request)
    {
        $request->validate([
            'campaign_id' => 'required|exists:campaigns,id',
            'amount'      => 'required|numeric|min:1',
            'description' => 'required|string',
            'proof_url'   => 'nullable|string',
        ]);

        $campaign = Campaign::findOrFail($request->campaign_id);
        
        // Pastikan kampanye adalah tipe proyek_sekolah
        if ($campaign->type !== 'proyek_sekolah') {
            return response()->json([
                'success' => false,
                'message' => 'Pengeluaran hanya bisa dicatat untuk kampanye tipe proyek sekolah.'
            ], 400);
        }

        $fundPool = $campaign->fundPool;

        if (!$fundPool || $fundPool->balance < $request->amount) {
            return response()->json([
                'success' => false,
                'message' => 'Saldo fund pool tidak mencukupi untuk pengeluaran ini.'
            ], 400);
        }

        // Potong saldo
        $fundPool->decrement('balance', $request->amount);

        $expense = ProjectExpense::create([
            'campaign_id' => $campaign->id,
            'admin_id'    => $request->user()->id,
            'amount'      => $request->amount,
            'description' => $request->description,
            'proof_url'   => $request->proof_url,
            'status'      => 'approved', // Langsung approved jika dicatat oleh admin
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Pengeluaran proyek berhasil dicatat dan saldo telah dipotong.',
            'expense' => $expense
        ], 201);
    }
}
