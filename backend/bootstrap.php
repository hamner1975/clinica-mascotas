<?php
declare(strict_types=1);

/**
 * Arranque comun del backend: autoload + variables de entorno.
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

\App\Core\Env::load(__DIR__ . '/.env');
