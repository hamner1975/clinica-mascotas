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

// ---- Farmacia / Tienda ----
export const CATEGORIAS_PRODUCTO = ['Medicamentos', 'Vacunas', 'Alimentos', 'Higiene', 'Accesorios', 'Otros']

export const TIPOS_PRODUCTO = ['Medicamento', 'Producto']

export const UNIDADES = ['Unidad', 'Caja', 'Blister', 'Frasco', 'Kg', 'Bolsa']

export const CANALES_VENTA = ['Mostrador', 'Online']

export const ESTADOS_VENTA = ['Pendiente', 'Completada', 'Enviado', 'Cancelada']

/** Color de badge segun la categoria del producto. */
export function categoriaVariant(categoria) {
  const map = {
    Medicamentos: 'text-bg-primary',
    Vacunas: 'text-bg-danger',
    Alimentos: 'text-bg-success',
    Higiene: 'text-bg-info',
    Accesorios: 'text-bg-warning',
    Otros: 'text-bg-secondary',
  }
  return map[categoria] || 'text-bg-secondary'
}

/** Color de badge segun el estado de la venta. */
export function estadoVentaVariant(estado) {
  const map = {
    Pendiente: 'text-bg-warning',
    Completada: 'text-bg-success',
    Enviado: 'text-bg-primary',
    Cancelada: 'text-bg-danger',
  }
  return map[estado] || 'text-bg-secondary'
}

export function canalVariant(canal) {
  return canal === 'Online' ? 'text-bg-info' : 'text-bg-secondary'
}

// ---- Diagnosticos ----
export const CATEGORIAS_DIAGNOSTICO = [
  'Infecciosas',
  'Parasitarias',
  'Dermatologicas',
  'Osteomusculares',
  'Digestivas',
  'Respiratorias',
  'Oftalmologicas',
  'Otras',
]

export function categoriaDiagVariant(categoria) {
  const map = {
    Infecciosas: 'text-bg-danger',
    Parasitarias: 'text-bg-warning',
    Dermatologicas: 'text-bg-info',
    Osteomusculares: 'text-bg-secondary',
    Digestivas: 'text-bg-success',
    Respiratorias: 'text-bg-primary',
    Oftalmologicas: 'text-bg-dark',
    Otras: 'text-bg-secondary',
  }
  return map[categoria] || 'text-bg-secondary'
}

// ---- Configuracion ----
export const MONEDAS = ['COP', 'USD', 'MXN', 'PEN', 'EUR', 'ARS', 'CLP']

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
