# Backend - Clinica Mascotas (Fase 2)

API REST en **PHP + MySQL**. Aun no implementada: esta carpeta queda reservada
para la Fase 2 del proyecto.

## Estructura prevista

```
backend/
├── public/              # DocumentRoot: unico punto de entrada publico
│   ├── index.php        # Front controller (enruta las peticiones a la API)
│   └── .htaccess        # Reescritura de URLs
├── src/
│   ├── Config/          # Conexion a la base de datos (PDO)
│   ├── Core/            # Router, Request, Response, Middleware
│   ├── Controllers/     # Controladores por modulo
│   ├── Models/          # Acceso a datos
│   ├── Services/        # Logica de negocio
│   └── Middleware/      # Autenticacion (JWT), roles, CORS
├── storage/
│   ├── logs/            # Registros
│   └── uploads/         # Archivos subidos (recetas, fotos de pacientes)
├── .env.example
└── README.md
```

## Convenciones previstas

- Acceso a datos con **PDO** y consultas preparadas (evita inyeccion SQL).
- Contrasenas con `password_hash()` / `password_verify()`.
- Autenticacion por **token JWT** en el header `Authorization: Bearer`.
- Respuestas en **JSON**: `{ "data": ..., "message": ..., "errors": ... }`.
- Codigos HTTP correctos (200, 201, 400, 401, 403, 404, 422, 500).

> Los detalles de instalacion y variables de entorno se agregaran al iniciar la Fase 2.
