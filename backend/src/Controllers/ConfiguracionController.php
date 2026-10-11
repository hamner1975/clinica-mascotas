<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Config\Database;
use App\Core\Auth;
use App\Core\Response;

class ConfiguracionController extends Controller
{
    /** GET /api/configuracion  (publico: lo usa la web) */
    public static function show(): void
    {
        $row = Database::connection()->query('SELECT contenido FROM configuracion WHERE id = 1')->fetch();
        $contenido = $row ? json_decode((string) $row['contenido'], true) : null;
        Response::json(['data' => $contenido]);
    }

    /** PUT /api/configuracion */
    public static function update(): void
    {
        Auth::require();
        $contenido = self::input();

        Database::connection()
            ->prepare('INSERT INTO configuracion (id, contenido) VALUES (1, ?) ON DUPLICATE KEY UPDATE contenido = VALUES(contenido)')
            ->execute([json_encode($contenido)]);

        Response::json(['data' => $contenido]);
    }
}
