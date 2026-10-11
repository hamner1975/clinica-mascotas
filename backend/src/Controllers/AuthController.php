<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Config\Database;
use App\Core\Auth;
use App\Core\Jwt;
use App\Core\Response;
use Throwable;

class AuthController extends Controller
{
    /**
     * POST /api/auth/login  { email, password }
     */
    public static function login(): void
    {
        $input = self::input();
        $email = self::str($input, 'email');
        $password = (string) ($input['password'] ?? '');

        if ($email === '' || $password === '') {
            Response::error('Correo y contrasena son obligatorios.', 422);
            return;
        }

        try {
            $stmt = Database::connection()->prepare(
                'SELECT u.*, r.nombre AS rol
                 FROM usuarios u
                 LEFT JOIN roles r ON r.id = u.rol_id
                 WHERE u.email = ? LIMIT 1'
            );
            $stmt->execute([$email]);
            $user = $stmt->fetch();
        } catch (Throwable $e) {
            Response::error('Error de base de datos: ' . $e->getMessage(), 500);
            return;
        }

        if (!$user || !password_verify($password, $user['password_hash'])) {
            Response::error('Credenciales incorrectas.', 401);
            return;
        }
        if ((int) $user['activo'] !== 1) {
            Response::error('El usuario esta inactivo.', 403);
            return;
        }

        Database::connection()
            ->prepare('UPDATE usuarios SET ultimo_acceso = CURDATE() WHERE id = ?')
            ->execute([$user['id']]);

        $token = Jwt::encode([
            'sub' => (int) $user['id'],
            'email' => $user['email'],
            'rol' => $user['rol'],
        ]);

        Response::json([
            'token' => $token,
            'user' => self::publicUser($user),
        ]);
    }

    /**
     * GET /api/auth/me  (Authorization: Bearer <token>)
     */
    public static function me(): void
    {
        $user = Auth::user();
        if ($user === null) {
            Response::error('No autenticado.', 401);
            return;
        }
        Response::json(['user' => self::publicUser($user)]);
    }

    private static function publicUser(array $u): array
    {
        return [
            'id' => (int) $u['id'],
            'nombres' => $u['nombres'],
            'apellidos' => $u['apellidos'],
            'email' => $u['email'],
            'telefono' => $u['telefono'] ?? '',
            'rol' => $u['rol'] ?? null,
            'activo' => (int) $u['activo'] === 1,
        ];
    }
}
