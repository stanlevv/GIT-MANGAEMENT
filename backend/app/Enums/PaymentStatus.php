<?php

namespace App\Enums;

enum PaymentStatus: string
{
    case Pending = 'pending';
    case Success = 'success';
    case Failed = 'failed';
    case Refunded = 'refunded';

    public function isPaid(): bool
    {
        return $this === self::Success;
    }

    public function label(): string
    {
        return match ($this) {
            self::Pending  => 'Menunggu Pembayaran',
            self::Success  => 'Berhasil',
            self::Failed   => 'Gagal',
            self::Refunded => 'Dikembalikan',
        };
    }
}
