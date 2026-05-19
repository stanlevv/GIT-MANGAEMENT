<?php

namespace App\Http\Controllers\API;

use App\Actions\AidRequest\ApproveAidRequestAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\AidRequest\StoreAidRequestRequest;
use App\Http\Resources\AidRequestResource;
use App\Models\AidRequest;
use Illuminate\Http\Request;

class AidRequestController extends Controller
{
    /**
     * Dapatkan semua pengajuan bantuan (Admin view).
     */
    public function index()
    {
        $aidRequests = AidRequest::with(['user', 'student', 'fundPool.campaign'])->latest()->get();

        return AidRequestResource::collection($aidRequests)
            ->additional(['success' => true]);
    }

    /**
     * Dapatkan pengajuan bantuan milik user saat ini.
     */
    public function myRequests(Request $request)
    {
        $aidRequests = AidRequest::with(['student'])
            ->where('user_id', $request->user()->id)
            ->latest()
            ->get();

        return AidRequestResource::collection($aidRequests)
            ->additional(['success' => true]);
    }

    /**
     * Ajukan permohonan bantuan dana.
     */
    public function store(StoreAidRequestRequest $request)
    {
        $aidRequest = AidRequest::create([
            'user_id'    => $request->user()->id,
            'student_id' => $request->student_id,
            'bill_ids'   => $request->bill_ids,
            'reason'     => $request->reason,
            'status'     => 'pending',
        ]);

        return (new AidRequestResource($aidRequest))
            ->additional(['success' => true])
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Setujui pengajuan — delegated to Action.
     */
    public function approve(Request $request, AidRequest $aidRequest, ApproveAidRequestAction $action)
    {
        $request->validate(['fund_pool_id' => 'required|exists:fund_pools,id']);

        $updated = $action->execute($aidRequest, $request->fund_pool_id);

        return (new AidRequestResource($updated))
            ->additional([
                'success' => true,
                'message' => 'Pengajuan bantuan disetujui dan dana telah dipotong dari Fund Pool.',
            ]);
    }

    /**
     * Tolak pengajuan (Admin).
     */
    public function reject(Request $request, AidRequest $aidRequest)
    {
        $aidRequest->update(['status' => 'rejected']);

        return response()->json(['success' => true, 'message' => 'Pengajuan ditolak.']);
    }
}
