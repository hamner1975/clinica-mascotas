<?php
declare(strict_types=1);

/**
 * Punto de entrada de la API REST - Clinica Mascotas (Fase 2).
 * Se sirve con el servidor embebido de PHP:
 *   php -S 127.0.0.1:8000 -t backend/public backend/public/index.php
 */

require __DIR__ . '/../bootstrap.php';

use App\Controllers\AuthController;
use App\Controllers\CitaController;
use App\Controllers\ConsultaController;
use App\Controllers\DiagnosticoController;
use App\Controllers\DuenoController;
use App\Controllers\HealthController;
use App\Controllers\MascotaController;
use App\Controllers\ProductoController;
use App\Controllers\RolController;
use App\Controllers\UsuarioController;
use App\Controllers\VentaController;
use App\Core\Response;
use App\Core\Router;

Response::cors();

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
if ($method === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$router = new Router();

// --- Publico ---
$router->get('/api/health', static fn () => HealthController::index());
$router->post('/api/auth/login', static fn () => AuthController::login());

// --- Requiere sesion ---
$router->get('/api/auth/me', static fn () => AuthController::me());

// Pacientes: duenos
$router->get('/api/duenos', static fn () => DuenoController::index());
$router->get('/api/duenos/{id}', static fn (string $id) => DuenoController::show($id));
$router->post('/api/duenos', static fn () => DuenoController::store());
$router->put('/api/duenos/{id}', static fn (string $id) => DuenoController::update($id));
$router->delete('/api/duenos/{id}', static fn (string $id) => DuenoController::destroy($id));

// Pacientes: mascotas
$router->get('/api/mascotas', static fn () => MascotaController::index());
$router->get('/api/mascotas/{id}', static fn (string $id) => MascotaController::show($id));
$router->post('/api/mascotas', static fn () => MascotaController::store());
$router->put('/api/mascotas/{id}', static fn (string $id) => MascotaController::update($id));
$router->delete('/api/mascotas/{id}', static fn (string $id) => MascotaController::destroy($id));

// Atencion medica: citas
$router->get('/api/citas', static fn () => CitaController::index());
$router->get('/api/citas/{id}', static fn (string $id) => CitaController::show($id));
$router->post('/api/citas', static fn () => CitaController::store());
$router->put('/api/citas/{id}', static fn (string $id) => CitaController::update($id));
$router->delete('/api/citas/{id}', static fn (string $id) => CitaController::destroy($id));

// Atencion medica: consultas
$router->get('/api/consultas', static fn () => ConsultaController::index());
$router->get('/api/consultas/{id}', static fn (string $id) => ConsultaController::show($id));
$router->post('/api/consultas', static fn () => ConsultaController::store());
$router->put('/api/consultas/{id}', static fn (string $id) => ConsultaController::update($id));
$router->delete('/api/consultas/{id}', static fn (string $id) => ConsultaController::destroy($id));

// Farmacia: productos
$router->get('/api/productos', static fn () => ProductoController::index());
$router->get('/api/productos/{id}', static fn (string $id) => ProductoController::show($id));
$router->post('/api/productos', static fn () => ProductoController::store());
$router->put('/api/productos/{id}', static fn (string $id) => ProductoController::update($id));
$router->delete('/api/productos/{id}', static fn (string $id) => ProductoController::destroy($id));

// Ventas / pedidos
$router->get('/api/ventas', static fn () => VentaController::index());
$router->get('/api/ventas/{id}', static fn (string $id) => VentaController::show($id));
$router->post('/api/ventas', static fn () => VentaController::store());
$router->put('/api/ventas/{id}', static fn (string $id) => VentaController::update($id));
$router->delete('/api/ventas/{id}', static fn (string $id) => VentaController::destroy($id));

// Tienda publica: registro de pedidos (sin login)
$router->post('/api/tienda/pedidos', static fn () => VentaController::online());

// Administracion: usuarios
$router->get('/api/usuarios', static fn () => UsuarioController::index());
$router->get('/api/usuarios/{id}', static fn (string $id) => UsuarioController::show($id));
$router->post('/api/usuarios', static fn () => UsuarioController::store());
$router->put('/api/usuarios/{id}', static fn (string $id) => UsuarioController::update($id));
$router->put('/api/usuarios/{id}/estado', static fn (string $id) => UsuarioController::setEstado($id));
$router->delete('/api/usuarios/{id}', static fn (string $id) => UsuarioController::destroy($id));

// Administracion: roles
$router->get('/api/roles', static fn () => RolController::index());
$router->get('/api/roles/{id}', static fn (string $id) => RolController::show($id));
$router->post('/api/roles', static fn () => RolController::store());
$router->put('/api/roles/{id}', static fn (string $id) => RolController::update($id));
$router->delete('/api/roles/{id}', static fn (string $id) => RolController::destroy($id));

// Diagnosticos
$router->get('/api/diagnosticos', static fn () => DiagnosticoController::index());
$router->get('/api/diagnosticos/{id}', static fn (string $id) => DiagnosticoController::show($id));
$router->post('/api/diagnosticos', static fn () => DiagnosticoController::store());
$router->put('/api/diagnosticos/{id}', static fn (string $id) => DiagnosticoController::update($id));
$router->delete('/api/diagnosticos/{id}', static fn (string $id) => DiagnosticoController::destroy($id));

$router->dispatch($method, $_SERVER['REQUEST_URI'] ?? '/');
