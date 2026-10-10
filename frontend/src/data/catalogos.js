/**
 * Catalogos estaticos del sistema.
 * Centralizarlos evita "numeros magicos" repartidos por las vistas.
 */
export const ESPECIES = ['Perro', 'Gato', 'Ave', 'Roedor', 'Reptil', 'Otro']

export const SEXOS = ['Macho', 'Hembra']

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
