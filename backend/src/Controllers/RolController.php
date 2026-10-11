<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Config\Database;
use App\Core\Auth;
use App\Core\Response;

class RolController extends Controller
{
    /** GET /api/roles */
    public static function index(): void
    {
        Auth::require();
        $rows = Database::connection()
            ->query('SELECT * FROM roles ORDER BY id')
            ->fetchAll();
        Response::json(['data' => array_map([self::class, 'toApi'], $rows)]);
    }

    /** GET /api/roles/{id} */
    public static function show(string $id): void
    {
        Auth::require();
        $row = self::find((int) $id);
        if ($row === null) {
            Response::error('Rol no encontrado.', 404);
            return;
        }
        Response::json(['data' => self::toApi($row)]);
    }

    /** POST /api/roles */
    public static function store(): void
    {
        Auth::require();
        $in = self::input();
        if (self::str($in, 'nombre') === '') {
            Response::error('El nombre del rol es obligatorio.', 422);
            return;
        }

        $pdo = Database::connection();
        $pdo->prepare('INSERT INTO roles (nombre, descripcion, permisos, sistema) VALUES (?, ?, ?, 0)')
            ->execute([self::str($in, 'nombre'), self::str($in, 'descripcion'), json_encode($in['permisos'] ?? [])]);

        Response::json(['data' => self::toApi(self::find((int) $pdo->lastInsertId()) ?? [])], 201);
    }

    /** PUT /api/roles/{id} */
    public static function update(string $id): void
    {
        Auth::require();
        $row = self::find((int) $id);
        if ($row === null) {
            Response::error('Rol no encontrado.', 404);
            return;
        }

        $in = self::input();
        if (self::str($in, 'nombre') === '') {
            Response::error('El nombre del rol es obligatorio.', 422);
            return;
        }

        $permisos = (int) $row['sistema'] === 1 ? $row['permisos'] : json_encode($in['permisos'] ?? []);

        Database::connection()->prepare('UPDATE roles SET nombre=?, descripcion=?, permisos=? WHERE id=?')
            ->execute([self::str($in, 'nombre'), self::str($in, 'descripcion'), $permisos, (int) $id]);

        Response::json(['data' => self::toApi(self::find((int) $id) ?? [])]);
    }

    /** DELETE /api/roles/{id} */
    public static function destroy(string $id): void
    {
        Auth::require();
        $row = self::find((int) $id);
        if ($row === null) {
            Response::error('Rol no encontrado.', 404);
            return;
        }
        if ((int) $row['sistema'] === 1) {
            Response::error('Los roles de sistema no se pueden eliminar.', 403);
            return;
        }

        $count = Database::connection()->prepare('SELECT COUNT(*) FROM usuarios WHERE rol_id = ?');
        $count->execute([(int) $id]);
        if ((int) $count->fetchColumn() > 0) {
            Response::error('No se puede eliminar: hay usuarios con este rol.', 409);
            return;
        }

        Database::connection()->prepare('DELETE FROM roles WHERE id = ?')->execute([(int) $id]);
        Response::json(['message' => 'Rol eliminado.']);
    }

    private static function find(int $id): ?array
    {
        $stmt = Database::connection()->prepare('SELECT * FROM roles WHERE id = ? LIMIT 1');
        $stmt->execute([$id]);
        return $stmt->fetch() ?: null;
    }

    private static function toApi(array $row): array
    {
        return [
            'id' => (int) $row['id'],
            'nombre' => $row['nombre'],
            'descripcion' => $row['descripcion'],
            'permisos' => json_decode((string) $row['permisos'], true) ?: [],
            'sistema' => (int) $row['sistema'] === 1,
        ];
    }
}
