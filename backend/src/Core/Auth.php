<?php
declare(strict_types=1);

namespace App\Core;

use App\Config\Database;
use Throwable;

/**
 * Autenticacion por token JWT (Authorization: Bearer).
 */
class Auth
{
    /** Devuelve la fila del usuario autenticado (con su rol) o null. */
    public static function user(): ?array
    {
        $header = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
        if (!preg_match('/Bearer\s+(.+)/i', $header, $matches)) {
            return null;
        }

        $payload = Jwt::decode(trim($matches[1]));
        if ($payload === null || empty($payload['sub'])) {
            return null;
        }

        try {
            $stmt = Database::connection()->prepare(
                'SELECT u.*, r.nombre AS rol
                 FROM usuarios u
                 LEFT JOIN roles r ON r.id = u.rol_id
                 WHERE u.id = ? LIMIT 1'
            );
            $stmt->execute([$payload['sub']]);
            $user = $stmt->fetch();
        } catch (Throwable) {
            return null;
        }

        return $user ?: null;
    }

    /** Exige sesion; si no hay, responde 401 y termina. */
    public static function require(): array
    {
        $user = self::user();
        if ($user === null) {
            Response::error('No autenticado.', 401);
            exit;
        }
        return $user;
    }
}
