<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Core\Auth;
use App\Core\Env;
use App\Core\Response;

/**
 * Utilidades de desarrollo (solo en entorno local).
 */
class DevController extends Controller
{
    /** POST /api/dev/reseed  - vuelve a cargar los datos de ejemplo. */
    public static function reseed(): void
    {
        Auth::require();

        if (Env::get('APP_ENV') !== 'local') {
            Response::error('No disponible en este entorno.', 403);
            return;
        }

        ob_start();
        require __DIR__ . '/../../database/seed.php';
        ob_end_clean();

        Response::json(['message' => 'Datos de ejemplo restaurados.']);
    }
}
