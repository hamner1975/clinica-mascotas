<template>
  <div>
    <div class="page-head">
      <div>
        <h1 class="page-title">Pedidos y ventas</h1>
        <p class="page-subtitle">{{ store.total }} registros &middot; {{ money(store.resumen.recaudado) }} recaudado</p>
      </div>
    </div>

    <!-- Resumen -->
    <div class="row g-3 mb-3">
      <div class="col-6 col-xl-3">
        <StatCard label="Ventas totales" :value="store.total" icon="bi-receipt" variant="primary" />
      </div>
      <div class="col-6 col-xl-3">
        <StatCard label="Recaudado" :value="money(store.resumen.recaudado)" icon="bi-cash-coin" variant="success" />
      </div>
      <div class="col-6 col-xl-3">
        <StatCard label="Pendientes" :value="store.resumen.Pendiente" icon="bi-clock-history" variant="warning" />
      </div>
      <div class="col-6 col-xl-3">
        <StatCard label="Enviados" :value="store.resumen.Enviado" icon="bi-bag-check" variant="info" />
      </div>
    </div>

    <div class="card">
      <div class="card-body">
        <!-- Filtros -->
        <div class="row g-2 mb-3">
          <div class="col-12 col-md-6">
            <div class="position-relative">
              <i class="bi bi-search search-icon"></i>
              <input v-model="search" class="form-control ps-5" placeholder="Buscar por cliente..." />
            </div>
          </div>
          <div class="col-6 col-md-3">
            <select v-model="canalFiltro" class="form-select">
              <option value="">Todos los canales</option>
              <option v-for="c in CANALES_VENTA" :key="c" :value="c">{{ c }}</option>
            </select>
          </div>
          <div class="col-6 col-md-3">
            <select v-model="estadoFiltro" class="form-select">
              <option value="">Todos los estados</option>
              <option v-for="e in ESTADOS_VENTA" :key="e" :value="e">{{ e }}</option>
            </select>
          </div>
        </div>

        <!-- Tabla -->
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead>
              <tr class="text-muted small text-uppercase">
                <th scope="col">#</th>
                <th scope="col">Fecha</th>
                <th scope="col">Canal</th>
                <th scope="col">Cliente</th>
                <th scope="col" class="text-center">Items</th>
                <th scope="col" class="text-end">Total</th>
                <th scope="col">Estado</th>
                <th scope="col" class="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="v in paginated" :key="v.id">
                <td class="fw-semibold">#{{ v.id }}</td>
                <td class="text-nowrap">
                  <div>{{ formatFecha(v.fecha) }}</div>
                  <small class="text-muted">{{ v.hora }}</small>
                </td>
                <td><span class="badge rounded-pill" :class="canalVariant(v.canal)">{{ v.canal }}</span></td>
                <td>{{ v.cliente }}</td>
                <td class="text-center">{{ contarItems(v) }}</td>
                <td class="text-end fw-semibold">{{ money(v.total) }}</td>
                <td><span class="badge rounded-pill" :class="estadoVentaVariant(v.estado)">{{ v.estado }}</span></td>
                <td class="text-end text-nowrap">
                  <button class="btn btn-sm btn-light" type="button" title="Ver detalle" @click="verDetalle(v)">
                    <i class="bi bi-eye"></i>
                  </button>
                  <div class="dropdown d-inline-block">
                    <button class="btn btn-sm btn-light" type="button" data-bs-toggle="dropdown" aria-expanded="false" title="Cambiar estado">
                      <i class="bi bi-three-dots-vertical"></i>
                    </button>
                    <ul class="dropdown-menu dropdown-menu-end">
                      <li><h6 class="dropdown-header">Cambiar estado</h6></li>
                      <li v-for="e in ESTADOS_VENTA" :key="e">
                        <button class="dropdown-item" type="button" :disabled="e === v.estado" @click="cambiarEstado(v, e)">
                          <i :class="['bi', e === v.estado ? 'bi-check2' : 'bi-circle', 'me-2']"></i>{{ e }}
                        </button>
                      </li>
                      <li><hr class="dropdown-divider" /></li>
                      <li>
                        <button class="dropdown-item text-danger" type="button" @click="onDelete(v)">
                          <i class="bi bi-trash me-2"></i>Eliminar
                        </button>
                      </li>
                    </ul>
                  </div>
                </td>
              </tr>
              <tr v-if="paginated.length === 0">
                <td colspan="8">
                  <div class="text-center text-muted py-5">
                    <i class="bi bi-receipt fs-3 d-block mb-2"></i>
                    No hay ventas ni pedidos.
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <TablePagination :page="page" :per-page="perPage" :total="total" @update:page="setPage" />
      </div>
    </div>

    <VentaDetalleModal :open="detalleOpen" :venta="detalle" @close="detalleOpen = false" />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useVentasStore } from '@/stores/ventas'
import { CANALES_VENTA, ESTADOS_VENTA, canalVariant, estadoVentaVariant } from '@/data/catalogos'
import { formatFecha, money } from '@/utils/format'
import { usePagination } from '@/composables/usePagination'
import TablePagination from '@/components/ui/TablePagination.vue'
import StatCard from '@/components/ui/StatCard.vue'
import VentaDetalleModal from '@/components/farmacia/VentaDetalleModal.vue'
import { confirmDialog, toastSuccess } from '@/utils/alerts'

const store = useVentasStore()

const search = ref('')
const canalFiltro = ref('')
const estadoFiltro = ref('')

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  return store.ventas
    .filter((v) => {
      const matchesSearch = !q || v.cliente.toLowerCase().includes(q)
      const matchesCanal = !canalFiltro.value || v.canal === canalFiltro.value
      const matchesEstado = !estadoFiltro.value || v.estado === estadoFiltro.value
      return matchesSearch && matchesCanal && matchesEstado
    })
    .sort((a, b) => (a.fecha < b.fecha ? 1 : a.fecha > b.fecha ? -1 : b.hora.localeCompare(a.hora)))
})

const { page, perPage, total, paginated, setPage } = usePagination(filtered, 8)

const detalleOpen = ref(false)
const detalle = ref(null)

function contarItems(venta) {
  return venta.items.reduce((sum, item) => sum + item.cantidad, 0)
}

function verDetalle(venta) {
  detalle.value = venta
  detalleOpen.value = true
}

function cambiarEstado(venta, estado) {
  store.setEstado(venta.id, estado)
  toastSuccess('Estado actualizado', `La venta #${venta.id} ahora esta "${estado}".`)
}

async function onDelete(venta) {
  const result = await confirmDialog({
    title: 'Eliminar registro',
    text: `¿Deseas eliminar la venta #${venta.id} de ${venta.cliente}?`,
    confirmText: 'Si, eliminar',
    icon: 'warning',
  })
  if (result.isConfirmed) {
    store.remove(venta.id)
    toastSuccess('Registro eliminado', `La venta #${venta.id} fue eliminada.`)
  }
}
</script>
