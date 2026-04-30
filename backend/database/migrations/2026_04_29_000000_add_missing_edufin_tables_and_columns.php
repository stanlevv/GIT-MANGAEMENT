<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Modify campaigns table
        Schema::table('campaigns', function (Blueprint $table) {
            $table->string('type')->default('bantuan_siswa')->after('id'); // bantuan_siswa, proyek_sekolah
        });

        // 2. Create fund_pools table
        Schema::create('fund_pools', function (Blueprint $table) {
            $table->id();
            $table->foreignId('campaign_id')->constrained('campaigns')->onDelete('cascade');
            $table->decimal('balance', 12, 2)->default(0);
            $table->timestamps();
        });

        // 3. Create project_expenses table
        Schema::create('project_expenses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('campaign_id')->constrained('campaigns')->onDelete('cascade');
            $table->foreignId('admin_id')->constrained('users')->onDelete('cascade');
            $table->decimal('amount', 12, 2);
            $table->text('description');
            $table->string('proof_url')->nullable();
            $table->string('status')->default('pending'); // pending, approved
            $table->timestamps();
        });

        // 4. Modify aid_requests table
        Schema::table('aid_requests', function (Blueprint $table) {
            $table->foreignId('fund_pool_id')->nullable()->after('student_id')->constrained('fund_pools')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::table('aid_requests', function (Blueprint $table) {
            $table->dropForeign(['fund_pool_id']);
            $table->dropColumn('fund_pool_id');
        });

        Schema::dropIfExists('project_expenses');
        Schema::dropIfExists('fund_pools');

        Schema::table('campaigns', function (Blueprint $table) {
            $table->dropColumn('type');
        });
    }
};
