<?php
declare(strict_types=1);

namespace App\Core;

/**
 * Router minimo con soporte de parametros {id} y permisos por ruta.
 */
class Router
{
    /** @var array<int, array{0:string,1:string,2:callable,3:?string}> */
    private array $routes = [];

    public function add(string $method, string $path, callable $handler, ?string $permiso = null): void
    {
        $this->routes[] = [strtoupper($method), $path, $handler, $permiso];
    }

    public function get(string $path, callable $handler, ?string $permiso = null): void
    {
        $this->add('GET', $path, $handler, $permiso);
    }

    public function post(string $path, callable $handler, ?string $permiso = null): void
    {
        $this->add('POST', $path, $handler, $permiso);
    }

    public function put(string $path, callable $handler, ?string $permiso = null): void
    {
        $this->add('PUT', $path, $handler, $permiso);
    }

    public function delete(string $path, callable $handler, ?string $permiso = null): void
    {
        $this->add('DELETE', $path, $handler, $permiso);
    }

    public function dispatch(string $method, string $uri): void
    {
        $path = parse_url($uri, PHP_URL_PATH) ?: '/';
        $path = rtrim($path, '/');
        if ($path === '') {
            $path = '/';
        }

        foreach ($this->routes as [$routeMethod, $routePath, $handler, $permiso]) {
            if ($routeMethod !== strtoupper($method)) {
                continue;
            }
            $pattern = '#^' . preg_replace('#\{[^/]+\}#', '([^/]+)', $routePath) . '$#';
            if (preg_match($pattern, $path, $matches)) {
                if ($permiso !== null) {
                    Auth::requirePerm($permiso);
                }
                array_shift($matches);
                $handler(...$matches);
                return;
            }
        }

        Response::error("Ruta no encontrada: $method $path", 404);
    }
}
