<?php
declare(strict_types=1);

/**
 * Arranque comun del backend: autoload + configuracion.
 * Lo usan tanto la API (public/index.php) como los scripts (database/seed.php).
 */

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

// 1) Configuracion local (no versionada): config.local.php devuelve un array.
//    Se usa cuando no se puede crear un archivo ".env" (algunos hostings no
//    permiten archivos que empiezan con punto).
$localConfig = __DIR__ . '/config.local.php';
if (is_file($localConfig)) {
    $config = require $localConfig;
    if (is_array($config)) {
        foreach ($config as $key => $value) {
            if (getenv($key) === false || getenv($key) === '') {
                putenv("$key=$value");
                $_ENV[$key] = $value;
            }
        }
    }
}

// 2) Variables desde .env (si existe; no sobreescribe lo ya definido).
\App\Core\Env::load(__DIR__ . '/.env');
