<template>
  <div>
    <div class="page-head">
      <div>
        <h1 class="page-title">Consultas</h1>
        <p class="page-subtitle">{{ consultas.total }} consultas registradas</p>
      </div>
      <button class="btn btn-primary" type="button" @click="openCreate">
        <i class="bi bi-clipboard-plus me-2"></i>Nueva consulta
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
                placeholder="Buscar por mascota, dueño o diagnostico..."
              />
            </div>
          </div>
        </div>

        <!-- Tabla -->
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead>
              <tr class="text-muted small text-uppercase">
                <th scope="col">Fecha</th>
                <th scope="col">Mascota</th>
                <th scope="col">Motivo</th>
                <th scope="col">Diagnostico</th>
                <th scope="col" class="d-none d-xl-table-cell">Veterinario</th>
                <th scope="col" class="d-none d-lg-table-cell">Proxima cita</th>
                <th scope="col" class="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="c in paginated" :key="c.id">
                <td class="text-nowrap">{{ formatFecha(c.fecha) }}</td>
                <td>
                  <router-link
                    class="fw-semibold text-decoration-none"
                    :to="{ name: 'historia-clinica', query: { mascota: c.mascotaId } }"
                  >
                    {{ nombreMascota(c.mascotaId) }}
                  </router-link>
                  <small class="text-muted d-block">{{ duenoMascota(c.mascotaId) }}</small>
                </td>
                <td>{{ c.motivo }}</td>
                <td><span class="badge rounded-pill text-bg-light border">{{ c.diagnostico }}</span></td>
                <td class="d-none d-xl-table-cell text-muted">{{ c.veterinario }}</td>
                <td class="d-none d-lg-table-cell text-muted">{{ c.proximaCita ? formatFecha(c.proximaCita) : '—' }}</td>
                <td class="text-end text-nowrap">
                  <button class="btn btn-sm btn-light" type="button" title="Ver / editar" @click="openEdit(c)">
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button class="btn btn-sm btn-light text-danger" type="button" title="Eliminar" @click="onDelete(c)">
                    <i class="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
              <tr v-if="paginated.length === 0">
                <td colspan="7">
                  <div class="text-center text-muted py-5">
                    <i class="bi bi-clipboard2-pulse fs-3 d-block mb-2"></i>
                    No se encontraron consultas.
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <TablePagination :page="page" :per-page="perPage" :total="total" @update:page="setPage" />
      </div>
    </div>

    <ConsultaFormModal :open="modalOpen" :consulta="editing" @close="modalOpen = false" @saved="onSaved" />
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useConsultasStore } from '@/stores/consultas'
import { usePacientesStore } from '@/stores/pacientes'
import { formatFecha } from '@/utils/format'
import { usePagination } from '@/composables/usePagination'
import TablePagination from '@/components/ui/TablePagination.vue'
import ConsultaFormModal from '@/components/consultas/ConsultaFormModal.vue'
import { confirmDialog, toastError, toastSuccess } from '@/utils/alerts'

const consultas = useConsultasStore()
const pacientes = usePacientesStore()

const search = ref('')

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  return consultas.consultas
    .filter((c) => {
      const mascota = nombreMascota(c.mascotaId).toLowerCase()
      const dueno = duenoMascota(c.mascotaId).toLowerCase()
      return (
        !q ||
        mascota.includes(q) ||
        dueno.includes(q) ||
        (c.diagnostico || '').toLowerCase().includes(q) ||
        (c.motivo || '').toLowerCase().includes(q)
      )
    })
    .sort((a, b) => (a.fecha < b.fecha ? 1 : -1))
})

const { page, perPage, total, paginated, setPage } = usePagination(filtered, 8)

const modalOpen = ref(false)
const editing = ref(null)

function nombreMascota(id) {
  return pacientes.mascotas.find((m) => m.id === Number(id))?.nombre || 'Mascota'
}
function duenoMascota(id) {
  const mascota = pacientes.mascotas.find((m) => m.id === Number(id))
  return mascota ? pacientes.duenoNombre(mascota.duenoId) : 'Sin asignar'
}

function openCreate() {
  editing.value = null
  modalOpen.value = true
}
function openEdit(consulta) {
  editing.value = { ...consulta }
  modalOpen.value = true
}
function onSaved() {
  // El store ya persistio.
}

async function onDelete(consulta) {
  const result = await confirmDialog({
    title: 'Eliminar consulta',
    text: `¿Deseas eliminar la consulta de "${nombreMascota(consulta.mascotaId)}" del ${formatFecha(consulta.fecha)}?`,
    confirmText: 'Si, eliminar',
    icon: 'warning',
  })
  if (result.isConfirmed) {
    try {
      await consultas.remove(consulta.id)
      toastSuccess('Consulta eliminada', 'La consulta fue eliminada del sistema.')
    } catch (error) {
      toastError('No se pudo eliminar', error?.message || 'Intenta de nuevo.')
    }
  }
}

onMounted(() => {
  consultas.load().catch(() => {})
  pacientes.load().catch(() => {})
})
</script>
