/**
 * Catalogo central de permisos del sistema, agrupados por modulo.
 * Las claves siguen el patron "modulo.accion" y se usan tanto en los
 * roles (RBAC) como, en la Fase 2, en el backend para autorizar peticiones.
 */
export const GRUPOS_PERMISOS = [
  {
    grupo: 'Pacientes',
    items: [
      { key: 'pacientes.ver', label: 'Ver pacientes' },
      { key: 'pacientes.gestionar', label: 'Crear / editar' },
      { key: 'pacientes.eliminar', label: 'Eliminar' },
    ],
  },
  {
    grupo: 'Citas y consultas',
    items: [
      { key: 'citas.ver', label: 'Ver citas' },
      { key: 'citas.gestionar', label: 'Gestionar citas' },
      { key: 'consultas.ver', label: 'Ver consultas' },
      { key: 'consultas.gestionar', label: 'Registrar consultas' },
      { key: 'historia.ver', label: 'Ver historia clinica' },
      { key: 'historia.gestionar', label: 'Editar historia clinica' },
      { key: 'diagnosticos.ver', label: 'Ver diagnosticos' },
      { key: 'diagnosticos.gestionar', label: 'Gestionar diagnosticos' },
    ],
  },
  {
    grupo: 'Farmacia y tienda',
    items: [
      { key: 'farmacia.ver', label: 'Ver farmacia' },
      { key: 'farmacia.vender', label: 'Vender en mostrador' },
      { key: 'inventario.ver', label: 'Ver inventario' },
      { key: 'inventario.gestionar', label: 'Gestionar inventario' },
      { key: 'tienda.ver', label: 'Ver tienda online' },
      { key: 'tienda.gestionar', label: 'Gestionar tienda' },
      { key: 'ventas.ver', label: 'Ver ventas / pedidos' },
      { key: 'ventas.gestionar', label: 'Gestionar ventas / pedidos' },
    ],
  },
  {
    grupo: 'Administracion',
    items: [
      { key: 'usuarios.ver', label: 'Ver usuarios' },
      { key: 'usuarios.gestionar', label: 'Gestionar usuarios' },
      { key: 'roles.ver', label: 'Ver roles' },
      { key: 'roles.gestionar', label: 'Gestionar roles' },
      { key: 'reportes.ver', label: 'Ver reportes' },
      { key: 'configuracion.gestionar', label: 'Configuracion del sistema' },
    ],
  },
]

/** Lista plana con todas las claves de permiso. */
export const TODOS_LOS_PERMISOS = GRUPOS_PERMISOS.flatMap((g) => g.items.map((i) => i.key))

/** Devuelve todos los permisos de un modulo (por prefijo). */
export function permisosDeModulo(prefijo) {
  return TODOS_LOS_PERMISOS.filter((key) => key.startsWith(`${prefijo}.`))
}
