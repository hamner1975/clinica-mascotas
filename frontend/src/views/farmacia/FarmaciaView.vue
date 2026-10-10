<template>
  <div>
    <div class="page-head">
      <div>
        <h1 class="page-title">Farmacia</h1>
        <p class="page-subtitle">Punto de venta &middot; venta en mostrador</p>
      </div>
    </div>

    <div class="row g-3">
      <!-- Catalogo -->
      <div class="col-12 col-lg-7">
        <div class="card h-100">
          <div class="card-body">
            <div class="row g-2 mb-3">
              <div class="col-12 col-md-7">
                <div class="position-relative">
                  <i class="bi bi-search search-icon"></i>
                  <input v-model="search" class="form-control ps-5" placeholder="Buscar medicamento o producto..." />
                </div>
              </div>
              <div class="col-12 col-md-5">
                <SearchSelect v-model="categoriaFiltro" :options="categoriaOptions" icon="bi-funnel" placeholder="Categoria" />
              </div>
            </div>

            <div v-if="filtrados.length === 0" class="text-center text-muted py-5">
              <i class="bi bi-capsule fs-2 d-block mb-2"></i>
              Sin productos disponibles.
            </div>

            <div v-else class="row g-2">
              <div v-for="p in filtrados" :key="p.id" class="col-12 col-md-6">
                <div class="pos-item">
                  <span class="thumb">
                    <img v-if="p.imagen" :src="p.imagen" alt="" />
                    <i v-else :class="['bi', iconoCategoria(p.categoria)]"></i>
                  </span>
                  <div class="flex-grow-1 overflow-hidden">
                    <div class="fw-semibold text-truncate">{{ p.nombre }}</div>
                    <small class="text-muted">{{ money(p.precio) }} &middot; {{ p.stock }} {{ p.unidad }}</small>
                  </div>
                  <button
                    class="btn btn-sm btn-primary flex-shrink-0"
                    type="button"
                    :disabled="p.stock <= 0"
                    @click="agregar(p)"
                  >
                    <i class="bi bi-plus-lg"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Carrito -->
      <div class="col-12 col-lg-5">
        <div class="card mb-3">
          <div class="card-body pb-2">
            <label class="form-label" for="f-cliente">Cliente (opcional)</label>
            <input id="f-cliente" v-model="cliente" class="form-control" placeholder="Cliente mostrador" />
          </div>
        </div>

        <CarritoPanel
          :items="carrito.items"
          :total="carrito.total"
          titulo="Venta en mostrador"
          @update-cantidad="carrito.setCantidad"
          @remove="carrito.remove"
        >
          <template #footer>
            <button class="btn btn-primary w-100" type="button" :disabled="carrito.vacio" @click="registrarVenta">
              <i class="bi bi-cash-coin me-2"></i>Registrar venta
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
import { useCarritoFarmaciaStore } from '@/stores/carrito'
import { useVentasStore } from '@/stores/ventas'
import { CATEGORIAS_PRODUCTO, iconoCategoria } from '@/data/catalogos'
import { money } from '@/utils/format'
import CarritoPanel from '@/components/farmacia/CarritoPanel.vue'
import SearchSelect from '@/components/ui/SearchSelect.vue'
import { notifyValidation, toastSuccess } from '@/utils/alerts'

const productos = useProductosStore()
const carrito = useCarritoFarmaciaStore()
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
    const matchesSearch = !q || p.nombre.toLowerCase().includes(q)
    const matchesCategoria = !categoriaFiltro.value || p.categoria === categoriaFiltro.value
    return matchesSearch && matchesCategoria
  })
})

function agregar(producto) {
  carrito.add(producto, 1)
}

function registrarVenta() {
  if (carrito.vacio) {
    notifyValidation('El carrito esta vacio.')
    return
  }
  const venta = ventas.registrar({ canal: 'Mostrador', cliente: cliente.value, items: carrito.items })
  toastSuccess('Venta registrada', `Total ${money(venta.total)}. Se desconto el stock.`)
  carrito.clear()
  cliente.value = ''
}
</script>
