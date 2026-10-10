# Frontend - Clinica Mascotas

Aplicacion **Vue 3 + Vite** del sistema integral para clinica veterinaria.

> Para la vision general del proyecto, consulta el [README principal](../README.md).

## Desarrollo

```bash
npm install
npm run dev
```

Servidor en `http://localhost:5173`.

## Compilar para produccion

```bash
npm run build     # genera la carpeta dist/
npm run preview   # sirve dist/ localmente para probar
```

## Estructura de `src/`

```
src/
├── assets/scss/   # Tema: _variables.scss, _theme.scss, main.scss
├── components/    # Componentes reutilizables
│   ├── layout/    #   AppSidebar, AppNavbar, AppFooter
│   └── ui/        #   StatCard y otros componentes de interfaz
├── composables/   # useForm (validaciones reutilizables)
├── data/          # menu.js (configuracion del menu lateral)
├── layouts/       # DashboardLayout.vue (shell del panel)
├── router/        # Rutas + guardas de navegacion
├── services/      # api.js (cliente axios)
├── stores/        # auth.js, ui.js (Pinia)
├── utils/         # alerts.js (SweetAlert2)
├── views/         # LoginView, DashboardView, ComingSoonView, NotFoundView
├── App.vue
└── main.js
```

## Variables de entorno

Copia `.env.example` a `.env.local` y ajusta `VITE_API_URL` cuando exista el backend.
