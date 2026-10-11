<template>
  <div>
    <div class="page-head">
      <div>
        <h1 class="page-title">Dashboard</h1>
        <p class="page-subtitle">Resumen general de la clinica &middot; {{ today }}</p>
      </div>
      <div class="d-flex gap-2">
        <button class="btn btn-outline-secondary" type="button" @click="onExport">
          <i class="bi bi-download me-2"></i>Exportar
        </button>
        <button class="btn btn-primary" type="button" @click="onNewAppointment">
          <i class="bi bi-calendar-plus me-2"></i>Nueva cita
        </button>
      </div>
    </div>

    <!-- Tarjetas de estadisticas -->
    <div class="row g-3 mb-3">
      <div v-for="stat in stats" :key="stat.label" class="col-12 col-sm-6 col-xl-3">
        <StatCard v-bind="stat" />
      </div>
    </div>

    <div class="row g-3">
      <!-- Proximas citas -->
      <div class="col-12 col-xl-8">
        <div class="card h-100">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h2 class="card-title mb-0"><i class="bi bi-calendar2-week me-2 text-primary"></i>Proximas citas</h2>
              <router-link :to="{ name: 'citas' }" class="small text-decoration-none">Ver todas</router-link>
            </div>
            <div class="table-responsive">
              <table class="table align-middle mb-0">
                <thead>
                  <tr class="text-muted small text-uppercase">
                    <th scope="col">Hora</th>
                    <th scope="col">Paciente</th>
                    <th scope="col">Dueno</th>
                    <th scope="col">Motivo</th>
                    <th scope="col" class="text-end">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="appt in appointments" :key="appt.hour">
                    <td class="fw-semibold">{{ appt.hour }}</td>
                    <td>
                      <i class="bi bi-heart text-primary me-2"></i>{{ appt.patient }}
                      <small class="text-muted d-block ms-4">{{ appt.species }}</small>
                    </td>
                    <td>{{ appt.owner }}</td>
                    <td class="text-muted">{{ appt.reason }}</td>
                    <td class="text-end">
                      <span class="badge rounded-pill" :class="statusClass(appt.status)">{{ appt.status }}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- Ventas de la semana + bajo stock -->
      <div class="col-12 col-xl-4">
        <div class="card mb-3">
          <div class="card-body">
            <h2 class="card-title mb-3"><i class="bi bi-graph-up-arrow me-2 text-primary"></i>Ventas (7 dias)</h2>
            <div class="sales-chart">
              <div v-for="day in sales" :key="day.label" class="sales-chart__col">
                <div class="sales-chart__track">
                  <div
                    class="sales-chart__bar"
                    :style="{ height: day.value + '%' }"
                    :title="'$' + day.total"
                  ></div>
                </div>
                <small class="sales-chart__label">{{ day.label }}</small>
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-body">
            <h2 class="card-title mb-3"><i class="bi bi-exclamation-triangle me-2 text-warning"></i>Bajo stock</h2>
            <ul class="list-unstyled mb-0">
              <li v-for="item in lowStock" :key="item.name" class="d-flex justify-content-between align-items-center py-2 border-bottom">
                <span>
                  <i class="bi bi-capsule me-2 text-muted"></i>{{ item.name }}
                </span>
                <span class="badge" :class="item.qty <= 3 ? 'bg-danger' : 'bg-warning text-dark'">{{ item.qty }} u.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import StatCard from '@/components/ui/StatCard.vue'
import { toastInfo, toastSuccess } from '@/utils/alerts'

const today = new Date().toLocaleDateString('es-ES', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

// Datos de ejemplo (FASE 2: vendran de la API PHP/MySQL)
const stats = [
  { label: 'Citas hoy', value: 18, icon: 'bi-calendar2-week', variant: 'primary', trend: 12 },
  { label: 'Pacientes activos', value: '1.284', icon: 'bi-heart', variant: 'info', trend: 6 },
  { label: 'Ventas del mes', value: '$4.820', icon: 'bi-cart-check', variant: 'success', trend: 9 },
  { label: 'Bajo stock', value: 7, icon: 'bi-box-seam', variant: 'warning', trend: -4 },
]

const appointments = [
  { hour: '09:00', patient: 'Luna', species: 'Perra - Golden Retriever', owner: 'Maria Gomez', reason: 'Vacunacion anual', status: 'Confirmada' },
  { hour: '09:30', patient: 'Michi', species: 'Gato - Comun europeo', owner: 'Jose Perez', reason: 'Control post-operatorio', status: 'En sala' },
  { hour: '10:15', patient: 'Rocky', species: 'Perro - Bulldog', owner: 'Ana Torres', reason: 'Revisacion general', status: 'Pendiente' },
  { hour: '11:00', patient: 'Nube', species: 'Gata - Siames', owner: 'Luis Diaz', reason: 'Desparasitacion', status: 'Pendiente' },
]

const sales = [
  { label: 'Lun', value: 45, total: 320 },
  { label: 'Mar', value: 62, total: 460 },
  { label: 'Mie', value: 38, total: 280 },
  { label: 'Jue', value: 80, total: 610 },
  { label: 'Vie', value: 70, total: 540 },
  { label: 'Sab', value: 95, total: 720 },
  { label: 'Dom', value: 30, total: 210 },
]

const lowStock = [
  { name: 'Amoxicilina 500mg', qty: 2 },
  { name: 'Antipulgas (pipeta)', qty: 5 },
  { name: 'Suero fisiologico', qty: 8 },
  { name: 'Vacuna antirrabica', qty: 3 },
]

function statusClass(status) {
  if (status === 'Confirmada') return 'text-bg-success'
  if (status === 'En sala') return 'text-bg-primary'
  return 'text-bg-secondary'
}

function onNewAppointment() {
  toastInfo('Nueva cita', 'El formulario de citas se habilitara en la siguiente fase.')
}
function onExport() {
  toastSuccess('Exportacion', 'La exportacion de reportes se habilitara en la siguiente fase.')
}
</script>
