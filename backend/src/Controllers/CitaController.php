<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Config\Database;
use App\Core\Auth;
use App\Core\Response;

class CitaController extends Controller
{
    /** GET /api/citas */
    public static function index(): void
    {
        Auth::require();
        $rows = Database::connection()
            ->query('SELECT * FROM citas ORDER BY fecha, hora')
            ->fetchAll();
        Response::json(['data' => array_map([self::class, 'toApi'], $rows)]);
    }

    /** GET /api/citas/{id} */
    public static function show(string $id): void
    {
        Auth::require();
        $row = self::find((int) $id);
        if ($row === null) {
            Response::error('Cita no encontrada.', 404);
            return;
        }
        Response::json(['data' => self::toApi($row)]);
    }

    /** POST /api/citas */
    public static function store(): void
    {
        Auth::require();
        $in = self::input();

        if (self::str($in, 'fecha') === '' || self::str($in, 'hora') === '' || self::str($in, 'motivo') === '') {
            Response::error('Fecha, hora y motivo son obligatorios.', 422);
            return;
        }

        $pdo = Database::connection();
        $pdo->prepare('INSERT INTO citas (mascota_id, fecha, hora, motivo, veterinario, estado, notas) VALUES (?, ?, ?, ?, ?, ?, ?)')
            ->execute(self::bindings($in));

        $row = self::find((int) $pdo->lastInsertId());
        Response::json(['data' => self::toApi($row ?? [])], 201);
    }

    /** PUT /api/citas/{id} */
    public static function update(string $id): void
    {
        Auth::require();
        $row = self::find((int) $id);
        if ($row === null) {
            Response::error('Cita no encontrada.', 404);
            return;
        }

        $in = self::input();
        if (self::str($in, 'fecha') === '' || self::str($in, 'hora') === '' || self::str($in, 'motivo') === '') {
            Response::error('Fecha, hora y motivo son obligatorios.', 422);
            return;
        }

        $values = self::bindings($in);
        $values[] = (int) $id;
        Database::connection()->prepare(
            'UPDATE citas SET mascota_id=?, fecha=?, hora=?, motivo=?, veterinario=?, estado=?, notas=? WHERE id=?'
        )->execute($values);

        Response::json(['data' => self::toApi(self::find((int) $id) ?? [])]);
    }

    /** DELETE /api/citas/{id} */
    public static function destroy(string $id): void
    {
        Auth::require();
        if (self::find((int) $id) === null) {
            Response::error('Cita no encontrada.', 404);
            return;
        }
        Database::connection()->prepare('DELETE FROM citas WHERE id = ?')->execute([(int) $id]);
        Response::json(['message' => 'Cita eliminada.']);
    }

    private static function bindings(array $in): array
    {
        return [
            self::nullableInt($in, 'mascotaId'),
            self::str($in, 'fecha') ?: null,
            self::str($in, 'hora') ?: null,
            self::str($in, 'motivo'),
            self::str($in, 'veterinario'),
            self::str($in, 'estado', 'Pendiente'),
            self::str($in, 'notas'),
        ];
    }

    private static function find(int $id): ?array
    {
        $stmt = Database::connection()->prepare('SELECT * FROM citas WHERE id = ? LIMIT 1');
        $stmt->execute([$id]);
        return $stmt->fetch() ?: null;
    }

    private static function toApi(array $row): array
    {
        return [
            'id' => (int) $row['id'],
            'mascotaId' => $row['mascota_id'] !== null ? (int) $row['mascota_id'] : null,
            'fecha' => $row['fecha'],
            'hora' => substr((string) $row['hora'], 0, 5),
            'motivo' => $row['motivo'],
            'veterinario' => $row['veterinario'],
            'estado' => $row['estado'],
            'notas' => $row['notas'],
        ];
    }
}
