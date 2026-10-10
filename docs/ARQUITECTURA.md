# Arquitectura - Clinica Mascotas

## Vision general

Aplicacion **desacoplada** (separacion frontend / backend):

```
┌──────────────────────────┐        ┌───────────────────────────┐
│        FRONTEND          │  HTTP  │         BACKEND           │
│  Vue 3 + Vite (SPA)      │ ─────▶ │  PHP (API REST)           │
│  Bootstrap 5 + Pinia     │  JSON  │  PDO + MySQL              │
│  Servido como estatico   │        │  JWT para autenticacion   │
└──────────────────────────┘        └───────────────────────────┘
        dist/  (estatico)                  /api (document root)
```

**Ventajas:** el frontend compila a archivos estaticos (no requiere Node en el
servidor), el backend es una API testable e independiente y permite un despliegue
en caliente (subir `dist/` y desplegar PHP por separado).

## Por que Vite + Vue 3

- **Vite**: recarga instantanea en desarrollo (HMR) y build optimizado (con
  code-splitting por ruta, como se ve en el resultado del build).
- **Vue 3 (Composition API)**: componentes reutilizables y logica encapsulada en
  *composables* (por ejemplo `useForm` para validaciones).
- **Pinia**: estado global simple y tipado.
- **Bootstrap 5**: base de estilos responsiva, personalizada con SCSS para aplicar
  la paleta de marca `#db0505`.

## Capas del frontend

| Carpeta | Responsabilidad |
| --- | --- |
| `views/` | Paginas (una por ruta) |
| `layouts/` | Plantillas que envuelven las vistas (shell del panel) |
| `components/` | Piezas reutilizables (layout y UI) |
| `composables/` | Logica reutilizable sin componentes |
| `stores/` | Estado global (Pinia) |
| `services/` | Comunicacion HTTP (axios) |
| `utils/` | Utilidades (alertas con SweetAlert2) |
| `router/` | Rutas y guardas de navegacion |
| `data/` | Configuracion estatica (menu) |

## Seguridad prevista (backend)

- Contrasenas con `password_hash()`.
- Sesion por JWT.
- Control de acceso por roles (RBAC).
- Consultas preparadas (PDO) contra inyeccion SQL.
- Validacion doble: en el cliente (Vue) y en el servidor (PHP).

## Despliegue

```
Local (npm run dev) ──▶ GitHub ──▶ Hosting cPanel
                                     ├── public_html/   (produccion)
                                     └── staging/       (pruebas previas)
```

El frontend se compila (`npm run build`) y se suben los archivos de `dist/`.
No se necesita Node en el servidor.
