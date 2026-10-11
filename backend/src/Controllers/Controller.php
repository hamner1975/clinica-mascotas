<?php
declare(strict_types=1);

namespace App\Controllers;

/**
 * Base comun de los controladores.
 */
abstract class Controller
{
    /** Lee el cuerpo JSON de la peticion. */
    protected static function input(): array
    {
        $raw = file_get_contents('php://input') ?: '';
        $data = json_decode($raw, true);
        return is_array($data) ? $data : $_POST;
    }

    protected static function str(array $data, string $key, string $default = ''): string
    {
        $value = $data[$key] ?? $default;
        return is_scalar($value) ? trim((string) $value) : $default;
    }

    protected static function nullableDecimal(array $data, string $key): ?float
    {
        $value = $data[$key] ?? null;
        return ($value === null || $value === '') ? null : (float) $value;
    }

    protected static function nullableInt(array $data, string $key): ?int
    {
        $value = $data[$key] ?? null;
        return ($value === null || $value === '') ? null : (int) $value;
    }

    protected static function bool(array $data, string $key): int
    {
        return !empty($data[$key]) ? 1 : 0;
    }
}
