<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Config\Database;
use App\Core\Auth;
use App\Core\Response;
use PDOException;

class UsuarioController extends Controller
{
    /** GET /api/usuarios */
    public static function index(): void
    {
        Auth::require();
        $rows = Database::connection()
            ->query('SELECT u.*, r.nombre AS rol_nombre FROM usuarios u LEFT JOIN roles r ON r.id = u.rol_id ORDER BY u.nombres, u.apellidos')
            ->fetchAll();
        Response::json(['data' => array_map([self::class, 'toApi'], $rows)]);
    }

    /** GET /api/usuarios/{id} */
    public static function show(string $id): void
    {
        Auth::require();
        $row = self::find((int) $id);
        if ($row === null) {
            Response::error('Usuario no encontrado.', 404);
            return;
        }
        Response::json(['data' => self::toApi($row)]);
    }

    /** POST /api/usuarios */
    public static function store(): void
    {
        Auth::require();
        $in = self::input();

        $nombres = self::str($in, 'nombres');
        $apellidos = self::str($in, 'apellidos');
        $email = self::str($in, 'email');
        $password = (string) ($in['password'] ?? '');

        if ($nombres === '' || $apellidos === '' || $email === '') {
            Response::error('Nombres, apellidos y correo son obligatorios.', 422);
            return;
        }
        if (strlen($password) < 6) {
            Response::error('La contrasena debe tener al menos 6 caracteres.', 422);
            return;
        }

        try {
            $pdo = Database::connection();
            $pdo->prepare('INSERT INTO usuarios (nombres, apellidos, documento, email, telefono, password_hash, rol_id, activo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
                ->execute([
                    $nombres,
                    $apellidos,
                    self::str($in, 'documento'),
                    $email,
                    self::str($in, 'telefono'),
                    password_hash($password, PASSWORD_DEFAULT),
                    self::nullableInt($in, 'rolId'),
                    $in['activo'] ?? true ? 1 : 0,
                ]);
            $row = self::find((int) $pdo->lastInsertId());
        } catch (PDOException $e) {
            if ($e->getCode() === '23000') {
                Response::error('El correo ya esta registrado.', 422);
                return;
            }
            throw $e;
        }

        Response::json(['data' => self::toApi($row ?? [])], 201);
    }

    /** PUT /api/usuarios/{id} */
    public static function update(string $id): void
    {
        Auth::require();
        $row = self::find((int) $id);
        if ($row === null) {
            Response::error('Usuario no encontrado.', 404);
            return;
        }

        $in = self::input();
        $nombres = self::str($in, 'nombres');
        $apellidos = self::str($in, 'apellidos');
        $email = self::str($in, 'email');

        if ($nombres === '' || $apellidos === '' || $email === '') {
            Response::error('Nombres, apellidos y correo son obligatorios.', 422);
            return;
        }

        $activo = $in['activo'] ?? true ? 1 : 0;
        $password = (string) ($in['password'] ?? '');

        try {
            $pdo = Database::connection();
            if (strlen($password) >= 6) {
                $pdo->prepare('UPDATE usuarios SET nombres=?, apellidos=?, documento=?, email=?, telefono=?, rol_id=?, activo=?, password_hash=? WHERE id=?')
                    ->execute([
                        $nombres, $apellidos, self::str($in, 'documento'), $email, self::str($in, 'telefono'),
                        self::nullableInt($in, 'rolId'), $activo, password_hash($password, PASSWORD_DEFAULT), (int) $id,
                    ]);
            } else {
                $pdo->prepare('UPDATE usuarios SET nombres=?, apellidos=?, documento=?, email=?, telefono=?, rol_id=?, activo=? WHERE id=?')
                    ->execute([
                        $nombres, $apellidos, self::str($in, 'documento'), $email, self::str($in, 'telefono'),
                        self::nullableInt($in, 'rolId'), $activo, (int) $id,
                    ]);
            }
        } catch (PDOException $e) {
            if ($e->getCode() === '23000') {
                Response::error('El correo ya esta registrado.', 422);
                return;
            }
            throw $e;
        }

        Response::json(['data' => self::toApi(self::find((int) $id) ?? [])]);
    }

    /** PUT /api/usuarios/{id}/estado  { activo } */
    public static function setEstado(string $id): void
    {
        Auth::require();
        if (self::find((int) $id) === null) {
            Response::error('Usuario no encontrado.', 404);
            return;
        }
        $in = self::input();
        $activo = ($in['activo'] ?? false) ? 1 : 0;
        Database::connection()->prepare('UPDATE usuarios SET activo = ? WHERE id = ?')->execute([$activo, (int) $id]);
        Response::json(['data' => self::toApi(self::find((int) $id) ?? [])]);
    }

    /** DELETE /api/usuarios/{id} */
    public static function destroy(string $id): void
    {
        Auth::require();
        if (self::find((int) $id) === null) {
            Response::error('Usuario no encontrado.', 404);
            return;
        }
        Database::connection()->prepare('DELETE FROM usuarios WHERE id = ?')->execute([(int) $id]);
        Response::json(['message' => 'Usuario eliminado.']);
    }

    private static function find(int $id): ?array
    {
        $stmt = Database::connection()->prepare('SELECT u.*, r.nombre AS rol_nombre FROM usuarios u LEFT JOIN roles r ON r.id = u.rol_id WHERE u.id = ? LIMIT 1');
        $stmt->execute([$id]);
        return $stmt->fetch() ?: null;
    }

    private static function toApi(array $row): array
    {
        return [
            'id' => (int) $row['id'],
            'nombres' => $row['nombres'],
            'apellidos' => $row['apellidos'],
            'documento' => $row['documento'],
            'email' => $row['email'],
            'telefono' => $row['telefono'],
            'rolId' => $row['rol_id'] !== null ? (int) $row['rol_id'] : null,
            'rol' => $row['rol_nombre'] ?? null,
            'activo' => (int) $row['activo'] === 1,
            'ultimoAcceso' => $row['ultimo_acceso'],
        ];
    }
}
