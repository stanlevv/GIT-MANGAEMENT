<?php

namespace App\Enums;

enum CampaignType: string
{
    case BantuanSiswa = 'bantuan_siswa';
    case ProyekSekolah = 'proyek_sekolah';

    public function label(): string
    {
        return match ($this) {
            self::BantuanSiswa  => 'Bantuan Siswa',
            self::ProyekSekolah => 'Proyek Sekolah',
        };
    }
}
