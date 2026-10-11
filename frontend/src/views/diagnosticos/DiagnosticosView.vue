<template>
  <div>
    <div class="page-head">
      <div>
        <h1 class="page-title">Diagnosticos</h1>
        <p class="page-subtitle">Catalogo de enfermedades &middot; {{ store.total }} registros</p>
      </div>
      <button class="btn btn-primary" type="button" @click="openCreate">
        <i class="bi bi-plus-lg me-2"></i>Nuevo diagnostico
      </button>
    </div>

    <!-- Resumen -->
    <div class="row g-3 mb-3">
      <div class="col-6 col-xl-4">
        <StatCard label="Diagnosticos" :value="store.total" icon="bi-heart-pulse" variant="primary" />
      </div>
      <div class="col-6 col-xl-4">
        <StatCard label="Contagiosos" :value="store.contagiosos" icon="bi-virus" variant="danger" />
      </div>
      <div class="col-6 col-xl-4">
        <StatCard label="Categorias" :value="CATEGORIAS_DIAGNOSTICO.length" icon="bi-tags" variant="info" />
      </div>
    </div>

    <div class="card">
      <div class="card-body">
        <!-- Filtros -->
        <div class="row g-2 mb-3">
          <div class="col-12 col-md-8">
            <div class="position-relative">
              <i class="bi bi-search search-icon"></i>
              <input v-model="search" class="form-control ps-5" placeholder="Buscar por nombre o codigo..." />
            </div>
          </div>
          <div class="col-12 col-md-4">
            <SearchSelect v-model="categoriaFiltro" :options="categoriaOptions" icon="bi-funnel" placeholder="Categoria" />
          </div>
        </div>

        <!-- Tabla -->
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead>
              <tr class="text-muted small text-uppercase">
                <th scope="col">Codigo</th>
                <th scope="col">Diagnostico</th>
                <th scope="col">Categoria</th>
                <th scope="col" class="d-none d-lg-table-cell">Especie</th>
                <th scope="col" class="text-center d-none d-xl-table-cell">Usos</th>
                <th scope="col" class="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="d in paginated" :key="d.id">
                <td class="fw-semibold text-nowrap">{{ d.codigo }}</td>
                <td>
                  <div class="fw-semibold">
                    {{ d.nombre }}
                    <span v-if="d.contagioso" class="badge rounded-pill text-bg-danger ms-1" title="Contagioso">
                      <i class="bi bi-exclamation-triangle me-1"></i>Contagioso
                    </span>
                  </div>
                  <small class="text-muted">{{ d.descripcion || 'Sin descripcion' }}</small>
                </td>
                <td><span class="badge rounded-pill" :class="categoriaDiagVariant(d.categoria)">{{ d.categoria }}</span></td>
                <td class="d-none d-lg-table-cell text-muted">{{ d.especie }}</td>
                <td class="text-center d-none d-xl-table-cell">
                  <span class="badge rounded-pill text-bg-light border">{{ usos(d.nombre) }}</span>
                </td>
                <td class="text-end text-nowrap">
                  <button class="btn btn-sm btn-light" type="button" title="Editar" @click="openEdit(d)">
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button class="btn btn-sm btn-light text-danger" type="button" title="Eliminar" @click="onDelete(d)">
                    <i class="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
              <tr v-if="paginated.length === 0">
                <td colspan="6">
                  <div class="text-center text-muted py-5">
                    <i class="bi bi-heart-pulse fs-3 d-block mb-2"></i>
                    No se encontraron diagnosticos.
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <TablePagination :page="page" :per-page="perPage" :total="total" @update:page="setPage" />
      </div>
    </div>

    <DiagnosticoFormModal :open="modalOpen" :diagnostico="editing" @close="modalOpen = false" @saved="onSaved" />
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useDiagnosticosStore } from '@/stores/diagnosticos'
import { useConsultasStore } from '@/stores/consultas'
import { CATEGORIAS_DIAGNOSTICO, categoriaDiagVariant } from '@/data/catalogos'
import { usePagination } from '@/composables/usePagination'
import TablePagination from '@/components/ui/TablePagination.vue'
import StatCard from '@/components/ui/StatCard.vue'
import SearchSelect from '@/components/ui/SearchSelect.vue'
import DiagnosticoFormModal from '@/components/diagnosticos/DiagnosticoFormModal.vue'
import { confirmDialog, toastError, toastSuccess } from '@/utils/alerts'

const store = useDiagnosticosStore()
const consultas = useConsultasStore()

const search = ref('')
const categoriaFiltro = ref('')

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  return store.diagnosticos.filter((d) => {
    const matchesSearch = !q || d.nombre.toLowerCase().includes(q) || d.codigo.toLowerCase().includes(q)
    const matchesCategoria = !categoriaFiltro.value || d.categoria === categoriaFiltro.value
    return matchesSearch && matchesCategoria
  })
})

const { page, perPage, total, paginated, setPage } = usePagination(filtered, 8)

const categoriaOptions = [
  { value: '', label: 'Todas las categorias' },
  ...CATEGORIAS_DIAGNOSTICO.map((c) => ({ value: c, label: c })),
]

const modalOpen = ref(false)
const editing = ref(null)

/** Cuantas consultas usan este diagnostico (por nombre). */
function usos(nombre) {
  return consultas.consultas.filter((c) => c.diagnostico === nombre).length
}

function openCreate() {
  editing.value = null
  modalOpen.value = true
}
function openEdit(diagnostico) {
  editing.value = { ...diagnostico }
  modalOpen.value = true
}
function onSaved() {
  // El store ya persistio.
}

async function onDelete(diagnostico) {
  const result = await confirmDialog({
    title: 'Eliminar diagnostico',
    text: `¿Seguro que deseas eliminar "${diagnostico.nombre}" del catalogo?`,
    confirmText: 'Si, eliminar',
    icon: 'warning',
  })
  if (result.isConfirmed) {
    try {
      await store.remove(diagnostico.id)
      toastSuccess('Diagnostico eliminado', `${diagnostico.nombre} fue eliminado del catalogo.`)
    } catch (error) {
      toastError('No se pudo eliminar', error?.message || 'Intenta de nuevo.')
    }
  }
}

onMounted(() => {
  store.load().catch(() => {})
  consultas.load().catch(() => {})
})
</script>
