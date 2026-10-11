<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Config\Database;
use App\Core\Auth;
use App\Core\Response;

class DuenoController extends Controller
{
    /** GET /api/duenos */
    public static function index(): void
    {
        Auth::require();
        $rows = Database::connection()
            ->query('SELECT * FROM duenos ORDER BY nombres, apellidos')
            ->fetchAll();
        Response::json(['data' => array_map([self::class, 'toApi'], $rows)]);
    }

    /** GET /api/duenos/{id} */
    public static function show(string $id): void
    {
        Auth::require();
        $row = self::find((int) $id);
        if ($row === null) {
            Response::error('Dueno no encontrado.', 404);
            return;
        }
        Response::json(['data' => self::toApi($row)]);
    }

    /** POST /api/duenos */
    public static function store(): void
    {
        Auth::require();
        $in = self::input();

        if (self::str($in, 'nombres') === '' || self::str($in, 'apellidos') === '') {
            Response::error('Nombres y apellidos son obligatorios.', 422);
            return;
        }

        $pdo = Database::connection();
        $pdo->prepare('INSERT INTO duenos (nombres, apellidos, documento, email, telefono, direccion, notas) VALUES (?, ?, ?, ?, ?, ?, ?)')
            ->execute([
                self::str($in, 'nombres'),
                self::str($in, 'apellidos'),
                self::str($in, 'documento'),
                self::str($in, 'email'),
                self::str($in, 'telefono'),
                self::str($in, 'direccion'),
                self::str($in, 'notas'),
            ]);

        $row = self::find((int) $pdo->lastInsertId());
        Response::json(['data' => self::toApi($row ?? [])], 201);
    }

    /** PUT /api/duenos/{id} */
    public static function update(string $id): void
    {
        Auth::require();
        $row = self::find((int) $id);
        if ($row === null) {
            Response::error('Dueno no encontrado.', 404);
            return;
        }

        $in = self::input();
        if (self::str($in, 'nombres') === '' || self::str($in, 'apellidos') === '') {
            Response::error('Nombres y apellidos son obligatorios.', 422);
            return;
        }

        Database::connection()
            ->prepare('UPDATE duenos SET nombres=?, apellidos=?, documento=?, email=?, telefono=?, direccion=?, notas=? WHERE id=?')
            ->execute([
                self::str($in, 'nombres'),
                self::str($in, 'apellidos'),
                self::str($in, 'documento'),
                self::str($in, 'email'),
                self::str($in, 'telefono'),
                self::str($in, 'direccion'),
                self::str($in, 'notas'),
                (int) $id,
            ]);

        Response::json(['data' => self::toApi(self::find((int) $id) ?? [])]);
    }

    /** DELETE /api/duenos/{id} */
    public static function destroy(string $id): void
    {
        Auth::require();
        $row = self::find((int) $id);
        if ($row === null) {
            Response::error('Dueno no encontrado.', 404);
            return;
        }

        $count = Database::connection()->prepare('SELECT COUNT(*) FROM mascotas WHERE dueno_id = ?');
        $count->execute([(int) $id]);
        if ((int) $count->fetchColumn() > 0) {
            Response::error('No se puede eliminar: el dueno tiene mascotas registradas.', 409);
            return;
        }

        Database::connection()->prepare('DELETE FROM duenos WHERE id = ?')->execute([(int) $id]);
        Response::json(['message' => 'Dueno eliminado.']);
    }

    private static function find(int $id): ?array
    {
        $stmt = Database::connection()->prepare('SELECT * FROM duenos WHERE id = ? LIMIT 1');
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
            'direccion' => $row['direccion'],
            'notas' => $row['notas'],
        ];
    }
}
