<?php

namespace App\Enums;

enum BillStatus: string
{
    case Tertunggak = 'Tertunggak';
    case Lunas = 'Lunas';
    case Cicilan = 'Cicilan';

    public function isPaid(): bool
    {
        return $this === self::Lunas;
    }

    public function label(): string
    {
        return $this->value;
    }
}
