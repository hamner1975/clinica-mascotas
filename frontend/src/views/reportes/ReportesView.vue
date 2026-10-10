<template>
  <div>
    <div class="page-head">
      <div>
        <h1 class="page-title">Reportes</h1>
        <p class="page-subtitle">Resumen general (datos acumulados)</p>
      </div>
      <button class="btn btn-outline-secondary" type="button" @click="onExport">
        <i class="bi bi-download me-2"></i>Exportar
      </button>
    </div>

    <!-- Indicadores -->
    <div class="row g-3 mb-3">
      <div class="col-6 col-xl-3">
        <StatCard label="Ingresos" :value="money(ventas.resumen.recaudado)" icon="bi-cash-coin" variant="success" />
      </div>
      <div class="col-6 col-xl-3">
        <StatCard label="Ventas / pedidos" :value="ventas.total" icon="bi-receipt" variant="primary" />
      </div>
      <div class="col-6 col-xl-3">
        <StatCard label="Consultas" :value="consultas.total" icon="bi-clipboard2-pulse" variant="info" />
      </div>
      <div class="col-6 col-xl-3">
        <StatCard label="Pacientes" :value="pacientes.totalMascotas" icon="bi-heart" variant="warning" />
      </div>
    </div>

    <div class="row g-3">
      <!-- Ingresos 7 dias -->
      <div class="col-12 col-lg-7">
        <div class="card h-100">
          <div class="card-body">
            <h2 class="card-title"><i class="bi bi-graph-up me-2 text-primary"></i>Ingresos ultimos 7 dias</h2>
            <div class="sales-chart mt-3">
              <div v-for="d in ultimos7" :key="d.fecha" class="sales-chart__col">
                <div class="sales-chart__track">
                  <div class="sales-chart__bar" :style="{ height: `${barra(d.total, maxDia)}%` }" :title="money(d.total)"></div>
                </div>
                <small class="sales-chart__label">{{ d.label }}</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Ventas por canal -->
      <div class="col-12 col-lg-5">
        <div class="card h-100">
          <div class="card-body">
            <h2 class="card-title"><i class="bi bi-shop me-2 text-primary"></i>Ventas por canal</h2>
            <ul class="list-unstyled mb-0 mt-2">
              <li v-for="c in porCanal" :key="c.canal" class="py-2">
                <div class="d-flex justify-content-between small mb-1">
                  <span>
                    <span class="badge rounded-pill me-1" :class="canalVariant(c.canal)">{{ c.canal }}</span>
                    {{ c.cantidad }} registro(s)
                  </span>
                  <strong>{{ money(c.total) }}</strong>
                </div>
                <div class="progress" style="height: 8px">
                  <div class="progress-bar" :style="{ width: `${barra(c.total, maxCanal)}%`, background: '#db0505' }"></div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Top productos -->
      <div class="col-12 col-lg-7">
        <div class="card h-100">
          <div class="card-body">
            <h2 class="card-title"><i class="bi bi-box-seam me-2 text-primary"></i>Productos mas vendidos</h2>
            <div class="table-responsive mt-2">
              <table class="table table-sm align-middle mb-0">
                <thead>
                  <tr class="text-muted small text-uppercase">
                    <th scope="col">Producto</th>
                    <th scope="col" class="text-center">Cantidad</th>
                    <th scope="col" class="text-end">Ingresos</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="p in topProductos" :key="p.nombre">
                    <td>{{ p.nombre }}</td>
                    <td class="text-center">{{ p.cantidad }}</td>
                    <td class="text-end fw-semibold">{{ money(p.total) }}</td>
                  </tr>
                  <tr v-if="topProductos.length === 0">
                    <td colspan="3" class="text-center text-muted py-3">Sin ventas registradas.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- Atenciones por veterinario -->
      <div class="col-12 col-lg-5">
        <div class="card h-100">
          <div class="card-body">
            <h2 class="card-title"><i class="bi bi-people me-2 text-primary"></i>Atenciones por veterinario</h2>
            <ul class="list-unstyled mb-0 mt-2">
              <li v-for="v in porVeterinario" :key="v.vet" class="py-2">
                <div class="d-flex justify-content-between small mb-1">
                  <span>{{ v.vet }}</span>
                  <strong>{{ v.count }}</strong>
                </div>
                <div class="progress" style="height: 8px">
                  <div class="progress-bar" :style="{ width: `${barra(v.count, maxVet)}%`, background: '#db0505' }"></div>
                </div>
              </li>
              <li v-if="porVeterinario.length === 0" class="text-muted small py-2">Sin consultas registradas.</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Inventario -->
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <h2 class="card-title"><i class="bi bi-clipboard2-data me-2 text-primary"></i>Estado del inventario</h2>
            <div class="row g-3 mt-1">
              <div class="col-6 col-md-3">
                <div class="border rounded p-3 text-center">
                  <div class="fs-4 fw-bold text-success">{{ inventario.saludable }}</div>
                  <small class="text-muted">Stock saludable</small>
                </div>
              </div>
              <div class="col-6 col-md-3">
                <div class="border rounded p-3 text-center">
                  <div class="fs-4 fw-bold text-warning">{{ inventario.bajo }}</div>
                  <small class="text-muted">Bajo stock</small>
                </div>
              </div>
              <div class="col-6 col-md-3">
                <div class="border rounded p-3 text-center">
                  <div class="fs-4 fw-bold text-danger">{{ inventario.agotado }}</div>
                  <small class="text-muted">Agotados</small>
                </div>
              </div>
              <div class="col-6 col-md-3">
                <div class="border rounded p-3 text-center">
                  <div class="fs-4 fw-bold">{{ money(inventario.valor) }}</div>
                  <small class="text-muted">Valor del inventario (costo)</small>
                </div>
              </div>
            </div>

            <hr class="my-3" />

            <p class="text-muted small text-uppercase fw-semibold mb-2">Citas por estado</p>
            <div class="d-flex flex-wrap gap-2">
              <span v-for="(valor, clave) in citas.resumen" :key="clave" class="badge rounded-pill" :class="estadoCitaVariant(clave)">
                {{ clave }}: {{ valor }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useVentasStore } from '@/stores/ventas'
