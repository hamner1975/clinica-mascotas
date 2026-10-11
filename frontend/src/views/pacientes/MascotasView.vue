<template>
  <div>
    <div class="page-head">
      <div>
        <h1 class="page-title">Mascotas</h1>
        <p class="page-subtitle">{{ store.totalMascotas }} pacientes registrados</p>
      </div>
      <button class="btn btn-primary" type="button" @click="openCreate">
        <i class="bi bi-plus-lg me-2"></i>Nueva mascota
      </button>
    </div>

    <div class="card">
      <div class="card-body">
        <!-- Filtros -->
        <div class="row g-2 mb-3">
          <div class="col-12 col-md-6">
            <div class="position-relative">
              <i class="bi bi-search search-icon"></i>
              <input
                v-model="search"
                class="form-control ps-5"
                placeholder="Buscar por nombre, raza o dueño..."
              />
            </div>
          </div>
          <div class="col-6 col-md-3">
            <SearchSelect v-model="especieFiltro" :options="especieOptions" icon="bi-funnel" placeholder="Especie" />
          </div>
          <div class="col-6 col-md-3">
            <SearchSelect v-model="duenoFiltro" :options="duenoOptions" icon="bi-funnel" placeholder="Dueño" />
          </div>
        </div>

        <!-- Tabla -->
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead>
              <tr class="text-muted small text-uppercase">
                <th scope="col">Mascota</th>
                <th scope="col">Especie</th>
                <th scope="col">Sexo</th>
                <th scope="col">Edad</th>
                <th scope="col">Peso</th>
                <th scope="col">Dueño</th>
                <th scope="col" class="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="m in paginated" :key="m.id">
                <td>
                  <div class="d-flex align-items-center gap-2">
                    <span class="avatar avatar--sm" :class="{ 'avatar--img': m.foto }">
                      <img v-if="m.foto" :src="m.foto" alt="" />
                      <template v-else>{{ inicial(m.nombre) }}</template>
                    </span>
                    <div>
                      <div class="fw-semibold">{{ m.nombre }}</div>
                      <small class="text-muted">{{ m.raza || 'Sin raza' }}</small>
                    </div>
                  </div>
                </td>
                <td><span class="badge rounded-pill" :class="especieVariant(m.especie)">{{ m.especie }}</span></td>
                <td>{{ m.sexo || '&mdash;' }}</td>
                <td>{{ edadDesde(m.fechaNacimiento) }}</td>
                <td>{{ m.peso != null ? `${m.peso} kg` : '—' }}</td>
                <td>{{ store.duenoNombre(m.duenoId) }}</td>
                <td class="text-end text-nowrap">
                  <button class="btn btn-sm btn-light text-primary" type="button" title="Ver historia clinica" @click="verHistoria(m)">
                    <i class="bi bi-journal-medical"></i>
                  </button>
                  <button class="btn btn-sm btn-light" type="button" title="Editar" @click="openEdit(m)">
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button class="btn btn-sm btn-light text-danger" type="button" title="Eliminar" @click="onDelete(m)">
                    <i class="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
              <tr v-if="paginated.length === 0">
                <td colspan="7">
                  <div class="text-center text-muted py-5">
                    <i class="bi bi-search fs-3 d-block mb-2"></i>
                    No se encontraron mascotas con esos filtros.
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <TablePagination :page="page" :per-page="perPage" :total="total" @update:page="setPage" />
      </div>
    </div>

    <MascotaFormModal :open="modalOpen" :mascota="editing" @close="modalOpen = false" @saved="onSaved" />
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { usePacientesStore } from '@/stores/pacientes'
import { ESPECIES, especieVariant } from '@/data/catalogos'
import { edadDesde } from '@/utils/format'
import { usePagination } from '@/composables/usePagination'
import TablePagination from '@/components/ui/TablePagination.vue'
import SearchSelect from '@/components/ui/SearchSelect.vue'
import MascotaFormModal from '@/components/pacientes/MascotaFormModal.vue'
import { confirmDialog, toastError, toastSuccess } from '@/utils/alerts'

const store = usePacientesStore()
const router = useRouter()

const search = ref('')
const especieFiltro = ref('')
const duenoFiltro = ref('')

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  return store.mascotas.filter((m) => {
    const matchesSearch =
      !q ||
      m.nombre.toLowerCase().includes(q) ||
      (m.raza || '').toLowerCase().includes(q) ||
      store.duenoNombre(m.duenoId).toLowerCase().includes(q)
    const matchesEspecie = !especieFiltro.value || m.especie === especieFiltro.value
    const matchesDueno = !duenoFiltro.value || m.duenoId === duenoFiltro.value
    return matchesSearch && matchesEspecie && matchesDueno
  })
})

const { page, perPage, total, paginated, setPage } = usePagination(filtered, 8)

const especieOptions = [{ value: '', label: 'Todas las especies' }, ...ESPECIES.map((e) => ({ value: e, label: e }))]
const duenoOptions = computed(() => [
  { value: '', label: 'Todos los dueños' },
  ...store.duenos.map((d) => ({ value: d.id, label: `${d.nombres} ${d.apellidos}` })),
])

const modalOpen = ref(false)
const editing = ref(null)

function openCreate() {
  editing.value = null
  modalOpen.value = true
}
function openEdit(mascota) {
  editing.value = { ...mascota }
  modalOpen.value = true
}
function onSaved() {
  // El store ya persistio; aqui podriamos recargar desde la API en Fase 2.
}

async function onDelete(mascota) {
  const result = await confirmDialog({
    title: 'Eliminar mascota',
    text: `¿Seguro que deseas eliminar a "${mascota.nombre}"? Esta accion no se puede deshacer.`,
    confirmText: 'Si, eliminar',
    icon: 'warning',
  })
  if (result.isConfirmed) {
    try {
      await store.deleteMascota(mascota.id)
      toastSuccess('Mascota eliminada', `${mascota.nombre} fue eliminada del sistema.`)
    } catch (error) {
      toastError('No se pudo eliminar', error?.message || 'Intenta de nuevo.')
    }
  }
}

function inicial(nombre) {
  return (nombre || '?').charAt(0).toUpperCase()
}

function verHistoria(mascota) {
  router.push({ name: 'historia-clinica', query: { mascota: mascota.id } })
}

onMounted(() => {
  store.load().catch(() => {})
})
</script>
