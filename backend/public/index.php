<?php
declare(strict_types=1);

/**
 * Punto de entrada de la API REST - Clinica Mascotas (Fase 2).
 * Se sirve con el servidor embebido de PHP:
 *   php -S 127.0.0.1:8000 -t backend/public backend/public/index.php
 */

require __DIR__ . '/../bootstrap.php';

use App\Controllers\AuthController;
use App\Controllers\DuenoController;
use App\Controllers\HealthController;
use App\Controllers\MascotaController;
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

$router->dispatch($method, $_SERVER['REQUEST_URI'] ?? '/');
