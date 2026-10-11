<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Config\Database;
use App\Core\Auth;
use App\Core\Response;
use Throwable;

class VentaController extends Controller
{
    /** GET /api/ventas */
    public static function index(): void
    {
        Auth::require();
        Response::json(['data' => self::withItems()]);
    }

    /** GET /api/ventas/{id} */
    public static function show(string $id): void
    {
        Auth::require();
        $row = self::find((int) $id);
        if ($row === null) {
            Response::error('Venta no encontrada.', 404);
            return;
        }
        Response::json(['data' => $row]);
    }

    /** POST /api/ventas  (panel interno) */
    public static function store(): void
    {
        Auth::require();
        self::create(false);
    }

    /** POST /api/tienda/pedidos  (tienda publica, sin login) */
    public static function online(): void
    {
        self::create(true);
    }

    /** PUT /api/ventas/{id}  { estado } */
    public static function update(string $id): void
    {
        Auth::require();
        if (self::find((int) $id) === null) {
            Response::error('Venta no encontrada.', 404);
            return;
        }

        $in = self::input();
        $estado = self::str($in, 'estado');
        if ($estado === '') {
            Response::error('El estado es obligatorio.', 422);
            return;
        }

        Database::connection()->prepare('UPDATE ventas SET estado = ? WHERE id = ?')->execute([$estado, (int) $id]);
        Response::json(['data' => self::find((int) $id)]);
    }

    /** DELETE /api/ventas/{id} */
    public static function destroy(string $id): void
    {
        Auth::require();
        if (self::find((int) $id) === null) {
            Response::error('Venta no encontrada.', 404);
            return;
        }
        Database::connection()->prepare('DELETE FROM ventas WHERE id = ?')->execute([(int) $id]);
        Response::json(['message' => 'Venta eliminada.']);
    }

    /**
     * Crea una venta/pedido. Calcula precios y total en el servidor,
     * y descuenta el stock. $esTienda fuerza canal Online y estado Pendiente.
     */
    private static function create(bool $esTienda): void
    {
        $in = self::input();
        $items = is_array($in['items'] ?? null) ? $in['items'] : [];

        if (count($items) === 0) {
            Response::error('La venta no tiene productos.', 422);
            return;
        }

        $canal = $esTienda ? 'Online' : self::str($in, 'canal', 'Mostrador');
        $cliente = self::str($in, 'cliente') ?: ($canal === 'Online' ? 'Cliente online' : 'Cliente mostrador');
        $metodoPago = self::str($in, 'metodoPago') ?: ($canal === 'Online' ? 'Mercado Pago' : 'Efectivo');
        $estado = $canal === 'Online' ? 'Pendiente' : 'Completada';

        $pdo = Database::connection();

        try {
            $pdo->beginTransaction();

            $detalle = [];
            $total = 0.0;

            foreach ($items as $item) {
                $productoId = (int) ($item['productoId'] ?? 0);
                $cantidad = max(1, (int) ($item['cantidad'] ?? 1));

                $stmt = $pdo->prepare('SELECT * FROM productos WHERE id = ? LIMIT 1');
                $stmt->execute([$productoId]);
                $producto = $stmt->fetch();
                if (!$producto) {
                    continue;
                }

                $descuento = (int) $producto['descuento'];
                $precioBase = (float) $producto['precio'];
                $precio = $descuento > 0 ? (float) round($precioBase * (1 - $descuento / 100)) : $precioBase;

                $detalle[] = [
                    'producto_id' => $productoId,
                    'nombre' => $producto['nombre'],
                    'precio' => $precio,
                    'cantidad' => $cantidad,
                ];
                $total += $precio * $cantidad;
            }

            if (count($detalle) === 0) {
                $pdo->rollBack();
                Response::error('Ninguno de los productos existe.', 422);
                return;
            }

            $pdo->prepare('INSERT INTO ventas (fecha, hora, canal, cliente, metodo_pago, total, estado) VALUES (CURDATE(), CURTIME(), ?, ?, ?, ?, ?)')
                ->execute([$canal, $cliente, $metodoPago, $total, $estado]);
            $ventaId = (int) $pdo->lastInsertId();

            $insDetalle = $pdo->prepare('INSERT INTO venta_detalle (venta_id, producto_id, nombre, precio, cantidad) VALUES (?, ?, ?, ?, ?)');
            $updStock = $pdo->prepare('UPDATE productos SET stock = GREATEST(0, stock - ?) WHERE id = ?');

            foreach ($detalle as $d) {
                $insDetalle->execute([$ventaId, $d['producto_id'], $d['nombre'], $d['precio'], $d['cantidad']]);
                $updStock->execute([$d['cantidad'], $d['producto_id']]);
            }

            $pdo->commit();
        } catch (Throwable $e) {
            if ($pdo->inTransaction()) {
                $pdo->rollBack();
            }
            Response::error('No se pudo registrar la venta: ' . $e->getMessage(), 500);
            return;
        }

        Response::json(['data' => self::find($ventaId)], 201);
    }

    /** Lista de ventas con su detalle. */
    private static function withItems(): array
    {
        $pdo = Database::connection();
        $ventas = $pdo->query('SELECT * FROM ventas ORDER BY fecha, hora')->fetchAll();
        $detalle = $pdo->query('SELECT * FROM venta_detalle')->fetchAll();

        $porVenta = [];
        foreach ($detalle as $d) {
            $porVenta[(int) $d['venta_id']][] = [
                'productoId' => $d['producto_id'] !== null ? (int) $d['producto_id'] : null,
                'nombre' => $d['nombre'],
                'precio' => (float) $d['precio'],
                'cantidad' => (int) $d['cantidad'],
            ];
        }

        return array_map(static function (array $v) use ($porVenta): array {
            return [
                'id' => (int) $v['id'],
                'fecha' => $v['fecha'],
                'hora' => substr((string) $v['hora'], 0, 5),
                'canal' => $v['canal'],
                'cliente' => $v['cliente'],
                'metodoPago' => $v['metodo_pago'],
                'total' => (float) $v['total'],
                'estado' => $v['estado'],
                'items' => $porVenta[(int) $v['id']] ?? [],
            ];
        }, $ventas);
    }

    private static function find(int $id): ?array
    {
        $pdo = Database::connection();
        $stmt = $pdo->prepare('SELECT * FROM ventas WHERE id = ? LIMIT 1');
        $stmt->execute([$id]);
        $v = $stmt->fetch();
        if (!$v) {
            return null;
        }

        $items = $pdo->prepare('SELECT * FROM venta_detalle WHERE venta_id = ?');
        $items->execute([$id]);
        $detalle = array_map(static fn (array $d): array => [
            'productoId' => $d['producto_id'] !== null ? (int) $d['producto_id'] : null,
            'nombre' => $d['nombre'],
            'precio' => (float) $d['precio'],
            'cantidad' => (int) $d['cantidad'],
        ], $items->fetchAll());

        return [
            'id' => (int) $v['id'],
            'fecha' => $v['fecha'],
            'hora' => substr((string) $v['hora'], 0, 5),
            'canal' => $v['canal'],
            'cliente' => $v['cliente'],
            'metodoPago' => $v['metodo_pago'],
            'total' => (float) $v['total'],
            'estado' => $v['estado'],
            'items' => $detalle,
        ];
    }
}
