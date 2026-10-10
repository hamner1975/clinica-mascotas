/**
 * Catalogos estaticos del sistema.
 * Centralizarlos evita "numeros magicos" repartidos por las vistas.
 */
export const ESPECIES = ['Perro', 'Gato', 'Ave', 'Roedor', 'Reptil', 'Otro']

export const SEXOS = ['Macho', 'Hembra']

export const ESTADOS_CITA = ['Pendiente', 'Confirmada', 'En sala', 'Atendida', 'Cancelada']

export const VETERINARIOS = ['Dra. Ana Ramirez', 'Dr. Carlos Mena', 'Dra. Lucia Vega']

/** Color de badge segun el estado de la cita. */
export function estadoCitaVariant(estado) {
  const map = {
    Pendiente: 'text-bg-secondary',
    Confirmada: 'text-bg-success',
    'En sala': 'text-bg-primary',
    Atendida: 'text-bg-dark',
    Cancelada: 'text-bg-danger',
  }
  return map[estado] || 'text-bg-secondary'
}

/** Color de badge segun la especie (para la tabla de mascotas). */
export function especieVariant(especie) {
  const map = {
    Perro: 'text-bg-primary',
    Gato: 'text-bg-info',
    Ave: 'text-bg-success',
    Roedor: 'text-bg-warning',
    Reptil: 'text-bg-dark',
    Otro: 'text-bg-secondary',
  }
  return map[especie] || 'text-bg-secondary'
}
