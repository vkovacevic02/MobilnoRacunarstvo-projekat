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
        Schema::create('plan_aranzmana', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('aranzman_id');
            $table->foreign('aranzman_id')->references('id')->on('aranzmani')->onDelete('cascade');
            $table->string('dan');
            $table->text('opis')->nullable();
            $table->time('vreme')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('plan_aranzmana');
    }
};
