<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\SupportTicket;
use Illuminate\Http\Request;

class HelpdeskController extends Controller
{
    /**
     * Simpan tiket support baru.
     */
    public function store(Request $request)
    {
        $request->validate([
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        $ticket = SupportTicket::create([
            'user_id' => $request->user()?->id,
            'subject' => $request->subject,
            'message' => $request->message,
            'status'  => 'open',
        ]);

        return response()->json([
            'success'  => true,
            'message'  => 'Tiket berhasil dikirim! Tim kami akan segera merespons.',
            'ticket_id' => $ticket->id,
        ], 201);
    }
}
