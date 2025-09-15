<?php

namespace App\Http\Controllers;

use App\Models\Aranzman;
use Dompdf\Dompdf;
use Dompdf\Options;

class ExportController extends Controller
{
    public function plansPdf()
    {
        $aranzmani = Aranzman::with(['putovanje', 'planAranzmana' => function ($q) {
            $q->orderBy('dan');
        }])->orderBy('datumOd')->get();

        $html = $this->generateHtml($aranzmani);

        $options = new Options();
        $options->set('defaultFont', 'DejaVu Sans');
        $options->set('isRemoteEnabled', true);
        $dompdf = new Dompdf($options);
        $dompdf->loadHtml($html, 'UTF-8');
        $dompdf->setPaper('A4', 'portrait');
        $dompdf->render();

        return response($dompdf->output(), 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="plan_aranzmana.pdf"'
        ]);
    }

    private function generateHtml($aranzmani): string
    {
        $date = now()->format('d.m.Y. H:i');

        $styles = '<style>
            body { font-family: DejaVu Sans, sans-serif; font-size: 12px; color: #111827; }
            h1 { font-size: 20px; text-align: center; margin-bottom: 16px; }
            .meta { font-size: 10px; text-align: center; color: #6b7280; margin-bottom: 24px; }
            .card { border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px; margin-bottom: 12px; }
            .title { font-size: 14px; font-weight: bold; margin: 0 0 4px 0; }
            .subtitle { font-size: 12px; color: #374151; margin: 0 0 8px 0; }
            .row { display: flex; gap: 12px; margin-bottom: 8px; }
            .badge { display: inline-block; background: #eef2ff; color: #3730a3; padding: 2px 8px; border-radius: 9999px; font-size: 10px; }
            table { width: 100%; border-collapse: collapse; margin-top: 8px; }
            th, td { border: 1px solid #e5e7eb; padding: 6px; text-align: left; vertical-align: top; }
            th { background: #f9fafb; font-weight: 600; }
        </style>';

        $content = '<h1>Plan svih aranžmana</h1>';
        $content .= '<div class="meta">Generisano: ' . e($date) . '</div>';

        if ($aranzmani->isEmpty()) {
            $content .= '<p>Nema dostupnih aranžmana.</p>';
        }

        foreach ($aranzmani as $a) {
            $content .= '<div class="card">';
            $content .= '<div class="title">' . e($a->nazivAranzmana) . '</div>';
            $lokacija = $a->putovanje?->lokacija ?: ($a->putovanje?->nazivPutovanja ?: '');
            $content .= '<div class="subtitle">' . e($lokacija) . '</div>';
            $content .= '<div class="row">';
            $content .= '<span class="badge">' . e(date('d.m.Y.', strtotime($a->datumOd))) . ' - ' . e(date('d.m.Y.', strtotime($a->datumDo))) . '</span>';
            $content .= '<span class="badge">Cena: €' . e(number_format((float)$a->cena, 2, ',', '.')) . '</span>';
            if ((float)$a->popust > 0) {
                $content .= '<span class="badge">Popust: ' . e($a->popust) . '%</span>';
            }
            $content .= '<span class="badge">Kapacitet: ' . e($a->kapacitet) . '</span>';
            $content .= '</div>';

            $content .= '<table><thead><tr><th>Dan</th><th>Opis</th></tr></thead><tbody>';
            if ($a->planAranzmana->isEmpty()) {
                $content .= '<tr><td colspan="2">Plan nije definisan.</td></tr>';
            } else {
                foreach ($a->planAranzmana as $p) {
                    $content .= '<tr>';
                    $content .= '<td style="width:80px">' . e($p->dan) . '</td>';
                    $content .= '<td>' . nl2br(e($p->opis)) . '</td>';
                    $content .= '</tr>';
                }
            }
            $content .= '</tbody></table>';
            $content .= '</div>';
        }

        return '<!doctype html><html lang="sr"><head><meta charset="utf-8">' . $styles . '</head><body>' . $content . '</body></html>';
    }
}


