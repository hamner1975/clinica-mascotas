<template>
  <div>
    <div class="page-head">
      <div>
        <h1 class="page-title">Historia clinica</h1>
        <p class="page-subtitle">Expediente veterinario por mascota</p>
      </div>
    </div>

    <div class="row g-3">
      <!-- Lista de mascotas -->
      <div class="col-12 col-lg-4">
        <div class="card h-100">
          <div class="card-body">
            <div class="position-relative mb-3">
              <i class="bi bi-search search-icon"></i>
              <input v-model="search" class="form-control ps-5" placeholder="Buscar mascota o dueño..." />
            </div>

            <ul class="list-unstyled mb-0 hc-list">
              <li v-for="m in mascotasFiltradas" :key="m.id">
                <button
                  class="hc-item"
                  :class="{ 'is-active': m.id === selectedId }"
                  type="button"
                  @click="select(m.id)"
                >
                  <span class="avatar avatar--sm">{{ inicial(m.nombre) }}</span>
                  <span class="flex-grow-1 overflow-hidden">
                    <span class="d-block fw-semibold">{{ m.nombre }}</span>
                    <small class="text-muted d-block text-truncate">
                      {{ m.especie }} &middot; {{ pacientes.duenoNombre(m.duenoId) }}
                    </small>
                  </span>
                  <i class="bi bi-chevron-right"></i>
                </button>
              </li>
              <li v-if="mascotasFiltradas.length === 0" class="text-center text-muted py-4">
                <i class="bi bi-search fs-4 d-block mb-2"></i>Sin resultados
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Expediente -->
      <div class="col-12 col-lg-8">
        <template v-if="mascota">
          <!-- Cabecera -->
          <div class="card mb-3">
            <div class="card-body">
              <div class="d-flex flex-wrap justify-content-between gap-3">
                <div class="d-flex gap-3">
                  <span class="avatar avatar--lg">{{ inicial(mascota.nombre) }}</span>
                  <div>
                    <h2 class="h4 mb-1">{{ mascota.nombre }}</h2>
                    <p class="text-muted mb-2">
                      <span class="badge rounded-pill" :class="especieVariant(mascota.especie)">{{ mascota.especie }}</span>
                      <span class="ms-1">
                        {{ mascota.raza || 'Sin raza' }} &middot; {{ mascota.sexo || 'Sin especificar' }} &middot;
                        {{ edadDesde(mascota.fechaNacimiento) }}
                      </span>
                    </p>
                    <p class="mb-0 small text-muted">
                      <i class="bi bi-person me-1"></i>{{ pacientes.duenoNombre(mascota.duenoId) }}
                      <span class="mx-2">&middot;</span>
                      <i class="bi bi-telephone me-1"></i>{{ dueno?.telefono || '—' }}
                    </p>
                  </div>
                </div>
                <div class="d-flex gap-2 align-items-start">
                  <button class="btn btn-outline-secondary" type="button" @click="editModalOpen = true">
                    <i class="bi bi-pencil me-1"></i>Editar
                  </button>
                  <button class="btn btn-primary" type="button" @click="consultaModalOpen = true">
                    <i class="bi bi-clipboard2-pulse me-1"></i>Nueva consulta
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Pestanas -->
          <ul class="nav nav-pills hc-tabs mb-3">
            <li class="nav-item">
              <button class="nav-link" :class="{ active: tab === 'resumen' }" type="button" @click="tab = 'resumen'">Resumen</button>
            </li>
            <li class="nav-item">
              <button class="nav-link" :class="{ active: tab === 'consultas' }" type="button" @click="tab = 'consultas'">
                Consultas <span class="badge text-bg-light ms-1">{{ consultasMascota.length }}</span>
              </button>
            </li>
            <li class="nav-item">
              <button class="nav-link" :class="{ active: tab === 'evolucion' }" type="button" @click="tab = 'evolucion'">Evolucion</button>
            </li>
          </ul>

          <!-- Resumen -->
          <div v-if="tab === 'resumen'">
            <div class="row g-3 mb-3">
              <div class="col-6 col-xl-3">
                <StatCard label="Consultas" :value="consultasMascota.length" icon="bi-clipboard2-pulse" variant="primary" />
              </div>
              <div class="col-6 col-xl-3">
                <StatCard label="Peso actual" :value="pesoActual != null ? `${pesoActual} kg` : '—'" icon="bi-speedometer2" variant="info" />
              </div>
              <div class="col-6 col-xl-3">
                <StatCard label="Ultima consulta" :value="ultima ? formatFecha(ultima.fecha) : '—'" icon="bi-clock-history" variant="success" />
              </div>
              <div class="col-6 col-xl-3">
                <StatCard label="Proxima cita" :value="proximaCita ? formatFecha(proximaCita) : '—'" icon="bi-calendar2-week" variant="warning" />
              </div>
            </div>

            <div class="row g-3">
              <div class="col-12 col-md-6">
                <div class="card h-100">
                  <div class="card-body">
                    <h3 class="card-title"><i class="bi bi-heart-pulse me-2 text-primary"></i>Datos de la mascota</h3>
                    <dl class="row mb-0 small">
                      <dt class="col-5 text-muted fw-normal">Color</dt>
                      <dd class="col-7">{{ mascota.color || '—' }}</dd>
                      <dt class="col-5 text-muted fw-normal">Peso registrado</dt>
                      <dd class="col-7">{{ mascota.peso != null ? `${mascota.peso} kg` : '—' }}</dd>
                      <dt class="col-5 text-muted fw-normal">Esterilizado</dt>
                      <dd class="col-7">{{ mascota.esterilizado ? 'Si' : 'No' }}</dd>
                      <dt class="col-5 text-muted fw-normal">Notas</dt>
                      <dd class="col-7">{{ mascota.notas || '—' }}</dd>
                    </dl>
                  </div>
                </div>
              </div>

              <div class="col-12 col-md-6">
                <div class="card h-100">
                  <div class="card-body">
                    <h3 class="card-title"><i class="bi bi-clipboard2-data me-2 text-primary"></i>Diagnosticos recientes</h3>
                    <ul class="list-unstyled mb-0">
                      <li v-for="c in ultimasConsultas" :key="c.id" class="py-2 border-bottom">
                        <div class="d-flex justify-content-between gap-2">
                          <span class="fw-semibold small">{{ c.diagnostico }}</span>
                          <small class="text-muted text-nowrap">{{ formatFecha(c.fecha) }}</small>
                        </div>
                        <small class="text-muted">{{ c.motivo }}</small>
                      </li>
                      <li v-if="ultimasConsultas.length === 0" class="text-muted small py-2">Sin consultas registradas.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Consultas (linea de tiempo) -->
          <div v-else-if="tab === 'consultas'">
            <div class="card">
              <div class="card-body">
                <div v-if="consultasMascota.length === 0" class="text-center text-muted py-5">
                  <i class="bi bi-clipboard2-pulse fs-3 d-block mb-2"></i>
                  Esta mascota aun no tiene consultas registradas.
                </div>

                <div v-else>
                  <article v-for="c in consultasMascota" :key="c.id" class="hc-entry">
                    <span class="hc-entry__dot"></span>
                    <div class="d-flex flex-wrap justify-content-between gap-2">
                      <div>
                        <span class="fw-semibold">{{ formatFecha(c.fecha) }}</span>
                        <span class="text-muted small ms-2">{{ c.hora }}</span>
                      </div>
                      <span class="badge rounded-pill text-bg-light border">{{ c.diagnostico }}</span>
                    </div>
                    <p class="mb-2 mt-1 small"><strong>Motivo:</strong> {{ c.motivo }}</p>
                    <div class="row g-2 small mb-2">
                      <div class="col-6 col-md-3"><i class="bi bi-thermometer-half text-muted me-1"></i>{{ c.temperatura != null ? `${c.temperatura} °C` : '—' }}</div>
                      <div class="col-6 col-md-3"><i class="bi bi-speedometer2 text-muted me-1"></i>{{ c.peso != null ? `${c.peso} kg` : '—' }}</div>
                      <div class="col-6 col-md-3"><i class="bi bi-activity text-muted me-1"></i>{{ c.frecuenciaCardiaca != null ? `${c.frecuenciaCardiaca} lpm` : '—' }}</div>
                      <div class="col-6 col-md-3"><i class="bi bi-person text-muted me-1"></i>{{ c.veterinario }}</div>
                    </div>
                    <p v-if="c.tratamiento" class="mb-1 small"><strong>Tratamiento:</strong> {{ c.tratamiento }}</p>
                    <p v-if="c.observaciones" class="mb-1 small text-muted">{{ c.observaciones }}</p>
                    <p v-if="c.proximaCita" class="mb-0 small">
                      <i class="bi bi-calendar-check me-1 text-primary"></i>Proxima cita: {{ formatFecha(c.proximaCita) }}
                    </p>
                  </article>
                </div>
              </div>
            </div>
          </div>

          <!-- Evolucion -->
          <div v-else>
            <div class="card">
              <div class="card-body">
                <h3 class="card-title"><i class="bi bi-graph-up me-2 text-primary"></i>Evolucion del peso</h3>
                <div v-if="pesoSerie.length">
                  <div class="sales-chart">
                    <div v-for="(p, i) in pesoSerie" :key="i" class="sales-chart__col">
                      <div class="sales-chart__track">
                        <div class="sales-chart__bar" :style="{ height: `${barHeight(p.peso)}%` }" :title="`${p.peso} kg`"></div>
                      </div>
                      <small class="sales-chart__label">{{ p.label }}</small>
                    </div>
                  </div>
                  <p class="text-muted small mt-3 mb-0">Peso registrado en cada consulta (kg).</p>
                </div>
                <p v-else class="text-muted mb-0">Aun no hay registros de peso en las consultas.</p>
              </div>
            </div>
          </div>
        </template>

        <!-- Sin seleccion -->
        <div v-else class="card h-100">
          <div class="card-body d-flex flex-column align-items-center justify-content-center text-center py-5">
            <span class="coming-icon"><i class="bi bi-journal-medical"></i></span>
            <h2 class="h5 mt-3 mb-2">Selecciona una mascota</h2>
            <p class="text-muted mb-0">Elige una mascota de la lista para ver su historia clinica.</p>
          </div>
        </div>
      </div>
    </div>

    <MascotaFormModal :open="editModalOpen" :mascota="mascota" @close="editModalOpen = false" @saved="editModalOpen = false" />
    <ConsultaFormModal
      :open="consultaModalOpen"
      :mascota-id="mascota ? mascota.id : ''"
      @close="consultaModalOpen = false"
      @saved="consultaModalOpen = false"
    />
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePacientesStore } from '@/stores/pacientes'
import { useConsultasStore } from '@/stores/consultas'
import { useCitasStore } from '@/stores/citas'
import { especieVariant } from '@/data/catalogos'
import { edadDesde, formatDiaMes, formatFecha, todayISO } from '@/utils/format'
import StatCard from '@/components/ui/StatCard.vue'
import MascotaFormModal from '@/components/pacientes/MascotaFormModal.vue'
import ConsultaFormModal from '@/components/consultas/ConsultaFormModal.vue'

