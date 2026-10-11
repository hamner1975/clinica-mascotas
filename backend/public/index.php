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
use App\Controllers\ConfiguracionController;
use App\Controllers\ConsultaController;
use App\Controllers\DevController;
use App\Controllers\DiagnosticoController;
use App\Controllers\DuenoController;
use App\Controllers\HealthController;
use App\Controllers\MascotaController;
use App\Controllers\ProductoController;
use App\Controllers\RolController;
use App\Controllers\SitioController;
use App\Controllers\UsuarioController;
use App\Controllers\VentaController;
use App\Core\Env;
use App\Core\Response;
use App\Core\Router;

Response::cors();

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
if ($method === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$router = new Router();

// ------------------------------- Publico -------------------------------
$router->get('/api/health', static fn () => HealthController::index());
$router->post('/api/auth/login', static fn () => AuthController::login());
$router->get('/api/productos', static fn () => ProductoController::index());
$router->post('/api/tienda/pedidos', static fn () => VentaController::online());
$router->get('/api/sitio', static fn () => SitioController::show());
$router->get('/api/configuracion', static fn () => ConfiguracionController::show());

// --------------------------- Requiere sesion ---------------------------
$router->get('/api/auth/me', static fn () => AuthController::me());

// Pacientes
$router->get('/api/duenos', static fn () => DuenoController::index());
$router->get('/api/duenos/{id}', static fn (string $id) => DuenoController::show($id));
$router->post('/api/duenos', static fn () => DuenoController::store(), 'pacientes.gestionar');
$router->put('/api/duenos/{id}', static fn (string $id) => DuenoController::update($id), 'pacientes.gestionar');
$router->delete('/api/duenos/{id}', static fn (string $id) => DuenoController::destroy($id), 'pacientes.eliminar');

$router->get('/api/mascotas', static fn () => MascotaController::index());
$router->get('/api/mascotas/{id}', static fn (string $id) => MascotaController::show($id));
$router->post('/api/mascotas', static fn () => MascotaController::store(), 'pacientes.gestionar');
$router->put('/api/mascotas/{id}', static fn (string $id) => MascotaController::update($id), 'pacientes.gestionar');
$router->delete('/api/mascotas/{id}', static fn (string $id) => MascotaController::destroy($id), 'pacientes.eliminar');

// Atencion medica
$router->get('/api/citas', static fn () => CitaController::index());
$router->get('/api/citas/{id}', static fn (string $id) => CitaController::show($id));
$router->post('/api/citas', static fn () => CitaController::store(), 'citas.gestionar');
$router->put('/api/citas/{id}', static fn (string $id) => CitaController::update($id), 'citas.gestionar');
$router->delete('/api/citas/{id}', static fn (string $id) => CitaController::destroy($id), 'citas.gestionar');

$router->get('/api/consultas', static fn () => ConsultaController::index());
$router->get('/api/consultas/{id}', static fn (string $id) => ConsultaController::show($id));
$router->post('/api/consultas', static fn () => ConsultaController::store(), 'consultas.gestionar');
$router->put('/api/consultas/{id}', static fn (string $id) => ConsultaController::update($id), 'consultas.gestionar');
$router->delete('/api/consultas/{id}', static fn (string $id) => ConsultaController::destroy($id), 'consultas.gestionar');

// Farmacia / ventas
$router->get('/api/productos/{id}', static fn (string $id) => ProductoController::show($id));
$router->post('/api/productos', static fn () => ProductoController::store(), 'inventario.gestionar');
$router->put('/api/productos/{id}', static fn (string $id) => ProductoController::update($id), 'inventario.gestionar');
$router->delete('/api/productos/{id}', static fn (string $id) => ProductoController::destroy($id), 'inventario.gestionar');

$router->get('/api/ventas', static fn () => VentaController::index());
$router->get('/api/ventas/{id}', static fn (string $id) => VentaController::show($id));
$router->post('/api/ventas', static fn () => VentaController::store(), 'farmacia.vender');
$router->put('/api/ventas/{id}', static fn (string $id) => VentaController::update($id), 'ventas.gestionar');
$router->delete('/api/ventas/{id}', static fn (string $id) => VentaController::destroy($id), 'ventas.gestionar');

// Administracion
$router->get('/api/usuarios', static fn () => UsuarioController::index());
$router->get('/api/usuarios/{id}', static fn (string $id) => UsuarioController::show($id));
$router->post('/api/usuarios', static fn () => UsuarioController::store(), 'usuarios.gestionar');
$router->put('/api/usuarios/{id}', static fn (string $id) => UsuarioController::update($id), 'usuarios.gestionar');
$router->put('/api/usuarios/{id}/estado', static fn (string $id) => UsuarioController::setEstado($id), 'usuarios.gestionar');
$router->delete('/api/usuarios/{id}', static fn (string $id) => UsuarioController::destroy($id), 'usuarios.gestionar');

$router->get('/api/roles', static fn () => RolController::index());
$router->get('/api/roles/{id}', static fn (string $id) => RolController::show($id));
$router->post('/api/roles', static fn () => RolController::store(), 'roles.gestionar');
$router->put('/api/roles/{id}', static fn (string $id) => RolController::update($id), 'roles.gestionar');
$router->delete('/api/roles/{id}', static fn (string $id) => RolController::destroy($id), 'roles.gestionar');

$router->get('/api/diagnosticos', static fn () => DiagnosticoController::index());
$router->get('/api/diagnosticos/{id}', static fn (string $id) => DiagnosticoController::show($id));
$router->post('/api/diagnosticos', static fn () => DiagnosticoController::store(), 'diagnosticos.gestionar');
$router->put('/api/diagnosticos/{id}', static fn (string $id) => DiagnosticoController::update($id), 'diagnosticos.gestionar');
$router->delete('/api/diagnosticos/{id}', static fn (string $id) => DiagnosticoController::destroy($id), 'diagnosticos.gestionar');

// Contenido web y configuracion
$router->put('/api/sitio', static fn () => SitioController::update(), 'configuracion.gestionar');
$router->put('/api/configuracion', static fn () => ConfiguracionController::update(), 'configuracion.gestionar');

// Desarrollo (solo local)
$router->post('/api/dev/reseed', static fn () => DevController::reseed(), 'configuracion.gestionar');

// Soporta servir la API dentro de una subcarpeta (ej. /clinica/backend/public).
// Define API_BASE en el .env (sin barra final) cuando el API no este en la raiz.
$uri = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
$base = rtrim((string) Env::get('API_BASE', ''), '/');
if ($base !== '' && str_starts_with($uri, $base)) {
    $uri = substr($uri, strlen($base));
}
if ($uri === '') {
    $uri = '/';
}

$router->dispatch($method, $uri);
