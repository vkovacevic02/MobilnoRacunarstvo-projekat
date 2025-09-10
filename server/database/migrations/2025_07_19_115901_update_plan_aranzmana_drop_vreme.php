<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('plan_aranzmana', function (Blueprint $table) {
            $table->dropColumn('vreme');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('plan_aranzmana', function (Blueprint $table) {
            $table->time('vreme')->nullable()->after('opis');
        });
    }
};
