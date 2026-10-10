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

- [x] **Fase 1** - Diseno: Login, Layout y Dashboard.
- [ ] **Fase 2** - Backend PHP + MySQL (API REST, login real, roles).
- [ ] **Fase 2** - Modulos: Citas, Consultas, Historia clinica, Diagnosticos,
      Farmacia, Inventario, Tienda, Pedidos, Usuarios, Roles, Reportes.
- [ ] **Fase 3** - PWA (instalable en movil).
- [ ] **Fase 4** - Despliegue (GitHub + hosting cPanel, staging/produccion).

## Paleta de marca

| Uso | Color |
| --- | --- |
| Primario | `#db0505` |
| Primario oscuro | `#a80404` |
| Fondo | `#f4f5f7` |
| Texto | `#1f2430` |
