<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Tambahkan kolom start_date, end_date, dan avatar ke tabel yang relevan.
 * 
 * - campaigns.start_date: tanggal mulai kampanye
 * - campaigns.end_date: tanggal berakhir kampanye
 * - users.avatar: URL foto profil (untuk Google OAuth)
 */
return new class extends Migration
{
    public function up(): void
    {
        // Tambah start_date & end_date ke campaigns
        Schema::table('campaigns', function (Blueprint $table) {
            $table->date('start_date')->nullable()->after('type');
            $table->date('end_date')->nullable()->after('start_date');
        });

        // Tambah avatar ke users (untuk Google OAuth profile picture)
        if (!Schema::hasColumn('users', 'avatar')) {
            Schema::table('users', function (Blueprint $table) {
                $table->string('avatar')->nullable()->after('role');
            });
        }
    }

    public function down(): void
    {
        Schema::table('campaigns', function (Blueprint $table) {
            $table->dropColumn(['start_date', 'end_date']);
        });

        if (Schema::hasColumn('users', 'avatar')) {
            Schema::table('users', function (Blueprint $table) {
                $table->dropColumn('avatar');
            });
        }
    }
};