import { useConsultasStore } from '@/stores/consultas'
import { useCitasStore } from '@/stores/citas'
import { usePacientesStore } from '@/stores/pacientes'
import { useProductosStore } from '@/stores/productos'
import { CANALES_VENTA, canalVariant, estadoCitaVariant } from '@/data/catalogos'
import { addDias, formatDiaMes, money, todayISO } from '@/utils/format'
import StatCard from '@/components/ui/StatCard.vue'
import { toastInfo } from '@/utils/alerts'

const ventas = useVentasStore()
const consultas = useConsultasStore()
const citas = useCitasStore()
const pacientes = usePacientesStore()
const productos = useProductosStore()

function barra(valor, max) {
  return Math.round((valor / (max || 1)) * 100)
}

const ultimos7 = computed(() => {
  const dias = []
  for (let i = 6; i >= 0; i -= 1) {
    const fecha = addDias(todayISO(), -i)
    const total = ventas.ventas
      .filter((v) => v.fecha === fecha && v.estado !== 'Cancelada')
      .reduce((sum, v) => sum + v.total, 0)
    dias.push({ fecha, label: formatDiaMes(fecha), total })
  }
  return dias
})
const maxDia = computed(() => Math.max(...ultimos7.value.map((d) => d.total), 1))

const porCanal = computed(() =>
  CANALES_VENTA.map((canal) => {
    const filtradas = ventas.ventas.filter((v) => v.canal === canal && v.estado !== 'Cancelada')
    return {
      canal,
      cantidad: ventas.ventas.filter((v) => v.canal === canal).length,
      total: filtradas.reduce((sum, v) => sum + v.total, 0),
    }
  }),
)
const maxCanal = computed(() => Math.max(...porCanal.value.map((c) => c.total), 1))

const topProductos = computed(() => {
  const mapa = new Map()
  ventas.ventas
    .filter((v) => v.estado !== 'Cancelada')
    .forEach((v) =>
      v.items.forEach((item) => {
        const actual = mapa.get(item.nombre) || { nombre: item.nombre, cantidad: 0, total: 0 }
        actual.cantidad += item.cantidad
        actual.total += item.precio * item.cantidad
        mapa.set(item.nombre, actual)
      }),
    )
  return [...mapa.values()].sort((a, b) => b.cantidad - a.cantidad).slice(0, 5)
})

const porVeterinario = computed(() => {
  const mapa = new Map()
  consultas.consultas.forEach((c) => mapa.set(c.veterinario, (mapa.get(c.veterinario) || 0) + 1))
  return [...mapa.entries()].map(([vet, count]) => ({ vet, count })).sort((a, b) => b.count - a.count)
})
const maxVet = computed(() => Math.max(...porVeterinario.value.map((v) => v.count), 1))

const inventario = computed(() => ({
  saludable: productos.productos.filter((p) => productos.estadoStock(p) === 'Ok').length,
  bajo: productos.bajoStock.length,
  agotado: productos.agotados.length,
  valor: productos.productos.reduce((sum, p) => sum + (p.costo || 0) * p.stock, 0),
}))

function onExport() {
  toastInfo('Exportar reporte', 'La exportacion a PDF/Excel se habilitara en la siguiente fase.')
}
</script>
