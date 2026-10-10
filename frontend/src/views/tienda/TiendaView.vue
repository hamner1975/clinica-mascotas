<template>
  <div>
    <div class="page-head">
      <div>
        <h1 class="page-title">Tienda online</h1>
        <p class="page-subtitle">Catalogo publico &middot; pedidos de clientes</p>
      </div>
    </div>

    <div class="row g-3">
      <!-- Catalogo -->
      <div class="col-12 col-lg-8">
        <div class="card mb-3">
          <div class="card-body">
            <div class="row g-2">
              <div class="col-12 col-md-7">
                <div class="position-relative">
                  <i class="bi bi-search search-icon"></i>
                  <input v-model="search" class="form-control ps-5" placeholder="Buscar en la tienda..." />
                </div>
              </div>
              <div class="col-12 col-md-5">
                <SearchSelect v-model="categoriaFiltro" :options="categoriaOptions" icon="bi-funnel" placeholder="Categoria" />
              </div>
            </div>
          </div>
        </div>

        <div v-if="filtrados.length === 0" class="card">
          <div class="card-body text-center text-muted py-5">
            <i class="bi bi-shop fs-2 d-block mb-2"></i>
            No hay productos que coincidan.
          </div>
        </div>

        <div v-else class="row g-3">
          <div v-for="p in filtrados" :key="p.id" class="col-12 col-sm-6 col-xl-4">
            <div class="card shop-card h-100">
              <div class="card-body d-flex flex-column">
                <div class="shop-card__media">
                  <img v-if="p.imagen" :src="p.imagen" :alt="p.nombre" />
                  <i v-else :class="['bi', iconoCategoria(p.categoria)]"></i>
                </div>
                <span class="badge rounded-pill align-self-start mb-2" :class="categoriaVariant(p.categoria)">
                  {{ p.categoria }}
                </span>
                <h3 class="h6 mb-1">{{ p.nombre }}</h3>
                <p class="text-muted small mb-2 flex-grow-1">{{ p.descripcion || 'Sin descripcion.' }}</p>
                <div class="d-flex justify-content-between align-items-center">
                  <span class="fw-bold">{{ money(p.precio) }}</span>
                  <button class="btn btn-sm btn-primary" type="button" :disabled="p.stock <= 0" @click="agregar(p)">
                    <i class="bi bi-cart-plus me-1"></i>{{ p.stock <= 0 ? 'Agotado' : 'Agregar' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Carrito -->
      <div class="col-12 col-lg-4">
        <div class="card mb-3">
          <div class="card-body pb-2">
            <label class="form-label" for="t-cliente">Tu nombre <span class="text-danger">*</span></label>
            <input id="t-cliente" v-model="cliente" class="form-control" placeholder="Ej: Maria Gomez" />
          </div>
        </div>

        <CarritoPanel
          :items="carrito.items"
          :total="carrito.total"
          titulo="Mi pedido"
          @update-cantidad="carrito.setCantidad"
          @remove="carrito.remove"
        >
          <template #footer>
            <button class="btn btn-primary w-100" type="button" :disabled="carrito.vacio" @click="realizarPedido">
              <i class="bi bi-bag-check me-2"></i>Realizar pedido
            </button>
          </template>
        </CarritoPanel>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useProductosStore } from '@/stores/productos'
import { useCarritoTiendaStore } from '@/stores/carrito'
import { useVentasStore } from '@/stores/ventas'
import { CATEGORIAS_PRODUCTO, categoriaVariant, iconoCategoria } from '@/data/catalogos'
import { money } from '@/utils/format'
import CarritoPanel from '@/components/farmacia/CarritoPanel.vue'
import SearchSelect from '@/components/ui/SearchSelect.vue'
import { notifyValidation, toastInfo, toastSuccess } from '@/utils/alerts'

const productos = useProductosStore()
const carrito = useCarritoTiendaStore()
const ventas = useVentasStore()

const search = ref('')
const categoriaFiltro = ref('')
const cliente = ref('')

const categoriaOptions = [
  { value: '', label: 'Todas las categorias' },
  ...CATEGORIAS_PRODUCTO.map((c) => ({ value: c, label: c })),
]

const filtrados = computed(() => {
  const q = search.value.trim().toLowerCase()
  return productos.activos.filter((p) => {
    const matchesSearch =
      !q || p.nombre.toLowerCase().includes(q) || (p.descripcion || '').toLowerCase().includes(q)
    const matchesCategoria = !categoriaFiltro.value || p.categoria === categoriaFiltro.value
    return matchesSearch && matchesCategoria
  })
})

function agregar(producto) {
  carrito.add(producto, 1)
}

function realizarPedido() {
  if (carrito.vacio) {
    notifyValidation('Tu carrito esta vacio.')
    return
  }
  if (!cliente.value.trim()) {
    notifyValidation('El campo "Tu nombre" es obligatorio para el pedido.')
    return
  }
  const venta = ventas.registrar({ canal: 'Online', cliente: cliente.value.trim(), items: carrito.items })
  toastSuccess('Pedido realizado', `Pedido #${venta.id} por ${money(venta.total)}. Estado: Pendiente.`)
  toastInfo('Seguimiento', 'Puedes ver el estado del pedido en "Pedidos y ventas".')
  carrito.clear()
  cliente.value = ''
}
</script>
