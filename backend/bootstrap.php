<?php
declare(strict_types=1);

/**
 * Arranque comun del backend: autoload + configuracion.
 * Lo usan tanto la API (public/index.php) como los scripts (database/seed.php).
 *
 * NOTA: Este archivo incluye la configuracion de produccion directamente,
 * para no depender de archivos ".env" ni "config.local.php".
 */

define('APP_CONFIG_SOURCE', 'bootstrap-inline');

spl_autoload_register(function (string $class): void {
    $prefix = 'App\\';
    if (!str_starts_with($class, $prefix)) {
        return;
    }
    $relative = substr($class, strlen($prefix));
    $file = __DIR__ . '/src/' . str_replace('\\', '/', $relative) . '.php';
    if (is_file($file)) {
        require $file;
    }
});

// ---- Configuracion (InfinityFree) ----
$config = [
    'APP_ENV' => 'production',
    'APP_URL' => 'https://dulceria.infinityfreeapp.com',
    'API_BASE' => '/clinica/backend/public',

    'JWT_SECRET' => 'mascotas-9f3c1a7e2b4d8c0f5a6e1d9b3c7f2a8e',

    'DB_HOST' => 'sql201.infinityfree.com',
    'DB_PORT' => '3306',
    'DB_NAME' => 'if0_43071431_clinica',
    'DB_USER' => 'if0_43071431',
    'DB_PASS' => 'DYZGvjTmJs9kY3l',

    'CORS_ORIGIN' => 'https://dulceria.infinityfreeapp.com',
];

foreach ($config as $key => $value) {
    if (getenv($key) === false || getenv($key) === '') {
        putenv("$key=$value");
        $_ENV[$key] = $value;
    }
}

// Si ademas existe un .env, se respeta (no sobreescribe lo anterior).
\App\Core\Env::load(__DIR__ . '/.env');
