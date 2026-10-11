/**
 * Configuracion del menu lateral del panel (/admin).
 * Cada item indica el permiso requerido (segun el rol del usuario).
 */
export const menuSections = [
  {
    title: 'Principal',
    items: [{ title: 'Dashboard', icon: 'bi-speedometer2', to: '/admin' }],
  },
  {
    title: 'Atencion medica',
    items: [
      { title: 'Citas', icon: 'bi-calendar2-week', to: '/admin/citas', permiso: 'citas.ver' },
      { title: 'Consultas', icon: 'bi-clipboard2-pulse', to: '/admin/consultas', permiso: 'consultas.ver' },
      { title: 'Historia clinica', icon: 'bi-journal-medical', to: '/admin/historia-clinica', permiso: 'historia.ver' },
      { title: 'Diagnosticos', icon: 'bi-heart-pulse', to: '/admin/diagnosticos', permiso: 'diagnosticos.ver' },
    ],
  },
  {
    title: 'Pacientes',
    items: [
      { title: 'Mascotas', icon: 'bi-heart', to: '/admin/mascotas', permiso: 'pacientes.ver' },
      { title: 'Duenos / Tutores', icon: 'bi-people', to: '/admin/duenos', permiso: 'pacientes.ver' },
    ],
  },
  {
    title: 'Farmacia y ventas',
    items: [
      { title: 'Farmacia', icon: 'bi-capsule', to: '/admin/farmacia', permiso: 'farmacia.ver' },
      { title: 'Inventario', icon: 'bi-box-seam', to: '/admin/inventario', permiso: 'inventario.ver' },
      { title: 'Pedidos y ventas', icon: 'bi-cart-check', to: '/admin/pedidos', permiso: 'ventas.ver' },
    ],
  },
  {
    title: 'Administracion',
    items: [
      { title: 'Usuarios', icon: 'bi-person-badge', to: '/admin/usuarios', permiso: 'usuarios.ver' },
      { title: 'Roles y permisos', icon: 'bi-shield-lock', to: '/admin/roles', permiso: 'roles.ver' },
      { title: 'Contenido web', icon: 'bi-window-stack', to: '/admin/sitio-web', permiso: 'configuracion.gestionar' },
      { title: 'Reportes', icon: 'bi-bar-chart-line', to: '/admin/reportes', permiso: 'reportes.ver' },
      { title: 'Configuracion', icon: 'bi-gear', to: '/admin/configuracion', permiso: 'configuracion.gestionar' },
    ],
  },
]
