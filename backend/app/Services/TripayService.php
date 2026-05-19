<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class TripayService
{
    protected $apiKey;
    protected $privateKey;
    protected $merchantCode;
    protected $baseUrl;
    protected $mode;

    public function __construct()
    {
        $this->apiKey = env('TRIPAY_API_KEY');
        $this->privateKey = env('TRIPAY_PRIVATE_KEY');
        $this->merchantCode = env('TRIPAY_MERCHANT_CODE');
        $this->mode = env('TRIPAY_MODE', 'development'); // 'development' atau 'production'
        
        $this->baseUrl = $this->mode === 'production' 
            ? 'https://tripay.co.id/api' 
            : 'https://tripay.co.id/api-sandbox';
    }

    /**
     * Dapatkan daftar metode pembayaran yang tersedia dari Tripay.
     */
    public function getPaymentChannels()
    {
        $response = Http::withToken($this->apiKey)
            ->withoutVerifying()
            ->get("{$this->baseUrl}/merchant/payment-channel");

        if ($response->successful()) {
            return $response->json();
        }

        Log::error('Tripay Get Payment Channels Error: ' . $response->body());
        return null;
    }

    /**
     * Buat transaksi (Closed Payment)
     * Mengembalikan data termasuk instruksi pembayaran dan checkout_url.
     */
    public function createTransaction($orderId, $amount, $customerDetails, $orderItems, $method = 'BRIVA')
    {
        $signature = hash_hmac('sha256', $this->merchantCode . $orderId . $amount, $this->privateKey);

        $payload = [
            'method'         => $method, // Kode Metode Pembayaran (e.g., BRIVA, ALFAMART, QRIS2)
            'merchant_ref'   => $orderId,
            'amount'         => $amount,
            'customer_name'  => $customerDetails['name'] ?? 'Guest',
            'customer_email' => $customerDetails['email'] ?? 'guest@domain.com',
            'customer_phone' => $customerDetails['phone'] ?? '081234567890',
            'order_items'    => $orderItems,
            'return_url'     => env('FRONTEND_URL', 'http://localhost:5173') . '/student',
            'expired_time'   => (time() + (24 * 60 * 60)), // 24 jam kadaluarsa
            'signature'      => $signature
        ];

        $response = Http::withToken($this->apiKey)
            ->withoutVerifying()
            ->post("{$this->baseUrl}/transaction/create", $payload);

        if ($response->successful()) {
            return $response->json();
        }

        Log::error('Tripay Create Transaction Error: ' . $response->body());
        return [
            'success' => false,
            'message' => $response->json('message') ?? 'Gagal membuat transaksi Tripay'
        ];
    }

    /**
     * Validasi Callback / Webhook Signature dari Tripay
     */
    public function validateCallbackSignature($request)
    {
        $json = $request->getContent();
        $signature = hash_hmac('sha256', $json, $this->privateKey);
        
        $tripaySignature = $request->header('X-Callback-Signature');
        
        return hash_equals($signature, $tripaySignature);
    }
}
