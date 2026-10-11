<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Config\Database;
use App\Core\Auth;
use App\Core\Response;

class ConsultaController extends Controller
{
    /** GET /api/consultas */
    public static function index(): void
    {
        Auth::require();
        $rows = Database::connection()
            ->query('SELECT * FROM consultas ORDER BY fecha DESC, hora DESC')
            ->fetchAll();
        Response::json(['data' => array_map([self::class, 'toApi'], $rows)]);
    }

    /** GET /api/consultas/{id} */
    public static function show(string $id): void
    {
        Auth::require();
        $row = self::find((int) $id);
        if ($row === null) {
            Response::error('Consulta no encontrada.', 404);
            return;
        }
        Response::json(['data' => self::toApi($row)]);
    }

    /** POST /api/consultas */
    public static function store(): void
    {
        Auth::require();
        $in = self::input();

        if (self::str($in, 'fecha') === '' || self::str($in, 'motivo') === '' || self::str($in, 'diagnostico') === '') {
            Response::error('Fecha, motivo y diagnostico son obligatorios.', 422);
            return;
        }

        $pdo = Database::connection();
        $pdo->prepare(
            'INSERT INTO consultas (cita_id, mascota_id, fecha, hora, motivo, temperatura, peso, frecuencia_cardiaca, diagnostico, tratamiento, observaciones, veterinario, proxima_cita)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
        )->execute(self::bindings($in));

        $row = self::find((int) $pdo->lastInsertId());
        Response::json(['data' => self::toApi($row ?? [])], 201);
    }

    /** PUT /api/consultas/{id} */
    public static function update(string $id): void
    {
        Auth::require();
        $row = self::find((int) $id);
        if ($row === null) {
            Response::error('Consulta no encontrada.', 404);
            return;
        }

        $in = self::input();
        if (self::str($in, 'fecha') === '' || self::str($in, 'motivo') === '' || self::str($in, 'diagnostico') === '') {
            Response::error('Fecha, motivo y diagnostico son obligatorios.', 422);
            return;
        }

        $values = self::bindings($in);
        $values[] = (int) $id;
        Database::connection()->prepare(
            'UPDATE consultas SET cita_id=?, mascota_id=?, fecha=?, hora=?, motivo=?, temperatura=?, peso=?, frecuencia_cardiaca=?, diagnostico=?, tratamiento=?, observaciones=?, veterinario=?, proxima_cita=? WHERE id=?'
        )->execute($values);

        Response::json(['data' => self::toApi(self::find((int) $id) ?? [])]);
    }

    /** DELETE /api/consultas/{id} */
    public static function destroy(string $id): void
    {
        Auth::require();
        if (self::find((int) $id) === null) {
            Response::error('Consulta no encontrada.', 404);
            return;
        }
        Database::connection()->prepare('DELETE FROM consultas WHERE id = ?')->execute([(int) $id]);
        Response::json(['message' => 'Consulta eliminada.']);
    }

    private static function bindings(array $in): array
    {
        return [
            self::nullableInt($in, 'citaId'),
            self::nullableInt($in, 'mascotaId'),
            self::str($in, 'fecha') ?: null,
            self::str($in, 'hora') ?: null,
            self::str($in, 'motivo'),
            self::nullableDecimal($in, 'temperatura'),
            self::nullableDecimal($in, 'peso'),
            self::nullableInt($in, 'frecuenciaCardiaca'),
            self::str($in, 'diagnostico'),
            self::str($in, 'tratamiento'),
            self::str($in, 'observaciones'),
            self::str($in, 'veterinario'),
            self::str($in, 'proximaCita') ?: null,
        ];
    }

    private static function find(int $id): ?array
    {
        $stmt = Database::connection()->prepare('SELECT * FROM consultas WHERE id = ? LIMIT 1');
        $stmt->execute([$id]);
        return $stmt->fetch() ?: null;
    }

    private static function toApi(array $row): array
    {
        return [
            'id' => (int) $row['id'],
            'citaId' => $row['cita_id'] !== null ? (int) $row['cita_id'] : null,
            'mascotaId' => $row['mascota_id'] !== null ? (int) $row['mascota_id'] : null,
            'fecha' => $row['fecha'],
            'hora' => $row['hora'] !== null ? substr((string) $row['hora'], 0, 5) : '',
            'motivo' => $row['motivo'],
            'temperatura' => $row['temperatura'] !== null ? (float) $row['temperatura'] : null,
            'peso' => $row['peso'] !== null ? (float) $row['peso'] : null,
            'frecuenciaCardiaca' => $row['frecuencia_cardiaca'] !== null ? (int) $row['frecuencia_cardiaca'] : null,
            'diagnostico' => $row['diagnostico'],
            'tratamiento' => $row['tratamiento'] ?? '',
            'observaciones' => $row['observaciones'] ?? '',
            'veterinario' => $row['veterinario'],
            'proximaCita' => $row['proxima_cita'],
        ];
    }
}
