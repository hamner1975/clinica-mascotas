<template>
  <div>
    <div class="page-head">
      <div>
        <h1 class="page-title">Inventario</h1>
        <p class="page-subtitle">{{ store.total }} productos en catalogo</p>
      </div>
      <button class="btn btn-primary" type="button" @click="openCreate">
        <i class="bi bi-plus-lg me-2"></i>Nuevo producto
      </button>
    </div>

    <!-- Resumen -->
    <div class="row g-3 mb-3">
      <div class="col-6 col-xl-3">
        <StatCard label="Productos" :value="store.total" icon="bi-box-seam" variant="primary" />
      </div>
      <div class="col-6 col-xl-3">
        <StatCard label="Bajo stock" :value="store.bajoStock.length" icon="bi-exclamation-triangle" variant="warning" />
      </div>
      <div class="col-6 col-xl-3">
        <StatCard label="Agotados" :value="store.agotados.length" icon="bi-x-lg" variant="danger" />
      </div>
      <div class="col-6 col-xl-3">
        <StatCard label="Por vencer" :value="store.porVencer.length" icon="bi-clock-history" variant="info" />
      </div>
    </div>

    <div class="card">
      <div class="card-body">
        <!-- Filtros -->
        <div class="row g-2 mb-3">
          <div class="col-12 col-md-5">
            <div class="position-relative">
              <i class="bi bi-search search-icon"></i>
              <input v-model="search" class="form-control ps-5" placeholder="Buscar producto o lote..." />
            </div>
          </div>
          <div class="col-6 col-md-3">
            <SearchSelect v-model="categoriaFiltro" :options="categoriaOptions" icon="bi-funnel" placeholder="Categoria" />
          </div>
          <div class="col-6 col-md-4">
            <SearchSelect v-model="stockFiltro" :options="stockOptions" icon="bi-funnel" placeholder="Stock" />
          </div>
        </div>

        <!-- Tabla -->
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead>
              <tr class="text-muted small text-uppercase">
                <th scope="col">Producto</th>
                <th scope="col" class="text-end">Precio</th>
                <th scope="col" class="text-center">Stock</th>
                <th scope="col" class="d-none d-lg-table-cell">Lote</th>
                <th scope="col" class="d-none d-lg-table-cell">Vencimiento</th>
                <th scope="col" class="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="p in paginated" :key="p.id">
                <td>
                  <div class="d-flex align-items-center gap-2">
                    <span class="thumb">
                      <img v-if="p.imagen" :src="p.imagen" alt="" />
                      <i v-else :class="['bi', iconoCategoria(p.categoria)]"></i>
                    </span>
                    <div>
                      <div class="fw-semibold">{{ p.nombre }}</div>
                      <span class="badge rounded-pill me-1" :class="categoriaVariant(p.categoria)">{{ p.categoria }}</span>
                      <span v-if="p.descuento > 0" class="badge rounded-pill text-bg-danger me-1">-{{ p.descuento }}%</span>
                      <span v-if="p.requiereReceta" class="badge rounded-pill text-bg-light border">
                        <i class="bi bi-shield-check me-1"></i>Receta
                      </span>
                    </div>
                  </div>
                </td>
                <td class="text-end">
                  <div v-if="p.descuento > 0">
                    <span class="text-muted text-decoration-line-through small">{{ money(p.precio) }}</span>
                    <div class="fw-semibold text-danger">{{ money(precioConDescuento(p)) }}</div>
                  </div>
                  <span v-else>{{ money(p.precio) }}</span>
                </td>
                <td class="text-center">
                  <span class="badge rounded-pill" :class="stockVariant(p)">{{ p.stock }} {{ p.unidad }}</span>
                </td>
                <td class="d-none d-lg-table-cell text-muted">{{ p.lote || '—' }}</td>
                <td class="d-none d-lg-table-cell">
                  <span :class="{ 'text-danger fw-semibold': esPorVencer(p) }">
                    {{ p.vencimiento ? formatFecha(p.vencimiento) : '—' }}
                  </span>
                </td>
                <td class="text-end text-nowrap">
                  <button class="btn btn-sm btn-light" type="button" title="Editar" @click="openEdit(p)">
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button class="btn btn-sm btn-light text-danger" type="button" title="Eliminar" @click="onDelete(p)">
                    <i class="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
              <tr v-if="paginated.length === 0">
                <td colspan="6">
                  <div class="text-center text-muted py-5">
                    <i class="bi bi-box-seam fs-3 d-block mb-2"></i>
                    No se encontraron productos.
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <TablePagination :page="page" :per-page="perPage" :total="total" @update:page="setPage" />
      </div>
    </div>

    <ProductoFormModal :open="modalOpen" :producto="editing" @close="modalOpen = false" @saved="onSaved" />
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useProductosStore } from '@/stores/productos'
import { CATEGORIAS_PRODUCTO, categoriaVariant, iconoCategoria, precioConDescuento } from '@/data/catalogos'
import { addDias, formatFecha, money, todayISO } from '@/utils/format'
import { usePagination } from '@/composables/usePagination'
import TablePagination from '@/components/ui/TablePagination.vue'
import StatCard from '@/components/ui/StatCard.vue'
import SearchSelect from '@/components/ui/SearchSelect.vue'
import ProductoFormModal from '@/components/farmacia/ProductoFormModal.vue'
import { confirmDialog, toastError, toastSuccess } from '@/utils/alerts'

