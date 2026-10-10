import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { seedProductos } from '@/data/seed'
import { addDias, todayISO } from '@/utils/format'

const KEY = 'cm_productos'

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

/** Store del catalogo de productos (farmacia + tienda). */
export const useProductosStore = defineStore('productos', () => {
  const productos = ref(load(seedProductos))

  function persist() {
    localStorage.setItem(KEY, JSON.stringify(productos.value))
  }

  const total = computed(() => productos.value.length)
  const activos = computed(() => productos.value.filter((p) => p.activo !== false))

  /** Productos con stock positivo pero igual o por debajo del minimo. */
  const bajoStock = computed(() => productos.value.filter((p) => p.stock > 0 && p.stock <= p.stockMinimo))

  /** Productos sin existencias. */
  const agotados = computed(() => productos.value.filter((p) => p.stock <= 0))

  /** Productos que vencen en los proximos 30 dias (o ya vencidos). */
  const porVencer = computed(() => {
    const limite = addDias(todayISO(), 30)
    return productos.value.filter((p) => p.vencimiento && p.vencimiento <= limite)
  })

  function byId(id) {
    return productos.value.find((p) => p.id === Number(id)) || null
  }

  /** Devuelve "Agotado" | "Bajo" | "Ok" para colorear el stock. */
  function estadoStock(producto) {
    if (producto.stock <= 0) return 'Agotado'
    if (producto.stock <= producto.stockMinimo) return 'Bajo'
    return 'Ok'
  }

  function save(payload) {
    const data = {
      ...payload,
      precio: Number(payload.precio),
      costo: Number(payload.costo || 0),
      stock: Number(payload.stock),
      stockMinimo: Number(payload.stockMinimo || 0),
    }
    if (data.id) {
      const index = productos.value.findIndex((p) => p.id === data.id)
      if (index !== -1) productos.value[index] = { ...productos.value[index], ...data }
    } else {
      productos.value.push({ ...data, id: nextId(productos.value) })
    }
    persist()
  }

  function remove(id) {
    productos.value = productos.value.filter((p) => p.id !== id)
    persist()
  }

  /** Descuenta stock tras una venta. */
  function descontarStock(items) {
    items.forEach((item) => {
      const producto = byId(item.productoId)
      if (producto) producto.stock = Math.max(0, producto.stock - item.cantidad)
    })
    persist()
  }

  return {
    productos,
    total,
    activos,
    bajoStock,
    agotados,
    porVencer,
    byId,
    estadoStock,
    save,
    remove,
    descontarStock,
  }
})
