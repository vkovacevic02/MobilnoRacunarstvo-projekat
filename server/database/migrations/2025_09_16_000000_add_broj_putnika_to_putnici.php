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
        Schema::table('putnici', function (Blueprint $table) {
            if (!Schema::hasColumn('putnici', 'brojPutnika')) {
                $table->unsignedInteger('brojPutnika')->default(1)->after('ukupnaCenaAranzmana');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('putnici', function (Blueprint $table) {
            if (Schema::hasColumn('putnici', 'brojPutnika')) {
                $table->dropColumn('brojPutnika');
            }
        });
    }
};



