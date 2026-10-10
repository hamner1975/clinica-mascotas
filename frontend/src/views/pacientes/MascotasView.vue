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
            <select v-model="especieFiltro" class="form-select">
              <option value="">Todas las especies</option>
              <option v-for="e in ESPECIES" :key="e" :value="e">{{ e }}</option>
            </select>
          </div>
          <div class="col-6 col-md-3">
            <select v-model="duenoFiltro" class="form-select">
              <option value="">Todos los dueños</option>
              <option v-for="d in store.duenos" :key="d.id" :value="d.id">
                {{ d.nombres }} {{ d.apellidos }}
              </option>
            </select>
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
                    <span class="avatar avatar--sm">{{ inicial(m.nombre) }}</span>
                    <div>
                      <div class="fw-semibold">{{ m.nombre }}</div>
                      <small class="text-muted">{{ m.raza || 'Sin raza' }}</small>
                    </div>
                  </div>
                </td>
                <td><span class="badge rounded-pill" :class="especieVariant(m.especie)">{{ m.especie }}</span></td>
                <td>{{ m.sexo || '&mdash;' }}</td>
                <td>{{ edad(m.fechaNacimiento) }}</td>
                <td>{{ m.peso != null ? `${m.peso} kg` : '—' }}</td>
                <td>{{ store.duenoNombre(m.duenoId) }}</td>
                <td class="text-end text-nowrap">
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
import { computed, ref } from 'vue'
import { usePacientesStore } from '@/stores/pacientes'
import { ESPECIES, especieVariant } from '@/data/catalogos'
import { usePagination } from '@/composables/usePagination'
import TablePagination from '@/components/ui/TablePagination.vue'
import MascotaFormModal from '@/components/pacientes/MascotaFormModal.vue'
import { confirmDialog, toastSuccess } from '@/utils/alerts'

const store = usePacientesStore()

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
    store.deleteMascota(mascota.id)
    toastSuccess('Mascota eliminada', `${mascota.nombre} fue eliminada del sistema.`)
  }
}

function inicial(nombre) {
  return (nombre || '?').charAt(0).toUpperCase()
}

function edad(fecha) {
  if (!fecha) return '—'
  const nacimiento = new Date(fecha)
  const hoy = new Date()
  let years = hoy.getFullYear() - nacimiento.getFullYear()
  const meses = hoy.getMonth() - nacimiento.getMonth()
  if (meses < 0 || (meses === 0 && hoy.getDate() < nacimiento.getDate())) years -= 1

  if (years < 1) {
    const diff = Math.max(0, Math.round((hoy - nacimiento) / (1000 * 60 * 60 * 24 * 30.44)))
    return `${diff} ${diff === 1 ? 'mes' : 'meses'}`
  }
  return `${years} ${years === 1 ? 'año' : 'años'}`
}
</script>
