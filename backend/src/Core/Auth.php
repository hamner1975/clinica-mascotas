<?php
declare(strict_types=1);

namespace App\Core;

use App\Config\Database;
use Throwable;

/**
 * Autenticacion por token JWT (Authorization: Bearer) y permisos por rol.
 */
class Auth
{
    /** Devuelve la fila del usuario autenticado (con rol y permisos) o null. */
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
                'SELECT u.*, r.nombre AS rol_nombre, r.permisos AS rol_permisos
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

    /** Lista de permisos del usuario autenticado. */
    public static function permisos(): array
    {
        $user = self::user();
        if ($user === null) {
            return [];
        }
        $permisos = json_decode((string) ($user['rol_permisos'] ?? '[]'), true);
        return is_array($permisos) ? $permisos : [];
    }

    public static function can(string $permiso): bool
    {
        return in_array($permiso, self::permisos(), true);
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

    /** Exige sesion y permiso; si no, responde 401/403 y termina. */
    public static function requirePerm(string $permiso): void
    {
        self::require();
        if (!self::can($permiso)) {
            Response::error('No tienes permiso para realizar esta accion.', 403);
            exit;
        }
    }
}
