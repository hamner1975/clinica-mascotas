<template>
  <BaseModal
    :open="open"
    :title="isEdit ? 'Editar consulta' : 'Nueva consulta'"
    icon="bi-clipboard2-pulse"
    size="xl"
    @close="$emit('close')"
  >
    <p v-if="cita" class="alert alert-light border d-flex align-items-center gap-2 py-2">
      <i class="bi bi-info-circle text-primary"></i>
      Consulta generada desde una cita. Al guardar, la cita se marcara como <strong>Atendida</strong>.
    </p>

    <form id="consulta-form" novalidate @submit.prevent="onSubmit">
      <div class="row g-3">
        <div class="col-md-6">
          <label class="form-label" for="co-mascota">Mascota <span class="text-danger">*</span></label>
          <select
            id="co-mascota"
            v-model="form.mascotaId"
            class="form-select"
            :class="invalid('mascotaId')"
            @blur="validateField('mascotaId')"
          >
            <option value="">Selecciona una mascota</option>
            <option v-for="m in pacientes.mascotas" :key="m.id" :value="m.id">
              {{ m.nombre }} — {{ pacientes.duenoNombre(m.duenoId) }}
            </option>
          </select>
          <p v-if="showError('mascotaId')" class="text-danger small mt-1 mb-0">{{ errors.mascotaId }}</p>
        </div>

        <div class="col-md-6">
          <label class="form-label" for="co-vet">Veterinario <span class="text-danger">*</span></label>
          <select
            id="co-vet"
            v-model="form.veterinario"
            class="form-select"
            :class="invalid('veterinario')"
            @blur="validateField('veterinario')"
          >
            <option value="">Selecciona un veterinario</option>
            <option v-for="v in VETERINARIOS" :key="v" :value="v">{{ v }}</option>
          </select>
          <p v-if="showError('veterinario')" class="text-danger small mt-1 mb-0">{{ errors.veterinario }}</p>
        </div>

        <div class="col-md-6">
          <label class="form-label" for="co-fecha">Fecha <span class="text-danger">*</span></label>
          <input
            id="co-fecha"
            v-model="form.fecha"
            type="date"
            class="form-control"
            :class="invalid('fecha')"
            @blur="validateField('fecha')"
          />
          <p v-if="showError('fecha')" class="text-danger small mt-1 mb-0">{{ errors.fecha }}</p>
        </div>

        <div class="col-md-6">
          <label class="form-label" for="co-hora">Hora</label>
          <input id="co-hora" v-model="form.hora" type="time" class="form-control" />
        </div>

        <div class="col-12">
          <label class="form-label" for="co-motivo">Motivo de consulta <span class="text-danger">*</span></label>
          <input
            id="co-motivo"
            v-model="form.motivo"
            class="form-control"
            :class="invalid('motivo')"
            placeholder="Ej: Cojera en la pata trasera"
            @blur="validateField('motivo')"
          />
          <p v-if="showError('motivo')" class="text-danger small mt-1 mb-0">{{ errors.motivo }}</p>
        </div>

        <!-- Signos vitales -->
        <div class="col-12">
          <p class="text-muted small text-uppercase fw-semibold mb-0 mt-2">
            <i class="bi bi-activity me-1"></i>Signos vitales
          </p>
          <hr class="mt-1 mb-0" />
        </div>

        <div class="col-md-4">
          <label class="form-label" for="co-temp">Temperatura (°C)</label>
          <input
            id="co-temp"
            v-model="form.temperatura"
            type="number"
            step="0.1"
            class="form-control"
            :class="invalid('temperatura')"
            placeholder="Ej: 38.5"
            @blur="validateField('temperatura')"
          />
          <p v-if="showError('temperatura')" class="text-danger small mt-1 mb-0">{{ errors.temperatura }}</p>
        </div>

        <div class="col-md-4">
          <label class="form-label" for="co-peso">Peso (kg)</label>
          <input
            id="co-peso"
            v-model="form.peso"
            type="number"
            step="0.1"
            class="form-control"
            :class="invalid('peso')"
            placeholder="Ej: 12.5"
            @blur="validateField('peso')"
          />
          <p v-if="showError('peso')" class="text-danger small mt-1 mb-0">{{ errors.peso }}</p>
        </div>

        <div class="col-md-4">
          <label class="form-label" for="co-fc">Frec. cardiaca (lpm)</label>
          <input
            id="co-fc"
            v-model="form.frecuenciaCardiaca"
            type="number"
            class="form-control"
            :class="invalid('frecuenciaCardiaca')"
            placeholder="Ej: 90"
            @blur="validateField('frecuenciaCardiaca')"
          />
          <p v-if="showError('frecuenciaCardiaca')" class="text-danger small mt-1 mb-0">{{ errors.frecuenciaCardiaca }}</p>
        </div>

        <!-- Diagnostico y tratamiento -->
        <div class="col-12">
          <p class="text-muted small text-uppercase fw-semibold mb-0 mt-2">
            <i class="bi bi-heart-pulse me-1"></i>Diagnostico y tratamiento
          </p>
          <hr class="mt-1 mb-0" />
        </div>

        <div class="col-12">
          <label class="form-label" for="co-diag">Diagnostico <span class="text-danger">*</span></label>
          <input
            id="co-diag"
            v-model="form.diagnostico"
            class="form-control"
            :class="invalid('diagnostico')"
            placeholder="Ej: Dermatitis alergica"
            @blur="validateField('diagnostico')"
          />
          <p v-if="showError('diagnostico')" class="text-danger small mt-1 mb-0">{{ errors.diagnostico }}</p>
        </div>

        <div class="col-12">
          <label class="form-label" for="co-trat">Tratamiento</label>
          <textarea
            id="co-trat"
            v-model="form.tratamiento"
            class="form-control"
            rows="2"
            placeholder="Medicamentos, dosis, indicaciones..."
          ></textarea>
        </div>

        <div class="col-md-6">
          <label class="form-label" for="co-obs">Observaciones</label>
          <textarea id="co-obs" v-model="form.observaciones" class="form-control" rows="2"></textarea>
        </div>

        <div class="col-md-6">
          <label class="form-label" for="co-prox">Proxima cita sugerida</label>
          <input id="co-prox" v-model="form.proximaCita" type="date" class="form-control" />
        </div>
      </div>
    </form>

    <template #footer>
      <button class="btn btn-light" type="button" @click="$emit('close')">Cancelar</button>
      <button class="btn btn-primary" type="submit" form="consulta-form">
        <i class="bi bi-check2 me-1"></i>{{ isEdit ? 'Guardar cambios' : 'Registrar consulta' }}
      </button>
    </template>
  </BaseModal>
