<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('slia_members')) {
            return;
        }

        DB::statement("ALTER TABLE slia_members MODIFY membership_type ENUM('Student', 'Graduate', 'Associate', 'Fellow', 'Honorary Fellow') NULL");
    }

    public function down(): void
    {
        if (!Schema::hasTable('slia_members')) {
            return;
        }

        DB::statement("ALTER TABLE slia_members MODIFY membership_type ENUM('Student', 'Graduate', 'Associate') NULL");
    }
};