const route = useRoute()
const router = useRouter()
const pacientes = usePacientesStore()
const consultasStore = useConsultasStore()
const citasStore = useCitasStore()

const search = ref('')
const tab = ref('resumen')
const editModalOpen = ref(false)
const consultaModalOpen = ref(false)

// El id de la mascota viaja en la URL: /historia-clinica?mascota=3
const selectedId = computed(() => {
  const id = Number(route.query.mascota)
  return pacientes.mascotas.some((m) => m.id === id) ? id : null
})

const mascota = computed(() => pacientes.mascotas.find((m) => m.id === selectedId.value) || null)
const dueno = computed(() => (mascota.value ? pacientes.duenoById(mascota.value.duenoId) : null))

const mascotasFiltradas = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return pacientes.mascotas
  return pacientes.mascotas.filter(
    (m) => m.nombre.toLowerCase().includes(q) || pacientes.duenoNombre(m.duenoId).toLowerCase().includes(q),
  )
})

const consultasMascota = computed(() => (mascota.value ? consultasStore.byMascota(mascota.value.id) : []))
const ultimasConsultas = computed(() => consultasMascota.value.slice(0, 4))
const ultima = computed(() => consultasMascota.value[0] || null)

const pesoActual = computed(() => {
  const conPeso = consultasMascota.value.find((c) => c.peso != null)
  return conPeso ? conPeso.peso : (mascota.value?.peso ?? null)
})

const proximaCita = computed(() => {
  if (!mascota.value) return ''
  const futura = citasStore.citas
    .filter((c) => c.mascotaId === mascota.value.id && c.fecha >= todayISO() && c.estado !== 'Cancelada')
    .sort((a, b) => (a.fecha < b.fecha ? -1 : 1))[0]
  return futura ? futura.fecha : ''
})

const pesoSerie = computed(() =>
  consultasMascota.value
    .filter((c) => c.peso != null)
    .slice()
    .sort((a, b) => (a.fecha < b.fecha ? -1 : 1))
    .map((c) => ({ label: formatDiaMes(c.fecha), peso: Number(c.peso) })),
)

function barHeight(peso) {
  const max = Math.max(...pesoSerie.value.map((p) => p.peso), 1)
  return Math.round((peso / max) * 100)
}

function select(id) {
  router.replace({ query: { ...route.query, mascota: id } })
}
function inicial(nombre) {
  return (nombre || '?').charAt(0).toUpperCase()
}

// Al cambiar de mascota volvemos a la pestana "Resumen".
watch(selectedId, () => {
  tab.value = 'resumen'
})
</script>
