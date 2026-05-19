<?php

namespace App\Enums;

enum UserRole: string
{
    case Parent = 'parent';
    case Student = 'student';
    case AdminSekolah = 'admin_sekolah';
    case Donor = 'donor';

    public function isStudentOrParent(): bool
    {
        return in_array($this, [self::Parent, self::Student]);
    }

    public function isAdmin(): bool
    {
        return $this === self::AdminSekolah;
    }

    public function label(): string
    {
        return match ($this) {
            self::Parent       => 'Orang Tua',
            self::Student      => 'Siswa',
            self::AdminSekolah => 'Admin Sekolah',
            self::Donor        => 'Donatur',
        };
    }
}
