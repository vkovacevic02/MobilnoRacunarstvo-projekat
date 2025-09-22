<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('putnici', function (Blueprint $table) {
            if (Schema::hasColumn('putnici', 'brojPutnika') && !Schema::hasColumn('putnici', 'broj_putnika')) {
                $table->renameColumn('brojPutnika', 'broj_putnika');
            }
        });
    }

    public function down(): void
    {
        Schema::table('putnici', function (Blueprint $table) {
            if (Schema::hasColumn('putnici', 'broj_putnika') && !Schema::hasColumn('putnici', 'brojPutnika')) {
                $table->renameColumn('broj_putnika', 'brojPutnika');
            }
        });
    }
};



