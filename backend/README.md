# Backend - Clinica Mascotas (Fase 2)

API REST en **PHP + MySQL/MariaDB** (sin frameworks). Corre con el **servidor
embebido de PHP** desde la propia carpeta del proyecto — **no requiere copiar
nada a `htdocs`**.

## Requisitos

- PHP 8+ (usamos el de XAMPP: `C:\xampp\php\php.exe`).
- MySQL/MariaDB (usamos el de XAMPP, en el puerto **3307**).

## Puesta en marcha

```bash
# 1) Crear la base de datos y las tablas (una sola vez)
#    (desde la raiz del proyecto)
Get-Content database/schema.sql -Raw | & C:\xampp\mysql\bin\mysql.exe -u clinica -pclinica123 -h 127.0.0.1 -P 3307 clinica_mascotas

# 2) Cargar datos iniciales (roles, admin, catalogos, ejemplos)
& C:\xampp\php\php.exe backend/database/seed.php

# 3) Iniciar la API (desde la raiz del proyecto)
powershell -ExecutionPolicy Bypass -File backend/serve.ps1
# -> http://127.0.0.1:8000
```

## Estructura

```
backend/
├── public/
│   └── index.php          # Punto de entrada (router de la API)
├── src/
│   ├── Config/Database.php
│   ├── Core/              # Env, Response (CORS/JSON), Router, Jwt
│   └── Controllers/       # HealthController, AuthController
├── database/
│   └── seed.php           # Datos iniciales
├── .env / .env.example    # Credenciales y ajustes
├── bootstrap.php          # Autoload + entorno
└── serve.ps1              # Arranque del servidor embebido
```

## Endpoints actuales

| Metodo | Ruta | Descripcion |
| --- | --- | --- |
| GET | `/api/health` | Estado del servicio y de la base de datos |
| POST | `/api/auth/login` | Login (devuelve token JWT + usuario) |
| GET | `/api/auth/me` | Usuario autenticado (requiere `Authorization: Bearer`) |
| GET / POST | `/api/duenos` | Listar / crear dueños |
| GET / PUT / DELETE | `/api/duenos/{id}` | Ver / editar / eliminar dueño |
| GET / POST | `/api/mascotas` | Listar / crear mascotas |
| GET / PUT / DELETE | `/api/mascotas/{id}` | Ver / editar / eliminar mascota |

> Todas las rutas (excepto `/api/health` y `/api/auth/login`) requieren el header
> `Authorization: Bearer <token>`.

## Credenciales de ejemplo

- `admin@clinica.test` / `admin123`
- Resto de usuarios: `<correo>@clinica.test` / `123456`

## Notas

- Seguridad: contraseñas con `password_hash()`, sesion por **JWT (HS256)** y
  consultas preparadas (PDO).
- CORS habilitado para el frontend de Vite (`http://localhost:5173`).
