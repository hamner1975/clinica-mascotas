import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import api from '@/services/api'

/**
 * Store de ventas y pedidos (mostrador + online).
 * FASE 2: los datos viven en MySQL; aqui se consultan via la API.
 */
export const useVentasStore = defineStore('ventas', () => {
  const ventas = ref([])
  const loading = ref(false)
  const loaded = ref(false)

  async function load(force = false) {
    if (loading.value) return
    if (loaded.value && !force) return
    loading.value = true
    try {
      const { data } = await api.get('/ventas')
      ventas.value = data.data ?? []
      loaded.value = true
    } finally {
      loading.value = false
    }
  }

  const total = computed(() => ventas.value.length)

  const resumen = computed(() => {
    const base = { Pendiente: 0, Completada: 0, Enviado: 0, Cancelada: 0, recaudado: 0 }
    ventas.value.forEach((venta) => {
      base[venta.estado] = (base[venta.estado] || 0) + 1
      if (venta.estado !== 'Cancelada') base.recaudado += Number(venta.total) || 0
    })
    return base
  })

  /**
   * Registra una venta/pedido. El servidor calcula precios, total y descuenta stock.
   * @returns la venta creada
   */
  async function registrar({ canal, cliente, items, metodoPago }) {
    const payload = {
      canal,
      cliente,
      metodoPago,
      items: items.map((i) => ({ productoId: i.productoId, cantidad: i.cantidad })),
    }
    const { data } = await api.post('/ventas', payload)
    const venta = data.data
    ventas.value.push(venta)
    return venta
  }

  /** Pedido desde la tienda publica (sin sesion). */
  async function registrarPedido({ canal, cliente, items, metodoPago }) {
    const payload = {
      canal: canal || 'Online',
      cliente,
      metodoPago,
      items: items.map((i) => ({ productoId: i.productoId, cantidad: i.cantidad })),
    }
    const { data } = await api.post('/tienda/pedidos', payload)
    const venta = data.data
    ventas.value.push(venta)
    return venta
  }

  async function setEstado(id, estado) {
    const { data } = await api.put(`/ventas/${id}`, { estado })
    const index = ventas.value.findIndex((v) => v.id === Number(id))
    if (index !== -1) ventas.value[index] = data.data
  }

  async function remove(id) {
    await api.delete(`/ventas/${id}`)
    ventas.value = ventas.value.filter((v) => v.id !== Number(id))
  }

  return { ventas, loading, loaded, total, resumen, load, registrar, registrarPedido, setEstado, remove }
})
