<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PasswordResetMail extends Mailable
{
    use Queueable, SerializesModels;

    public $code;
    public $email;

    /**
     * Create a new message instance.
     */
    public function __construct($email, $code)
    {
        $this->email = $email;
        $this->code = $code;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Resetovanje lozinke - Travel App',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            html: $this->getHtmlContent(),
        );
    }

    private function getHtmlContent()
    {
        return "
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset='utf-8'>
            <meta name='viewport' content='width=device-width, initial-scale=1'>
            <title>Resetovanje lozinke</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #2E86AB; color: white; padding: 20px; text-align: center; }
                .content { background: #f9f9f9; padding: 30px; }
                .code { background: #2E86AB; color: white; font-size: 32px; font-weight: bold; 
                        padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; 
                        letter-spacing: 5px; }
                .footer { background: #333; color: white; padding: 15px; text-align: center; font-size: 12px; }
                .warning { background: #ffeb3b; padding: 15px; border-radius: 5px; margin: 20px 0; }
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='header'>
                    <h1>Travel App</h1>
                    <h2>Resetovanje lozinke</h2>
                </div>
                
                <div class='content'>
                    <p>Poštovani,</p>
                    
                    <p>Primili ste ovaj email jer ste zatražili resetovanje lozinke za vaš nalog.</p>
                    
                    <p>Vaš kod za resetovanje lozinke je:</p>
                    
                    <div class='code'>{$this->code}</div>
                    
                    <div class='warning'>
                        <strong>Važno:</strong> Ovaj kod važi 15 minuta. Ne delite ovaj kod sa drugima.
                    </div>
                    
                    <p>Unesite ovaj kod u aplikaciju da nastavite sa resetovanjem lozinke.</p>
                    
                    <p>Ako niste zatražili resetovanje lozinke, ignorišite ovaj email.</p>
                    
                    <p>Srdačan pozdrav,<br>Travel App tim</p>
                </div>
                
                <div class='footer'>
                    <p>© 2024 Travel App. Sva prava zadržana.</p>
                </div>
            </div>
        </body>
        </html>
        ";
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
