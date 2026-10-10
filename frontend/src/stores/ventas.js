import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { seedVentas } from '@/data/seed'
import { nowHora, todayISO } from '@/utils/format'
import { useProductosStore } from '@/stores/productos'

const KEY = 'cm_ventas'

function load(fallback) {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : structuredClone(fallback)
  } catch {
    return structuredClone(fallback)
  }
}

function nextId(list) {
  return list.reduce((max, item) => Math.max(max, item.id), 0) + 1
}

/** Store de ventas y pedidos (mostrador + online). */
export const useVentasStore = defineStore('ventas', () => {
  const ventas = ref(load(seedVentas))

  function persist() {
    localStorage.setItem(KEY, JSON.stringify(ventas.value))
  }

  const total = computed(() => ventas.value.length)

  const resumen = computed(() => {
    const base = { Pendiente: 0, Completada: 0, Enviado: 0, Cancelada: 0, recaudado: 0 }
    ventas.value.forEach((venta) => {
      base[venta.estado] = (base[venta.estado] || 0) + 1
      if (venta.estado !== 'Cancelada') base.recaudado += venta.total
    })
    return base
  })

  /**
   * Registra una venta/pedido y descuenta el stock.
   * @param {{ canal: 'Mostrador'|'Online', cliente?: string, items: Array }} payload
   */
  function registrar({ canal, cliente, items }) {
    const productos = useProductosStore()
    const totalVenta = items.reduce((sum, item) => sum + item.precio * item.cantidad, 0)
    const venta = {
      id: nextId(ventas.value),
      fecha: todayISO(),
      hora: nowHora(),
      canal,
      cliente: cliente || (canal === 'Online' ? 'Cliente online' : 'Cliente mostrador'),
      items: items.map((item) => ({
        productoId: item.productoId,
        nombre: item.nombre,
        precio: item.precio,
        cantidad: item.cantidad,
      })),
      total: totalVenta,
      estado: canal === 'Online' ? 'Pendiente' : 'Completada',
    }
    ventas.value.push(venta)
    productos.descontarStock(venta.items)
    persist()
    return venta
  }

  function setEstado(id, estado) {
    const index = ventas.value.findIndex((venta) => venta.id === id)
    if (index !== -1) {
      ventas.value[index] = { ...ventas.value[index], estado }
      persist()
    }
  }

  function remove(id) {
    ventas.value = ventas.value.filter((venta) => venta.id !== id)
    persist()
  }

  return { ventas, total, resumen, registrar, setEstado, remove }
})
