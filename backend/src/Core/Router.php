<?php
declare(strict_types=1);

namespace App\Core;

/**
 * Router minimo con soporte de parametros {id}.
 */
class Router
{
    /** @var array<int, array{0:string,1:string,2:callable}> */
    private array $routes = [];

    public function add(string $method, string $path, callable $handler): void
    {
        $this->routes[] = [strtoupper($method), $path, $handler];
    }

    public function get(string $path, callable $handler): void
    {
        $this->add('GET', $path, $handler);
    }

    public function post(string $path, callable $handler): void
    {
        $this->add('POST', $path, $handler);
    }

    public function put(string $path, callable $handler): void
    {
        $this->add('PUT', $path, $handler);
    }

    public function delete(string $path, callable $handler): void
    {
        $this->add('DELETE', $path, $handler);
    }

    public function dispatch(string $method, string $uri): void
    {
        $path = parse_url($uri, PHP_URL_PATH) ?: '/';
        $path = rtrim($path, '/');
        if ($path === '') {
            $path = '/';
        }

        foreach ($this->routes as [$routeMethod, $routePath, $handler]) {
            if ($routeMethod !== strtoupper($method)) {
                continue;
            }
            $pattern = '#^' . preg_replace('#\{[^/]+\}#', '([^/]+)', $routePath) . '$#';
            if (preg_match($pattern, $path, $matches)) {
                array_shift($matches);
                $handler(...$matches);
                return;
            }
        }

        Response::error("Ruta no encontrada: $method $path", 404);
    }
}
