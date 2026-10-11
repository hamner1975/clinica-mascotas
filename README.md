# Clinica Mascotas - Sistema Integral

Sistema web de gestion para **clinica veterinaria** con farmacia y tienda online.
Minimalista, responsivo, instalable como PWA (proximamente).

> **Estado actual: Fase 1 (Diseno) completada** - maqueta navegable con
> Login + Layout + Dashboard.

## Tecnologias

| Capa | Tecnologia |
| --- | --- |
| Frontend | [Vite](https://vite.dev) + [Vue 3](https://vuejs.org) (Composition API) |
| UI | [Bootstrap 5](https://getbootstrap.com) + [Bootstrap Icons](https://icons.getbootstrap.com) |
| Estado | [Pinia](https://pinia.vuejs.org) |
| Rutas | [Vue Router 4](https://router.vuejs.org) |
| Alertas | [SweetAlert2](https://sweetalert2.github.io) |
| HTTP | [Axios](https://axios-http.com) |
| Backend (Fase 2) | PHP + MySQL |
| PWA (Fase 3) | vite-plugin-pwa |

## Estructura del repositorio

```
Clinica_mascotas/
├── frontend/            # Aplicacion Vue 3 + Vite (Fase 1)
│   ├── public/
│   └── src/
│       ├── assets/scss/ # Tema (paleta #db0505) + Bootstrap
│       ├── components/  # Componentes reutilizables (layout, ui)
│       ├── composables/ # Logica reutilizable (useForm = validaciones)
│       ├── data/        # Configuracion del menu, catalogos
│       ├── layouts/     # Layout del panel (shell)
│       ├── router/      # Definicion de rutas + guardas
│       ├── services/    # Cliente HTTP (axios)
│       ├── stores/      # Estado global (Pinia)
│       ├── utils/       # Utilidades (SweetAlert2)
│       └── views/       # Paginas
├── backend/             # API PHP + MySQL (Fase 2)
├── database/            # Scripts SQL (Fase 2)
└── docs/                # Documentacion y arquitectura
```

## Requisitos

- **Node.js 18+** (recomendado 20) y npm.

## Puesta en marcha (frontend)

```bash
cd frontend
npm install
npm run dev
```

Abrir `http://localhost:5173`.

**Demo:** correo `admin@clinica.test` y cualquier contrasena de 6+ caracteres.

## Scripts disponibles

| Comando | Descripcion |
| --- | --- |
| `npm run dev` | Servidor de desarrollo con recarga en vivo |
| `npm run build` | Compila para produccion en `frontend/dist/` |
| `npm run preview` | Sirve localmente el build de produccion |

## Hoja de ruta

- [x] **Fase 1** - Diseno (maqueta navegable completa):
  - [x] Shell: Login, Layout (sidebar/topbar) y Dashboard.
  - [x] Pacientes: Mascotas y Duenos/Tutores.
  - [x] Citas y Consultas (con flujo "Atender" que genera la consulta).
  - [x] Historia clinica (expediente por mascota: resumen, consultas y evolucion).
  - [x] Farmacia (punto de venta), Inventario, Tienda online y Pedidos/Ventas.
  - [x] Diagnosticos (catalogo + autocompletado en el formulario de consulta).
  - [x] Usuarios y Roles (RBAC con matriz de permisos).
  - [x] Reportes y Configuracion (con respaldo de datos).
- [ ] **Fase 2** - Backend PHP + MySQL: API REST, login real, RBAC y persistencia.
- [x] **Fase 3** - PWA: instalable en movil (manifest + service worker).
- [x] **Fase 4** - Despliegue: GitHub + hosting (realizado en InfinityFree).

## Pendientes / mejoras futuras

- [ ] **Costo por delivery**: calcular y sumar el costo de envio en el checkout de
      la tienda online (zonas/tarifas, envio gratis a partir de un monto, etc.).
- [ ] Recetario en la consulta: seleccionar medicamentos del inventario.
- [ ] PWA (instalable en movil).

## Paleta de marca

| Uso | Color |
| --- | --- |
| Primario | `#db0505` |
| Primario oscuro | `#a80404` |
| Fondo | `#f4f5f7` |
| Texto | `#1f2430` |
