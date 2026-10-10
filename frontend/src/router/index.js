import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

/**
 * Definicion de rutas.
 * - Las rutas con `meta.public: true` no requieren sesion.
 * - El resto se renderiza dentro de DashboardLayout (el "shell").
 */
const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/auth/LoginView.vue'),
    meta: { public: true, title: 'Iniciar sesion' },
  },
  {
    path: '/',
    component: () => import('@/layouts/DashboardLayout.vue'),
    children: [
      {
        path: '',
        name: 'dashboard',
        component: () => import('@/views/DashboardView.vue'),
        meta: { title: 'Dashboard' },
      },
      // ---- Modulos (maqueta: "En construccion" por ahora) ----
      { path: 'citas', name: 'citas', component: () => import('@/views/citas/CitasView.vue'), meta: { title: 'Citas' } },
      { path: 'consultas', name: 'consultas', component: () => import('@/views/consultas/ConsultasView.vue'), meta: { title: 'Consultas' } },
      { path: 'historia-clinica', name: 'historia-clinica', component: () => import('@/views/historia-clinica/HistoriaClinicaView.vue'), meta: { title: 'Historia clinica' } },
      { path: 'diagnosticos', name: 'diagnosticos', component: () => import('@/views/diagnosticos/DiagnosticosView.vue'), meta: { title: 'Diagnosticos' } },
      { path: 'mascotas', name: 'mascotas', component: () => import('@/views/pacientes/MascotasView.vue'), meta: { title: 'Mascotas' } },
      { path: 'duenos', name: 'duenos', component: () => import('@/views/pacientes/DuenosView.vue'), meta: { title: 'Duenos / Tutores' } },
      { path: 'farmacia', name: 'farmacia', component: () => import('@/views/farmacia/FarmaciaView.vue'), meta: { title: 'Farmacia' } },
      { path: 'inventario', name: 'inventario', component: () => import('@/views/farmacia/InventarioView.vue'), meta: { title: 'Inventario' } },
      { path: 'tienda', name: 'tienda', component: () => import('@/views/tienda/TiendaView.vue'), meta: { title: 'Tienda online' } },
      { path: 'pedidos', name: 'pedidos', component: () => import('@/views/ventas/VentasView.vue'), meta: { title: 'Pedidos y ventas' } },
      { path: 'usuarios', name: 'usuarios', component: () => import('@/views/admin/UsuariosView.vue'), meta: { title: 'Usuarios' } },
      { path: 'roles', name: 'roles', component: () => import('@/views/admin/RolesView.vue'), meta: { title: 'Roles y permisos' } },
      { path: 'reportes', name: 'reportes', component: () => import('@/views/ComingSoonView.vue'), meta: { title: 'Reportes' } },
      { path: 'configuracion', name: 'configuracion', component: () => import('@/views/ComingSoonView.vue'), meta: { title: 'Configuracion' } },
    ],
  },
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
  scrollBehavior() {
    return { top: 0 }
  },
})

// Guarda de navegacion: protege las rutas privadas.
router.beforeEach((to) => {
  const auth = useAuthStore()

  if (!to.meta.public && !auth.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
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
