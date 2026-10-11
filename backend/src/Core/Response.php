<?php
declare(strict_types=1);

namespace App\Core;

/**
 * Respuestas JSON y cabeceras CORS.
 */
class Response
{
    public static function cors(): void
    {
        $allowed = array_map('trim', explode(',', (string) Env::get('CORS_ORIGIN', 'http://localhost:5173')));
        $origin = $_SERVER['HTTP_ORIGIN'] ?? '';

        if ($origin !== '' && in_array($origin, $allowed, true)) {
            header("Access-Control-Allow-Origin: $origin");
            header('Vary: Origin');
        }

        header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization, Accept');
        header('Access-Control-Max-Age: 86400');
    }

    public static function json(mixed $data, int $status = 200): void
    {
        http_response_code($status);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    }

    public static function error(string $message, int $status = 400, array $errors = []): void
    {
        self::json(['message' => $message, 'errors' => $errors], $status);
    }
}
