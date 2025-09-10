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
        Schema::table('aranzmani', function (Blueprint $table) {
            $table->renameColumn('putovanja_id', 'putovanje_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('aranzmani', function (Blueprint $table) {
            $table->renameColumn('putovanje_id', 'putovanja_id');
        });
    }
};
