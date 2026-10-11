import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

/**
 * Estructura de rutas:
 *  - "/"          -> Tienda publica (sin login).
 *  - "/admin"     -> Panel interno (requiere sesion).
 *  - "/admin/login" -> Acceso del personal.
 */
const routes = [
  // ------------------------- Tienda publica -------------------------
  {
    path: '/',
    component: () => import('@/layouts/StoreLayout.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('@/views/site/HomeView.vue'),
        meta: { public: true, title: 'Inicio' },
      },
      {
        path: 'tienda',
        name: 'tienda',
        component: () => import('@/views/tienda/TiendaView.vue'),
        meta: { public: true, title: 'Farmacia' },
      },
    ],
  },

  // ------------------------- Acceso del personal -------------------------
  {
    path: '/admin/login',
    name: 'login',
    component: () => import('@/views/auth/LoginView.vue'),
    meta: { public: true, title: 'Iniciar sesion' },
  },

  // ------------------------- Panel interno -------------------------
  {
    path: '/admin',
    component: () => import('@/layouts/DashboardLayout.vue'),
    children: [
      { path: '', name: 'dashboard', component: () => import('@/views/DashboardView.vue'), meta: { title: 'Dashboard' } },
      { path: 'citas', name: 'citas', component: () => import('@/views/citas/CitasView.vue'), meta: { title: 'Citas', permiso: 'citas.ver' } },
      { path: 'consultas', name: 'consultas', component: () => import('@/views/consultas/ConsultasView.vue'), meta: { title: 'Consultas', permiso: 'consultas.ver' } },
      { path: 'historia-clinica', name: 'historia-clinica', component: () => import('@/views/historia-clinica/HistoriaClinicaView.vue'), meta: { title: 'Historia clinica', permiso: 'historia.ver' } },
      { path: 'diagnosticos', name: 'diagnosticos', component: () => import('@/views/diagnosticos/DiagnosticosView.vue'), meta: { title: 'Diagnosticos', permiso: 'diagnosticos.ver' } },
      { path: 'mascotas', name: 'mascotas', component: () => import('@/views/pacientes/MascotasView.vue'), meta: { title: 'Mascotas', permiso: 'pacientes.ver' } },
      { path: 'duenos', name: 'duenos', component: () => import('@/views/pacientes/DuenosView.vue'), meta: { title: 'Duenos / Tutores', permiso: 'pacientes.ver' } },
      { path: 'farmacia', name: 'farmacia', component: () => import('@/views/farmacia/FarmaciaView.vue'), meta: { title: 'Farmacia', permiso: 'farmacia.ver' } },
      { path: 'inventario', name: 'inventario', component: () => import('@/views/farmacia/InventarioView.vue'), meta: { title: 'Inventario', permiso: 'inventario.ver' } },
      { path: 'pedidos', name: 'pedidos', component: () => import('@/views/ventas/VentasView.vue'), meta: { title: 'Pedidos y ventas', permiso: 'ventas.ver' } },
      { path: 'usuarios', name: 'usuarios', component: () => import('@/views/admin/UsuariosView.vue'), meta: { title: 'Usuarios', permiso: 'usuarios.ver' } },
      { path: 'roles', name: 'roles', component: () => import('@/views/admin/RolesView.vue'), meta: { title: 'Roles y permisos', permiso: 'roles.ver' } },
      { path: 'sitio-web', name: 'sitio-web', component: () => import('@/views/admin/SitioWebView.vue'), meta: { title: 'Contenido web', permiso: 'configuracion.gestionar' } },
      { path: 'reportes', name: 'reportes', component: () => import('@/views/reportes/ReportesView.vue'), meta: { title: 'Reportes', permiso: 'reportes.ver' } },
      { path: 'configuracion', name: 'configuracion', component: () => import('@/views/configuracion/ConfiguracionView.vue'), meta: { title: 'Configuracion', permiso: 'configuracion.gestionar' } },
    ],
  },

  // ------------------------- 404 -------------------------
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
    meta: { public: true, title: 'No encontrado' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to) {
    if (to.hash) return { el: to.hash, behavior: 'smooth', top: 80 }
    return { top: 0 }
  },
})

// Guarda de navegacion: protege el panel interno (/admin).
router.beforeEach((to) => {
  const auth = useAuthStore()
  const isAdminArea = to.path.startsWith('/admin') && to.name !== 'login'

  if (isAdminArea && !auth.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  if (isAdminArea && to.meta.permiso && !auth.can(to.meta.permiso)) {
    // Sin permiso para esta seccion: a la pagina principal del panel.
    return { name: 'dashboard' }
  }
  if (to.name === 'login' && auth.isAuthenticated) {
    return { name: 'dashboard' }
  }
  return true
})

// Titulo dinamico de la pestana.
router.afterEach((to) => {
  const base = 'Clinica Mascotas'
  document.title = to.meta.title ? `${to.meta.title} · ${base}` : base
})

export default router
