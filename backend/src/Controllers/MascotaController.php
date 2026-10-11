<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Config\Database;
use App\Core\Auth;
use App\Core\Response;

class MascotaController extends Controller
{
    /** GET /api/mascotas */
    public static function index(): void
    {
        Auth::require();
        $rows = Database::connection()
            ->query('SELECT * FROM mascotas ORDER BY nombre')
            ->fetchAll();
        Response::json(['data' => array_map([self::class, 'toApi'], $rows)]);
    }

    /** GET /api/mascotas/{id} */
    public static function show(string $id): void
    {
        Auth::require();
        $row = self::find((int) $id);
        if ($row === null) {
            Response::error('Mascota no encontrada.', 404);
            return;
        }
        Response::json(['data' => self::toApi($row)]);
    }

    /** POST /api/mascotas */
    public static function store(): void
    {
        Auth::require();
        $in = self::input();

        if (self::str($in, 'nombre') === '' || self::str($in, 'especie') === '') {
            Response::error('Nombre y especie son obligatorios.', 422);
            return;
        }

        $pdo = Database::connection();
        $pdo->prepare(
            'INSERT INTO mascotas (nombre, especie, raza, sexo, fecha_nacimiento, peso, color, dueno_id, esterilizado, notas, foto)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
        )->execute(self::bindings($in));

        $row = self::find((int) $pdo->lastInsertId());
        Response::json(['data' => self::toApi($row ?? [])], 201);
    }

    /** PUT /api/mascotas/{id} */
    public static function update(string $id): void
    {
        Auth::require();
        $row = self::find((int) $id);
        if ($row === null) {
            Response::error('Mascota no encontrada.', 404);
            return;
        }

        $in = self::input();
        if (self::str($in, 'nombre') === '' || self::str($in, 'especie') === '') {
            Response::error('Nombre y especie son obligatorios.', 422);
            return;
        }

        $values = self::bindings($in);
        $values[] = (int) $id;
        Database::connection()->prepare(
            'UPDATE mascotas SET nombre=?, especie=?, raza=?, sexo=?, fecha_nacimiento=?, peso=?, color=?, dueno_id=?, esterilizado=?, notas=?, foto=? WHERE id=?'
        )->execute($values);

        Response::json(['data' => self::toApi(self::find((int) $id) ?? [])]);
    }

    /** DELETE /api/mascotas/{id} */
    public static function destroy(string $id): void
    {
        Auth::require();
        $row = self::find((int) $id);
        if ($row === null) {
            Response::error('Mascota no encontrada.', 404);
            return;
        }
        Database::connection()->prepare('DELETE FROM mascotas WHERE id = ?')->execute([(int) $id]);
        Response::json(['message' => 'Mascota eliminada.']);
    }

    private static function bindings(array $in): array
    {
        return [
            self::str($in, 'nombre'),
            self::str($in, 'especie'),
            self::str($in, 'raza'),
            self::str($in, 'sexo'),
            self::str($in, 'fechaNacimiento') ?: null,
            self::nullableDecimal($in, 'peso'),
            self::str($in, 'color'),
            self::nullableInt($in, 'duenoId'),
            self::bool($in, 'esterilizado'),
            self::str($in, 'notas'),
            self::str($in, 'foto') ?: null,
        ];
    }

    private static function find(int $id): ?array
    {
        $stmt = Database::connection()->prepare('SELECT * FROM mascotas WHERE id = ? LIMIT 1');
        $stmt->execute([$id]);
        return $stmt->fetch() ?: null;
    }

    private static function toApi(array $row): array
    {
        return [
            'id' => (int) $row['id'],
            'nombre' => $row['nombre'],
            'especie' => $row['especie'],
            'raza' => $row['raza'],
            'sexo' => $row['sexo'],
            'fechaNacimiento' => $row['fecha_nacimiento'],
            'peso' => $row['peso'] !== null ? (float) $row['peso'] : null,
            'color' => $row['color'],
            'duenoId' => $row['dueno_id'] !== null ? (int) $row['dueno_id'] : null,
            'esterilizado' => (int) $row['esterilizado'] === 1,
            'notas' => $row['notas'],
            'foto' => $row['foto'],
        ];
    }
}
