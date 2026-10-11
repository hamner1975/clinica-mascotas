<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Config\Database;
use App\Core\Auth;
use App\Core\Response;

class ProductoController extends Controller
{
    /** GET /api/productos  (publico: lo usa la tienda online) */
    public static function index(): void
    {
        $rows = Database::connection()
            ->query('SELECT * FROM productos ORDER BY nombre')
            ->fetchAll();
        Response::json(['data' => array_map([self::class, 'toApi'], $rows)]);
    }

    /** GET /api/productos/{id} */
    public static function show(string $id): void
    {
        Auth::require();
        $row = self::find((int) $id);
        if ($row === null) {
            Response::error('Producto no encontrado.', 404);
            return;
        }
        Response::json(['data' => self::toApi($row)]);
    }

    /** POST /api/productos */
    public static function store(): void
    {
        Auth::require();
        $in = self::input();
        if (self::str($in, 'nombre') === '') {
            Response::error('El nombre es obligatorio.', 422);
            return;
        }

        $pdo = Database::connection();
        $pdo->prepare(
            'INSERT INTO productos (nombre, categoria, tipo, precio, costo, descuento, stock, stock_minimo, unidad, lote, vencimiento, requiere_receta, activo, descripcion, imagen)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
        )->execute(self::bindings($in));

        Response::json(['data' => self::toApi(self::find((int) $pdo->lastInsertId()) ?? [])], 201);
    }

    /** PUT /api/productos/{id} */
    public static function update(string $id): void
    {
        Auth::require();
        $row = self::find((int) $id);
        if ($row === null) {
            Response::error('Producto no encontrado.', 404);
            return;
        }

        $in = self::input();
        if (self::str($in, 'nombre') === '') {
            Response::error('El nombre es obligatorio.', 422);
            return;
        }

        $values = self::bindings($in);
        $values[] = (int) $id;
        Database::connection()->prepare(
            'UPDATE productos SET nombre=?, categoria=?, tipo=?, precio=?, costo=?, descuento=?, stock=?, stock_minimo=?, unidad=?, lote=?, vencimiento=?, requiere_receta=?, activo=?, descripcion=?, imagen=? WHERE id=?'
        )->execute($values);

        Response::json(['data' => self::toApi(self::find((int) $id) ?? [])]);
    }

    /** DELETE /api/productos/{id} */
    public static function destroy(string $id): void
    {
        Auth::require();
        if (self::find((int) $id) === null) {
            Response::error('Producto no encontrado.', 404);
            return;
        }
        Database::connection()->prepare('DELETE FROM productos WHERE id = ?')->execute([(int) $id]);
        Response::json(['message' => 'Producto eliminado.']);
    }

    private static function bindings(array $in): array
    {
        return [
            self::str($in, 'nombre'),
            self::str($in, 'categoria'),
            self::str($in, 'tipo', 'Producto'),
            (float) ($in['precio'] ?? 0),
            (float) ($in['costo'] ?? 0),
            (int) ($in['descuento'] ?? 0),
            (int) ($in['stock'] ?? 0),
            (int) ($in['stockMinimo'] ?? 0),
            self::str($in, 'unidad', 'Unidad'),
            self::str($in, 'lote'),
            self::str($in, 'vencimiento') ?: null,
            self::bool($in, 'requiereReceta'),
            $in['activo'] ?? true ? 1 : 0,
            self::str($in, 'descripcion'),
            self::str($in, 'imagen') ?: null,
        ];
    }

    private static function find(int $id): ?array
    {
        $stmt = Database::connection()->prepare('SELECT * FROM productos WHERE id = ? LIMIT 1');
        $stmt->execute([$id]);
        return $stmt->fetch() ?: null;
    }

    private static function toApi(array $row): array
    {
        return [
            'id' => (int) $row['id'],
            'nombre' => $row['nombre'],
            'categoria' => $row['categoria'],
            'tipo' => $row['tipo'],
            'precio' => (float) $row['precio'],
            'costo' => (float) $row['costo'],
            'descuento' => (int) $row['descuento'],
            'stock' => (int) $row['stock'],
            'stockMinimo' => (int) $row['stock_minimo'],
            'unidad' => $row['unidad'],
            'lote' => $row['lote'],
            'vencimiento' => $row['vencimiento'],
            'requiereReceta' => (int) $row['requiere_receta'] === 1,
            'activo' => (int) $row['activo'] === 1,
            'descripcion' => $row['descripcion'],
            'imagen' => $row['imagen'],
        ];
    }
}