</template>

<script setup>
import { computed, watch } from 'vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import { useConsultasStore } from '@/stores/consultas'
import { usePacientesStore } from '@/stores/pacientes'
import { useForm } from '@/composables/useForm'
import { VETERINARIOS } from '@/data/catalogos'
import { todayISO, nowHora } from '@/utils/format'
import { notifyValidation, toastSuccess } from '@/utils/alerts'

const props = defineProps({
  open: { type: Boolean, default: false },
  consulta: { type: Object, default: null },
  cita: { type: Object, default: null },
})

const emit = defineEmits(['close', 'saved'])

const consultas = useConsultasStore()
const pacientes = usePacientesStore()

function emptyForm() {
  return {
    citaId: null,
    mascotaId: '',
    fecha: todayISO(),
    hora: nowHora(),
    motivo: '',
    temperatura: '',
    peso: '',
    frecuenciaCardiaca: '',
    diagnostico: '',
    tratamiento: '',
    observaciones: '',
    veterinario: '',
    proximaCita: '',
  }
}

const { form, errors, touched, validate, validateField, firstError, reset } = useForm(emptyForm(), {
  mascotaId: { label: 'Mascota', required: true },
  veterinario: { label: 'Veterinario', required: true },
  fecha: { label: 'Fecha', required: true },
  motivo: { label: 'Motivo de consulta', required: true, min: 3 },
  diagnostico: { label: 'Diagnostico', required: true, min: 3 },
  temperatura: { label: 'Temperatura', number: true, minValue: 0 },
  peso: { label: 'Peso', number: true, minValue: 0 },
  frecuenciaCardiaca: { label: 'Frecuencia cardiaca', number: true, minValue: 0 },
})

const isEdit = computed(() => !!props.consulta?.id)

function invalid(field) {
  return { 'is-invalid': touched[field] && errors[field] }
}
function showError(field) {
  return touched[field] && errors[field]
}

watch(
  () => props.open,
  (open) => {
    if (!open) return
    if (props.consulta) {
      reset({ ...emptyForm(), ...props.consulta })
    } else if (props.cita) {
      // Precarga desde la cita ("Atender").
      reset({
        ...emptyForm(),
        citaId: props.cita.id,
        mascotaId: props.cita.mascotaId,
        fecha: props.cita.fecha,
        hora: props.cita.hora,
        motivo: props.cita.motivo,
        veterinario: props.cita.veterinario,
      })
    } else {
      reset(emptyForm())
    }
  },
)

function num(value) {
  return value === '' || value === null ? null : Number(value)
}

function onSubmit() {
  if (!validate()) {
    notifyValidation(firstError())
    return
  }
  consultas.save({
    ...form,
    mascotaId: Number(form.mascotaId),
    temperatura: num(form.temperatura),
    peso: num(form.peso),
    frecuenciaCardiaca: num(form.frecuenciaCardiaca),
  })
  toastSuccess(isEdit.value ? 'Consulta actualizada' : 'Consulta registrada', 'La consulta se guardo correctamente.')
  emit('saved')
  emit('close')
}
</script>
