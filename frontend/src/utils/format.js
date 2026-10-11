/**
 * Utilidades de fecha/hora (trabajan en hora local para evitar
 * desfases de un dia tipicos de UTC).
 */

/** Fecha de hoy en formato YYYY-MM-DD (zona horaria local). */
export function todayISO() {
  const d = new Date()
  const offset = d.getTimezoneOffset()
  return new Date(d.getTime() - offset * 60000).toISOString().slice(0, 10)
}

/** Hora actual en formato HH:mm. */
export function nowHora() {
  const d = new Date()
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

/** "2026-10-10" -> "10 oct 2026". */
export function formatFecha(iso) {
  if (!iso) return '—'
  const d = new Date(`${iso}T00:00:00`)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
}

/** "2026-10-10" -> "sab, 10 oct". */
export function formatFechaCorta(iso) {
  if (!iso) return '—'
  const d = new Date(`${iso}T00:00:00`)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('es-ES', { weekday: 'short', day: '2-digit', month: 'short' })
}

export function isToday(iso) {
  return iso === todayISO()
}

export function isFuture(iso) {
  return !!iso && iso > todayISO()
}

/** Formatea un numero como moneda en Soles: 12000 -> "S/ 12,000.00". */
export function money(value) {
  const n = Number(value) || 0
  return `S/ ${n.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

/** Suma N dias a una fecha ISO (en hora local). */
export function addDias(iso, days) {
  const d = new Date(`${iso}T00:00:00`)
  d.setDate(d.getDate() + days)
  const offset = d.getTimezoneOffset()
  return new Date(d.getTime() - offset * 60000).toISOString().slice(0, 10)
}

/** "2026-10-10" -> "10 oct". */
export function formatDiaMes(iso) {
  if (!iso) return '—'
  const d = new Date(`${iso}T00:00:00`)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })
}

/** Edad legible a partir de una fecha de nacimiento ISO. */
export function edadDesde(iso) {
  if (!iso) return '—'
  const nacimiento = new Date(`${iso}T00:00:00`)
  if (Number.isNaN(nacimiento.getTime())) return '—'

  const hoy = new Date()
  let years = hoy.getFullYear() - nacimiento.getFullYear()
  const meses = hoy.getMonth() - nacimiento.getMonth()
  if (meses < 0 || (meses === 0 && hoy.getDate() < nacimiento.getDate())) years -= 1

  if (years < 1) {
    const diff = Math.max(0, Math.round((hoy - nacimiento) / (1000 * 60 * 60 * 24 * 30.44)))
    return `${diff} ${diff === 1 ? 'mes' : 'meses'}`
  }
  return `${years} ${years === 1 ? 'año' : 'años'}`
}
