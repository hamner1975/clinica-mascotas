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
export const MONEDAS = ['PEN', 'USD', 'COP', 'MXN', 'EUR', 'ARS', 'CLP']

/** Icono representativo segun la categoria del producto. */
export function iconoCategoria(categoria) {
  const map = {
    Medicamentos: 'bi-capsule',
    Vacunas: 'bi-shield-check',
    Alimentos: 'bi-bag',
    Higiene: 'bi-droplet',
    Accesorios: 'bi-tags',
    Otros: 'bi-box-seam',
  }
  return map[categoria] || 'bi-box-seam'
}

// ---- Metodos de pago ----
/** Metodos de pago de la tienda online. */
export const METODOS_PAGO_TIENDA = ['Yape', 'Plin', 'Transferencia bancaria', 'Mercado Pago']

/** Metodos de pago en farmacia (mostrador): los de la tienda + efectivo. */
export const METODOS_PAGO_MOSTRADOR = ['Efectivo', ...METODOS_PAGO_TIENDA]

export function metodoPagoIcon(metodo) {
  const map = {
    Efectivo: 'bi-cash-coin',
    Yape: 'bi-phone',
    Plin: 'bi-phone',
    'Transferencia bancaria': 'bi-bank',
    'Mercado Pago': 'bi-credit-card',
  }
  return map[metodo] || 'bi-credit-card'
}

/** Precio final de un producto aplicando su descuento (% si es oferta). */
export function precioConDescuento(producto) {
  const base = Number(producto?.precio) || 0
  const descuento = Number(producto?.descuento) || 0
  return descuento > 0 ? Math.round(base * (1 - descuento / 100)) : base
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
