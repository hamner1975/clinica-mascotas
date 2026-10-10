<template>
  <div>
    <div class="page-head">
      <div>
        <h1 class="page-title">Configuracion</h1>
        <p class="page-subtitle">Datos de la clinica y preferencias del sistema</p>
      </div>
    </div>

    <div class="row g-3">
      <!-- Datos de la clinica -->
      <div class="col-12 col-lg-8">
        <div class="card">
          <div class="card-body">
            <h2 class="card-title mb-3"><i class="bi bi-buildings me-2 text-primary"></i>Datos de la clinica</h2>

            <form novalidate @submit.prevent="onSave">
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label" for="cfg-nombre">Nombre <span class="text-danger">*</span></label>
                  <input id="cfg-nombre" v-model="form.nombre" class="form-control" :class="invalid('nombre')" @blur="validateField('nombre')" />
                  <p v-if="showError('nombre')" class="text-danger small mt-1 mb-0">{{ errors.nombre }}</p>
                </div>

                <div class="col-md-6">
                  <label class="form-label" for="cfg-eslogan">Eslogan</label>
                  <input id="cfg-eslogan" v-model="form.eslogan" class="form-control" />
                </div>

                <div class="col-md-6">
                  <label class="form-label" for="cfg-doc">Documento / NIT</label>
                  <input id="cfg-doc" v-model="form.documento" class="form-control" />
                </div>

                <div class="col-md-6">
                  <label class="form-label" for="cfg-tel">Telefono</label>
                  <input id="cfg-tel" v-model="form.telefono" class="form-control" :class="invalid('telefono')" @blur="validateField('telefono')" />
                  <p v-if="showError('telefono')" class="text-danger small mt-1 mb-0">{{ errors.telefono }}</p>
                </div>

                <div class="col-md-6">
                  <label class="form-label" for="cfg-email">Correo electronico</label>
                  <input id="cfg-email" v-model="form.email" type="email" class="form-control" :class="invalid('email')" @blur="validateField('email')" />
                  <p v-if="showError('email')" class="text-danger small mt-1 mb-0">{{ errors.email }}</p>
                </div>

                <div class="col-md-6">
                  <label class="form-label" for="cfg-dir">Direccion</label>
                  <input id="cfg-dir" v-model="form.direccion" class="form-control" />
                </div>
              </div>

              <h3 class="h6 mt-4 mb-3"><i class="bi bi-sliders me-2 text-primary"></i>Preferencias</h3>
              <div class="row g-3">
                <div class="col-md-3">
                  <label class="form-label" for="cfg-moneda">Moneda</label>
                  <SearchSelect id="cfg-moneda" v-model="form.moneda" :options="monedaOptions" icon="bi-currency-exchange" :clearable="false" placeholder="Moneda" />
                </div>
                <div class="col-md-3">
                  <label class="form-label" for="cfg-apertura">Hora apertura</label>
                  <input id="cfg-apertura" v-model="form.horaApertura" type="time" class="form-control" />
                </div>
                <div class="col-md-3">
                  <label class="form-label" for="cfg-cierre">Hora cierre</label>
                  <input id="cfg-cierre" v-model="form.horaCierre" type="time" class="form-control" />
                </div>
                <div class="col-md-3">
                  <label class="form-label" for="cfg-duracion">Duracion cita (min)</label>
                  <input id="cfg-duracion" v-model="form.duracionCita" type="number" min="5" step="5" class="form-control" :class="invalid('duracionCita')" @blur="validateField('duracionCita')" />
                  <p v-if="showError('duracionCita')" class="text-danger small mt-1 mb-0">{{ errors.duracionCita }}</p>
                </div>
                <div class="col-md-3">
                  <label class="form-label" for="cfg-iva">IVA (%)</label>
                  <input id="cfg-iva" v-model="form.iva" type="number" min="0" max="100" class="form-control" :class="invalid('iva')" @blur="validateField('iva')" />
                  <p v-if="showError('iva')" class="text-danger small mt-1 mb-0">{{ errors.iva }}</p>
                </div>
              </div>

              <div class="mt-4">
                <button class="btn btn-primary" type="submit">
                  <i class="bi bi-check2 me-1"></i>Guardar configuracion
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Respaldo y acerca de -->
      <div class="col-12 col-lg-4">
        <div class="card mb-3">
          <div class="card-body">
            <h2 class="card-title mb-2"><i class="bi bi-download me-2 text-primary"></i>Respaldo de datos</h2>
            <p class="text-muted small">
              Los datos de la Fase 1 se guardan en este navegador. Puedes exportarlos, importarlos o restaurar los de ejemplo.
            </p>

            <div class="d-grid gap-2">
              <button class="btn btn-outline-secondary" type="button" @click="exportarDatos">
                <i class="bi bi-file-earmark-arrow-down me-2"></i>Exportar respaldo (JSON)
              </button>

              <label class="btn btn-outline-secondary mb-0">
                <i class="bi bi-file-earmark-arrow-up me-2"></i>Importar respaldo
                <input ref="archivoInput" type="file" accept="application/json,.json" class="d-none" @change="importarDatos" />
              </label>

              <button class="btn btn-outline-danger" type="button" @click="restaurarEjemplo">
                <i class="bi bi-arrow-counterclockwise me-2"></i>Restaurar datos de ejemplo
              </button>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-body">
            <h2 class="card-title mb-2"><i class="bi bi-info-circle me-2 text-primary"></i>Acerca de</h2>
            <dl class="row mb-0 small">
              <dt class="col-5 text-muted fw-normal">Sistema</dt>
              <dd class="col-7">Clinica Mascotas</dd>
              <dt class="col-5 text-muted fw-normal">Version</dt>
              <dd class="col-7">0.1.0</dd>
              <dt class="col-5 text-muted fw-normal">Fase</dt>
              <dd class="col-7">1 - Diseno</dd>
              <dt class="col-5 text-muted fw-normal">Tecnologia</dt>
              <dd class="col-7">Vue 3 + Vite</dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useConfigStore } from '@/stores/config'
