<template>
  <div>
    <div class="page-head">
      <div>
        <h1 class="page-title">Dueños / Tutores</h1>
        <p class="page-subtitle">{{ store.totalDuenos }} dueños registrados</p>
      </div>
      <button class="btn btn-primary" type="button" @click="openCreate">
        <i class="bi bi-plus-lg me-2"></i>Nuevo dueño
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
                placeholder="Buscar por nombre, documento o correo..."
              />
            </div>
          </div>
        </div>

        <!-- Tabla -->
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead>
              <tr class="text-muted small text-uppercase">
                <th scope="col">Dueño / Tutor</th>
                <th scope="col">Contacto</th>
                <th scope="col" class="d-none d-lg-table-cell">Direccion</th>
                <th scope="col" class="text-center">Mascotas</th>
                <th scope="col" class="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="d in paginated" :key="d.id">
                <td>
                  <div class="d-flex align-items-center gap-2">
                    <span class="avatar avatar--sm">{{ iniciales(d) }}</span>
                    <div>
                      <div class="fw-semibold">{{ d.nombres }} {{ d.apellidos }}</div>
                      <small class="text-muted">{{ d.documento || 'Sin documento' }}</small>
                    </div>
                  </div>
                </td>
                <td>
                  <div class="small">
                    <i class="bi bi-telephone me-1 text-muted"></i>{{ d.telefono || '—' }}
                  </div>
                  <div class="small text-muted">
                    <i class="bi bi-envelope me-1"></i>{{ d.email || 'Sin correo' }}
                  </div>
                </td>
                <td class="d-none d-lg-table-cell text-muted small">{{ d.direccion || '—' }}</td>
                <td class="text-center">
                  <span class="badge rounded-pill text-bg-light border">
                    {{ store.mascotasByDueno(d.id).length }}
                  </span>
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
                <td colspan="5">
                  <div class="text-center text-muted py-5">
                    <i class="bi bi-search fs-3 d-block mb-2"></i>
                    No se encontraron dueños con esos criterios.
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <TablePagination :page="page" :per-page="perPage" :total="total" @update:page="setPage" />
      </div>
    </div>

    <DuenoFormModal :open="modalOpen" :dueno="editing" @close="modalOpen = false" @saved="onSaved" />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { usePacientesStore } from '@/stores/pacientes'
import { usePagination } from '@/composables/usePagination'
import TablePagination from '@/components/ui/TablePagination.vue'
import DuenoFormModal from '@/components/pacientes/DuenoFormModal.vue'
import { confirmDialog, toastSuccess, toastWarning } from '@/utils/alerts'

const store = usePacientesStore()

const search = ref('')

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return store.duenos
  return store.duenos.filter((d) => {
    const full = `${d.nombres} ${d.apellidos}`.toLowerCase()
    return (
      full.includes(q) ||
      (d.documento || '').toLowerCase().includes(q) ||
      (d.email || '').toLowerCase().includes(q) ||
      (d.telefono || '').toLowerCase().includes(q)
    )
  })
})

const { page, perPage, total, paginated, setPage } = usePagination(filtered, 8)

const modalOpen = ref(false)
const editing = ref(null)

function openCreate() {
  editing.value = null
  modalOpen.value = true
}
function openEdit(dueno) {
  editing.value = { ...dueno }
  modalOpen.value = true
}
function onSaved() {
  // El store ya persistio.
}

async function onDelete(dueno) {
  const count = store.mascotasByDueno(dueno.id).length
  if (count > 0) {
    toastWarning(
      'No se puede eliminar',
      `${dueno.nombres} tiene ${count} mascota(s) registrada(s). Reasigna o elimina esas mascotas primero.`,
    )
    return
  }

  const result = await confirmDialog({
    title: 'Eliminar dueño',
    text: `¿Seguro que deseas eliminar a ${dueno.nombres} ${dueno.apellidos}? Esta accion no se puede deshacer.`,
    confirmText: 'Si, eliminar',
    icon: 'warning',
  })
  if (result.isConfirmed) {
    store.deleteDueno(dueno.id)
    toastSuccess('Dueño eliminado', `${dueno.nombres} ${dueno.apellidos} fue eliminado del sistema.`)
  }
}

function iniciales(dueno) {
  const a = (dueno.nombres || '').charAt(0)
  const b = (dueno.apellidos || '').charAt(0)
  return `${a}${b}`.toUpperCase() || 'DT'
}
</script>
