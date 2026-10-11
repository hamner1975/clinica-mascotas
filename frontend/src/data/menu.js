/**
 * Configuracion del menu lateral del panel (/admin).
 * Fuente unica de titulos e iconos.
 */
export const menuSections = [
  {
    title: 'Principal',
    items: [{ title: 'Dashboard', icon: 'bi-speedometer2', to: '/admin' }],
  },
  {
    title: 'Atencion medica',
    items: [
      { title: 'Citas', icon: 'bi-calendar2-week', to: '/admin/citas' },
      { title: 'Consultas', icon: 'bi-clipboard2-pulse', to: '/admin/consultas' },
      { title: 'Historia clinica', icon: 'bi-journal-medical', to: '/admin/historia-clinica' },
      { title: 'Diagnosticos', icon: 'bi-heart-pulse', to: '/admin/diagnosticos' },
    ],
  },
  {
    title: 'Pacientes',
    items: [
      { title: 'Mascotas', icon: 'bi-heart', to: '/admin/mascotas' },
      { title: 'Duenos / Tutores', icon: 'bi-people', to: '/admin/duenos' },
    ],
  },
  {
    title: 'Farmacia y ventas',
    items: [
      { title: 'Farmacia', icon: 'bi-capsule', to: '/admin/farmacia' },
      { title: 'Inventario', icon: 'bi-box-seam', to: '/admin/inventario' },
      { title: 'Pedidos y ventas', icon: 'bi-cart-check', to: '/admin/pedidos' },
    ],
  },
  {
    title: 'Administracion',
    items: [
      { title: 'Usuarios', icon: 'bi-person-badge', to: '/admin/usuarios' },
      { title: 'Roles y permisos', icon: 'bi-shield-lock', to: '/admin/roles' },
      { title: 'Contenido web', icon: 'bi-window-stack', to: '/admin/sitio-web' },
      { title: 'Reportes', icon: 'bi-bar-chart-line', to: '/admin/reportes' },
      { title: 'Configuracion', icon: 'bi-gear', to: '/admin/configuracion' },
    ],
  },
]