import { MONEDAS } from '@/data/catalogos'
import SearchSelect from '@/components/ui/SearchSelect.vue'
import { useForm } from '@/composables/useForm'
import { todayISO } from '@/utils/format'
import { confirmDialog, notifyValidation, toastError, toastSuccess } from '@/utils/alerts'

const store = useConfigStore()
const archivoInput = ref(null)

const monedaOptions = MONEDAS.map((m) => ({ value: m, label: m }))

const { form, errors, touched, validate, validateField, firstError, reset } = useForm(
  { ...store.config },
  {
    nombre: { label: 'Nombre', required: true, min: 3 },
    email: { label: 'Correo electronico', email: true },
    telefono: { label: 'Telefono', phone: true },
    duracionCita: { label: 'Duracion cita', number: true, minValue: 5 },
    iva: { label: 'IVA', number: true, minValue: 0, maxValue: 100 },
  },
)

function invalid(field) {
  return { 'is-invalid': touched[field] && errors[field] }
}
function showError(field) {
  return touched[field] && errors[field]
}

function onSave() {
  if (!validate()) {
    notifyValidation(firstError())
    return
  }
  store.save({ ...form, duracionCita: Number(form.duracionCita), iva: Number(form.iva) })
  toastSuccess('Configuracion guardada', 'Los cambios se aplicaron correctamente.')
}

function exportarDatos() {
  const data = {}
  Object.keys(localStorage)
    .filter((key) => key.startsWith('cm_'))
    .forEach((key) => {
      data[key] = localStorage.getItem(key)
    })
  const payload = { app: 'Clinica Mascotas', version: '0.1.0', fecha: new Date().toISOString(), data }
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const enlace = document.createElement('a')
  enlace.href = url
  enlace.download = `clinica-mascotas-respaldo-${todayISO()}.json`
  enlace.click()
  URL.revokeObjectURL(url)
  toastSuccess('Respaldo generado', 'Se descargo el archivo JSON con todos los datos.')
}

function importarDatos(event) {
  const archivo = event.target.files?.[0]
  if (!archivo) return
  const reader = new FileReader()
  reader.onload = () => {
    try {
      const payload = JSON.parse(reader.result)
      const data = payload.data || payload
      Object.entries(data).forEach(([key, value]) => localStorage.setItem(key, value))
      toastSuccess('Respaldo restaurado', 'Los datos se cargaron correctamente. Recargando...')
      setTimeout(() => location.reload(), 900)
    } catch {
      toastError('Archivo invalido', 'El archivo no tiene el formato esperado.')
    } finally {
      if (archivoInput.value) archivoInput.value.value = ''
    }
  }
  reader.readAsText(archivo)
}

async function restaurarEjemplo() {
  const result = await confirmDialog({
    title: 'Restaurar datos de ejemplo',
    text: 'Se borraran todos los datos actuales de este navegador y se volveran a cargar los de ejemplo. ¿Continuar?',
    confirmText: 'Si, restaurar',
    icon: 'warning',
  })
  if (!result.isConfirmed) return
  Object.keys(localStorage)
    .filter((key) => key.startsWith('cm_'))
    .forEach((key) => localStorage.removeItem(key))
  location.reload()
}
</script>
