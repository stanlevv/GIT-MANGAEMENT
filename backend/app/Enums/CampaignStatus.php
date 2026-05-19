<?php

namespace App\Enums;

enum CampaignStatus: string
{
    case Active = 'active';
    case Inactive = 'inactive';
    case Closed = 'closed';

    public function label(): string
    {
        return match ($this) {
            self::Active   => 'Aktif',
            self::Inactive => 'Nonaktif',
            self::Closed   => 'Ditutup',
        };
    }
}
