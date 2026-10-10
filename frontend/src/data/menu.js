/**
 * Configuracion del menu lateral. Alimenta la barra de navegacion
 * y mantiene una unica fuente de verdad para titulos e iconos.
 */
export const menuSections = [
  {
    title: 'Principal',
    items: [{ title: 'Dashboard', icon: 'bi-speedometer2', to: '/' }],
  },
  {
    title: 'Atencion medica',
    items: [
      { title: 'Citas', icon: 'bi-calendar2-week', to: '/citas' },
      { title: 'Consultas', icon: 'bi-clipboard2-pulse', to: '/consultas' },
      { title: 'Historia clinica', icon: 'bi-journal-medical', to: '/historia-clinica' },
      { title: 'Diagnosticos', icon: 'bi-heart-pulse', to: '/diagnosticos' },
    ],
  },
  {
    title: 'Pacientes',
    items: [
      { title: 'Mascotas', icon: 'bi-heart', to: '/mascotas' },
      { title: 'Duenos / Tutores', icon: 'bi-people', to: '/duenos' },
    ],
  },
  {
    title: 'Farmacia y tienda',
    items: [
      { title: 'Farmacia', icon: 'bi-capsule', to: '/farmacia' },
      { title: 'Inventario', icon: 'bi-box-seam', to: '/inventario' },
      { title: 'Tienda online', icon: 'bi-shop', to: '/tienda' },
      { title: 'Pedidos y ventas', icon: 'bi-cart-check', to: '/pedidos' },
    ],
  },
  {
    title: 'Administracion',
    items: [
      { title: 'Usuarios', icon: 'bi-person-badge', to: '/usuarios' },
      { title: 'Roles y permisos', icon: 'bi-shield-lock', to: '/roles' },
      { title: 'Reportes', icon: 'bi-bar-chart-line', to: '/reportes' },
      { title: 'Configuracion', icon: 'bi-gear', to: '/configuracion' },
    ],
  },
]
