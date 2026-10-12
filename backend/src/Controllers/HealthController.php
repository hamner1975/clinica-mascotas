<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Config\Database;
use App\Core\Env;
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
            // Datos de diagnostico (sin contrasena):
            'dbHost' => Env::get('DB_HOST'),
            'dbPort' => Env::get('DB_PORT'),
            'dbName' => Env::get('DB_NAME'),
            'dbUser' => Env::get('DB_USER'),
            'configSource' => defined('APP_CONFIG_SOURCE') ? APP_CONFIG_SOURCE : 'ninguno',
            'time' => date('c'),
        ]);
    }
}