const store = useProductosStore()

const search = ref('')
const categoriaFiltro = ref('')
const stockFiltro = ref('')

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  return store.productos.filter((p) => {
    const matchesSearch = !q || p.nombre.toLowerCase().includes(q) || (p.lote || '').toLowerCase().includes(q)
    const matchesCategoria = !categoriaFiltro.value || p.categoria === categoriaFiltro.value
    const matchesStock = !stockFiltro.value || store.estadoStock(p) === stockFiltro.value
    return matchesSearch && matchesCategoria && matchesStock
  })
})

const { page, perPage, total, paginated, setPage } = usePagination(filtered, 8)

const categoriaOptions = [
  { value: '', label: 'Todas las categorias' },
  ...CATEGORIAS_PRODUCTO.map((c) => ({ value: c, label: c })),
]
const stockOptions = [
  { value: '', label: 'Cualquier stock' },
  { value: 'Ok', label: 'Stock saludable' },
  { value: 'Bajo', label: 'Bajo stock' },
  { value: 'Agotado', label: 'Agotado' },
]

const modalOpen = ref(false)
const editing = ref(null)

function stockVariant(p) {
  const estado = store.estadoStock(p)
  if (estado === 'Agotado') return 'text-bg-danger'
  if (estado === 'Bajo') return 'text-bg-warning'
  return 'text-bg-success'
}
function esPorVencer(p) {
  return p.vencimiento && p.vencimiento <= addDias(todayISO(), 30)
}

function openCreate() {
  editing.value = null
  modalOpen.value = true
}
function openEdit(producto) {
  editing.value = { ...producto }
  modalOpen.value = true
}
function onSaved() {
  // El store ya persistio.
}

async function onDelete(producto) {
  const result = await confirmDialog({
    title: 'Eliminar producto',
    text: `¿Seguro que deseas eliminar "${producto.nombre}" del catalogo?`,
    confirmText: 'Si, eliminar',
    icon: 'warning',
  })
  if (result.isConfirmed) {
    try {
      await store.remove(producto.id)
      toastSuccess('Producto eliminado', `${producto.nombre} fue eliminado del catalogo.`)
    } catch (error) {
      toastError('No se pudo eliminar', error?.message || 'Intenta de nuevo.')
    }
  }
}

onMounted(() => {
  store.load().catch(() => {})
})
</script>
