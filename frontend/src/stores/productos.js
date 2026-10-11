import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import api from '@/services/api'
import { addDias, todayISO } from '@/utils/format'

/**
 * Store del catalogo de productos (farmacia + tienda).
 * FASE 2: los datos viven en MySQL; aqui se consultan via la API.
 */
export const useProductosStore = defineStore('productos', () => {
  const productos = ref([])
  const loading = ref(false)
  const loaded = ref(false)

  async function load(force = false) {
    if (loading.value) return
    if (loaded.value && !force) return
    loading.value = true
    try {
      const { data } = await api.get('/productos')
      productos.value = data.data ?? []
      loaded.value = true
    } finally {
      loading.value = false
    }
  }

  const total = computed(() => productos.value.length)
  const activos = computed(() => productos.value.filter((p) => p.activo !== false))
  const bajoStock = computed(() => productos.value.filter((p) => p.stock > 0 && p.stock <= p.stockMinimo))
  const agotados = computed(() => productos.value.filter((p) => p.stock <= 0))

  const porVencer = computed(() => {
    const limite = addDias(todayISO(), 30)
    return productos.value.filter((p) => p.vencimiento && p.vencimiento <= limite)
  })

  const byId = (id) => productos.value.find((p) => p.id === Number(id)) || null

  function estadoStock(producto) {
    if (producto.stock <= 0) return 'Agotado'
    if (producto.stock <= producto.stockMinimo) return 'Bajo'
    return 'Ok'
  }

  async function save(payload) {
    if (payload.id) {
      const { data } = await api.put(`/productos/${payload.id}`, payload)
      const index = productos.value.findIndex((p) => p.id === payload.id)
      if (index !== -1) productos.value[index] = data.data
    } else {
      const { data } = await api.post('/productos', payload)
      productos.value.push(data.data)
    }
  }

  async function remove(id) {
    await api.delete(`/productos/${id}`)
    productos.value = productos.value.filter((p) => p.id !== Number(id))
  }

  return {
    productos,
    loading,
    loaded,
    total,
    activos,
    bajoStock,
    agotados,
    porVencer,
    byId,
    estadoStock,
    load,
    save,
    remove,
  }
})
