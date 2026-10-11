<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Config\Database;
use App\Core\Response;
use Throwable;

class HealthController
{
    public static function index(): void
    {
        $db = false;
        $dbError = null;

        try {
            Database::connection()->query('SELECT 1');
            $db = true;
        } catch (Throwable $e) {
            $dbError = $e->getMessage();
        }

        Response::json([
            'ok' => true,
            'service' => 'Clinica Mascotas API',
            'php' => PHP_VERSION,
            'db' => $db,
            'dbError' => $dbError,
            'time' => date('c'),
        ]);
    }
}
