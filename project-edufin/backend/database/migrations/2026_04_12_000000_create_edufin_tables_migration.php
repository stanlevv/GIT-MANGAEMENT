<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Modifikasi tabel Users (sudah ada bawaan Laravel, kita tambah kolom role)
        Schema::table('users', function (Blueprint $table) {
            $table->string('role')->default('parent'); // admin_sekolah, student, parent, donor
            $table->string('phone_number')->nullable();
        });

        // 2. Tabel Students (Siswa)
        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->foreignId('parent_id')->nullable()->constrained('users')->onDelete('cascade');
            $table->string('name');
            $table->string('nisn')->unique();
            $table->string('school_name');
            $table->string('class_name');
            $table->text('address')->nullable();
            $table->timestamps();
        });

        // 3. Tabel Bills (Tagihan SPP dll)
        Schema::create('bills', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->onDelete('cascade');
            $table->string('month'); // e.g. "Mei 2025"
            $table->enum('status', ['Lunas', 'Tertunggak', 'Menunggu Pembayaran'])->default('Tertunggak');
            $table->date('due_date');
            $table->decimal('total_amount', 12, 2)->default(0);
            $table->json('items'); // JSON berisi detail: [{name: "SPP", amount: 500000}, ...]
            $table->timestamps();
        });

        // 4. Tabel Payments (Pembayaran)
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('receipt_no')->unique();
            $table->decimal('amount_paid', 12, 2);
            $table->string('payment_method'); // qris, bca, bni, dll
            $table->string('payment_status'); // pending, success, failed
            $table->string('payment_type'); // penuh, 2x, 3x
            $table->string('midtrans_transaction_id')->nullable(); 
            $table->json('bill_ids'); // Array tagihan yang dibayar
            $table->timestamps();
        });

        // 5. Tabel Campaigns (Kampanye Donasi)
        Schema::create('campaigns', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->decimal('target_amount', 12, 2);
            $table->decimal('current_amount', 12, 2)->default(0);
            $table->string('image_url')->nullable();
            $table->string('status')->default('active'); // active, completed
            $table->timestamps();
        });

        // 6. Tabel Donations (Transaksi Donasi)
        Schema::create('donations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('campaign_id')->constrained('campaigns')->onDelete('cascade');
            $table->foreignId('donor_id')->nullable()->constrained('users')->onDelete('set null');
            $table->decimal('amount', 12, 2);
            $table->boolean('is_anonymous')->default(false);
            $table->string('payment_status')->default('pending');
            $table->text('message')->nullable();
            $table->timestamps();
        });

        // 7. Tabel Aid Requests (Permintaan Bantuan)
        Schema::create('aid_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade'); // Parent yang ajukan
            $table->foreignId('student_id')->constrained('students')->onDelete('cascade');
            $table->json('bill_ids'); // Tagihan yang diajukan bantuan
            $table->text('reason'); // Alasan pengajuan
            $table->string('status')->default('pending'); // pending, approved, rejected
            $table->timestamps();
        });

        // 8. Tabel Support Tickets (Bantuan IT)
        Schema::create('support_tickets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('cascade');
            $table->string('subject');
            $table->text('message');
            $table->string('status')->default('open');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('support_tickets');
        Schema::dropIfExists('aid_requests');
        Schema::dropIfExists('donations');
        Schema::dropIfExists('campaigns');
        Schema::dropIfExists('payments');
        Schema::dropIfExists('bills');
        Schema::dropIfExists('students');
        
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['role', 'phone_number']);
        });
    }
};
