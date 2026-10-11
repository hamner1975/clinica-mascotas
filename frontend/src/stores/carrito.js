import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { precioConDescuento } from '@/data/catalogos'

/**
 * Logica de carrito compartida. Se instancia dos veces:
 *  - useCarritoFarmaciaStore  -> venta en mostrador (POS)
 *  - useCarritoTiendaStore    -> pedido de la tienda online
 * Asi cada contexto mantiene su propio carrito, sin mezclarse.
 */
function cartSetup() {
  const items = ref([])

  const total = computed(() => items.value.reduce((sum, item) => sum + item.precio * item.cantidad, 0))
  const cantidadTotal = computed(() => items.value.reduce((sum, item) => sum + item.cantidad, 0))
  const vacio = computed(() => items.value.length === 0)

  function add(producto, cantidad = 1) {
    const max = producto.stock > 0 ? producto.stock : 0
    if (max === 0) return
    const precio = precioConDescuento(producto)
    const existente = items.value.find((item) => item.productoId === producto.id)
    if (existente) {
      existente.cantidad = Math.min(existente.cantidad + cantidad, max)
    } else {
      items.value.push({
        productoId: producto.id,
        nombre: producto.nombre,
        precio,
        cantidad: Math.min(cantidad, max),
        stock: max,
      })
    }
  }

  function setCantidad({ productoId, cantidad }) {
    const item = items.value.find((i) => i.productoId === productoId)
    if (!item) return
    const valor = Math.min(Math.max(1, Number(cantidad) || 1), item.stock)
    item.cantidad = valor
  }

  function remove(productoId) {
    items.value = items.value.filter((item) => item.productoId !== productoId)
  }

  function clear() {
    items.value = []
  }

  return { items, total, cantidadTotal, vacio, add, setCantidad, remove, clear }
}

export const useCarritoFarmaciaStore = defineStore('carrito-farmacia', cartSetup)
export const useCarritoTiendaStore = defineStore('carrito-tienda', cartSetup)
