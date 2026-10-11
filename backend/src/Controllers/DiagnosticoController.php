<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Config\Database;
use App\Core\Auth;
use App\Core\Response;

class DiagnosticoController extends Controller
{
    /** GET /api/diagnosticos */
    public static function index(): void
    {
        Auth::require();
        $rows = Database::connection()
            ->query('SELECT * FROM diagnosticos ORDER BY codigo')
            ->fetchAll();
        Response::json(['data' => array_map([self::class, 'toApi'], $rows)]);
    }

    /** GET /api/diagnosticos/{id} */
    public static function show(string $id): void
    {
        Auth::require();
        $row = self::find((int) $id);
        if ($row === null) {
            Response::error('Diagnostico no encontrado.', 404);
            return;
        }
        Response::json(['data' => self::toApi($row)]);
    }

    /** POST /api/diagnosticos */
    public static function store(): void
    {
        Auth::require();
        $in = self::input();
        if (self::str($in, 'nombre') === '') {
            Response::error('El nombre es obligatorio.', 422);
            return;
        }

        $pdo = Database::connection();
        $pdo->prepare('INSERT INTO diagnosticos (codigo, nombre, categoria, especie, contagioso, activo, descripcion) VALUES (?, ?, ?, ?, ?, ?, ?)')
            ->execute(self::bindings($in));

        Response::json(['data' => self::toApi(self::find((int) $pdo->lastInsertId()) ?? [])], 201);
    }

    /** PUT /api/diagnosticos/{id} */
    public static function update(string $id): void
    {
        Auth::require();
        $row = self::find((int) $id);
        if ($row === null) {
            Response::error('Diagnostico no encontrado.', 404);
            return;
        }

        $in = self::input();
        if (self::str($in, 'nombre') === '') {
            Response::error('El nombre es obligatorio.', 422);
            return;
        }

        $values = self::bindings($in);
        $values[] = (int) $id;
        Database::connection()->prepare('UPDATE diagnosticos SET codigo=?, nombre=?, categoria=?, especie=?, contagioso=?, activo=?, descripcion=? WHERE id=?')
            ->execute($values);

        Response::json(['data' => self::toApi(self::find((int) $id) ?? [])]);
    }

    /** DELETE /api/diagnosticos/{id} */
    public static function destroy(string $id): void
    {
        Auth::require();
        if (self::find((int) $id) === null) {
            Response::error('Diagnostico no encontrado.', 404);
            return;
        }
        Database::connection()->prepare('DELETE FROM diagnosticos WHERE id = ?')->execute([(int) $id]);
        Response::json(['message' => 'Diagnostico eliminado.']);
    }

    private static function bindings(array $in): array
    {
        return [
            self::str($in, 'codigo'),
            self::str($in, 'nombre'),
            self::str($in, 'categoria'),
            self::str($in, 'especie', 'Todas'),
            self::bool($in, 'contagioso'),
            $in['activo'] ?? true ? 1 : 0,
            self::str($in, 'descripcion'),
        ];
    }

    private static function find(int $id): ?array
    {
        $stmt = Database::connection()->prepare('SELECT * FROM diagnosticos WHERE id = ? LIMIT 1');
        $stmt->execute([$id]);
        return $stmt->fetch() ?: null;
    }

    private static function toApi(array $row): array
    {
        return [
            'id' => (int) $row['id'],
            'codigo' => $row['codigo'],
            'nombre' => $row['nombre'],
            'categoria' => $row['categoria'],
            'especie' => $row['especie'],
            'contagioso' => (int) $row['contagioso'] === 1,
            'activo' => (int) $row['activo'] === 1,
            'descripcion' => $row['descripcion'],
        ];
    }
}
