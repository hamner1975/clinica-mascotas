<template>
  <div>
    <div class="page-head">
      <div>
        <h1 class="page-title">Citas</h1>
        <p class="page-subtitle">{{ citas.total }} citas registradas &middot; {{ citas.citasHoy.length }} hoy</p>
      </div>
      <button class="btn btn-primary" type="button" @click="openCreate">
        <i class="bi bi-calendar-plus me-2"></i>Nueva cita
      </button>
    </div>

    <!-- Resumen por estado -->
    <div class="row g-3 mb-3">
      <div class="col-6 col-xl-3">
        <StatCard label="Citas hoy" :value="citas.citasHoy.length" icon="bi-calendar2-week" variant="primary" />
      </div>
      <div class="col-6 col-xl-3">
        <StatCard label="Pendientes" :value="citas.resumen.Pendiente" icon="bi-clock-history" variant="warning" />
      </div>
      <div class="col-6 col-xl-3">
        <StatCard label="En sala" :value="citas.resumen['En sala']" icon="bi-clipboard2-pulse" variant="info" />
      </div>
      <div class="col-6 col-xl-3">
        <StatCard label="Atendidas" :value="citas.resumen.Atendida" icon="bi-check2-circle" variant="success" />
      </div>
    </div>

    <div class="card">
      <div class="card-body">
        <!-- Filtros -->
        <div class="row g-2 mb-3">
          <div class="col-12 col-md-5">
            <div class="position-relative">
              <i class="bi bi-search search-icon"></i>
              <input v-model="search" class="form-control ps-5" placeholder="Buscar por mascota, dueño o motivo..." />
            </div>
          </div>
          <div class="col-6 col-md-3">
            <select v-model="estadoFiltro" class="form-select">
              <option value="">Todos los estados</option>
              <option v-for="e in ESTADOS_CITA" :key="e" :value="e">{{ e }}</option>
            </select>
          </div>
          <div class="col-6 col-md-4">
            <input v-model="fechaFiltro" type="date" class="form-control" />
          </div>
        </div>

        <!-- Tabla -->
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead>
              <tr class="text-muted small text-uppercase">
                <th scope="col">Fecha</th>
                <th scope="col">Hora</th>
                <th scope="col">Mascota</th>
                <th scope="col">Motivo</th>
                <th scope="col" class="d-none d-xl-table-cell">Veterinario</th>
                <th scope="col">Estado</th>
                <th scope="col" class="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="c in paginated" :key="c.id">
                <td class="text-nowrap">
                  <span :class="{ 'fw-semibold text-primary': isToday(c.fecha) }">{{ formatFechaCorta(c.fecha) }}</span>
                </td>
                <td class="text-nowrap">{{ c.hora }}</td>
                <td>
                  <div class="fw-semibold">{{ nombreMascota(c.mascotaId) }}</div>
                  <small class="text-muted">{{ duenoMascota(c.mascotaId) }}</small>
                </td>
                <td>{{ c.motivo }}</td>
                <td class="d-none d-xl-table-cell text-muted">{{ c.veterinario }}</td>
                <td><span class="badge rounded-pill" :class="estadoCitaVariant(c.estado)">{{ c.estado }}</span></td>
                <td class="text-end text-nowrap">
                  <button
                    v-if="c.estado !== 'Atendida' && c.estado !== 'Cancelada'"
                    class="btn btn-sm btn-light text-primary"
                    type="button"
                    title="Atender"
                    @click="openAtender(c)"
                  >
                    <i class="bi bi-clipboard2-pulse"></i>
                  </button>
                  <button class="btn btn-sm btn-light" type="button" title="Editar" @click="openEdit(c)">
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
                    <i class="bi bi-calendar2-week fs-3 d-block mb-2"></i>
                    No hay citas que coincidan con los filtros.
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <TablePagination :page="page" :per-page="perPage" :total="total" @update:page="setPage" />
      </div>
    </div>

    <CitaFormModal :open="modalOpen" :cita="editing" @close="modalOpen = false" @saved="onSaved" />
    <ConsultaFormModal
      :open="consultaModalOpen"
      :cita="attending"
      @close="closeConsulta"
      @saved="onConsultaSaved"
    />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useCitasStore } from '@/stores/citas'
import { usePacientesStore } from '@/stores/pacientes'
import { ESTADOS_CITA, estadoCitaVariant } from '@/data/catalogos'
import { formatFechaCorta, isToday } from '@/utils/format'
import { usePagination } from '@/composables/usePagination'
import TablePagination from '@/components/ui/TablePagination.vue'
import StatCard from '@/components/ui/StatCard.vue'
import CitaFormModal from '@/components/citas/CitaFormModal.vue'
import ConsultaFormModal from '@/components/consultas/ConsultaFormModal.vue'
import { confirmDialog, toastSuccess } from '@/utils/alerts'

const citas = useCitasStore()
const pacientes = usePacientesStore()

const search = ref('')
const estadoFiltro = ref('')
const fechaFiltro = ref('')

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  return citas.citas
    .filter((cita) => {
      const mascota = nombreMascota(cita.mascotaId).toLowerCase()
      const dueno = duenoMascota(cita.mascotaId).toLowerCase()
      const matchesSearch =
        !q || mascota.includes(q) || dueno.includes(q) || (cita.motivo || '').toLowerCase().includes(q)
      const matchesEstado = !estadoFiltro.value || cita.estado === estadoFiltro.value
      const matchesFecha = !fechaFiltro.value || cita.fecha === fechaFiltro.value
      return matchesSearch && matchesEstado && matchesFecha
    })
    .sort((a, b) => (a.fecha === b.fecha ? a.hora.localeCompare(b.hora) : a.fecha < b.fecha ? -1 : 1))
})

const { page, perPage, total, paginated, setPage } = usePagination(filtered, 8)

const modalOpen = ref(false)
const editing = ref(null)
const consultaModalOpen = ref(false)
const attending = ref(null)

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
function openEdit(cita) {
  editing.value = { ...cita }
  modalOpen.value = true
}
function onSaved() {
  // El store ya persistio.
}

function openAtender(cita) {
  attending.value = { ...cita }
  consultaModalOpen.value = true
}
function closeConsulta() {
  consultaModalOpen.value = false
  attending.value = null
}
function onConsultaSaved() {
  // Marca la cita como atendida tras registrar la consulta.
  if (attending.value) {
    citas.setEstado(attending.value.id, 'Atendida')
  }
}

async function onDelete(cita) {
  const result = await confirmDialog({
    title: 'Cancelar / eliminar cita',
    text: `¿Deseas eliminar la cita de "${nombreMascota(cita.mascotaId)}" a las ${cita.hora}?`,
    confirmText: 'Si, eliminar',
    icon: 'warning',
  })
  if (result.isConfirmed) {
    citas.remove(cita.id)
    toastSuccess('Cita eliminada', 'La cita fue eliminada del sistema.')
  }
}
</script>
