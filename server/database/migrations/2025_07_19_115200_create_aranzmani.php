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
        Schema::create('aranzmani', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('putovanja_id');
            $table->foreign('putovanja_id')->references('id')->on('putovanja')->onDelete('cascade');
            $table->string('nazivAranzmana');
            $table->date('datumOd');
            $table->date('datumDo');
            $table->decimal('popust', 5, 2)->default(0.00);
            $table->decimal('cena', 10, 2);
            $table->integer('kapacitet')->default(10);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('aranzmani');
    }
};
