<template>
  <BaseModal
    :open="open"
    :title="isEdit ? 'Editar cita' : 'Nueva cita'"
    icon="bi-calendar2-week"
    size="lg"
    @close="$emit('close')"
  >
    <form id="cita-form" novalidate @submit.prevent="onSubmit">
      <div class="row g-3">
        <div class="col-md-6">
          <label class="form-label" for="c-mascota">Mascota <span class="text-danger">*</span></label>
          <SearchSelect
            id="c-mascota"
            v-model="form.mascotaId"
            :options="mascotaOptions"
            icon="bi-heart"
            placeholder="Buscar por nombre o dueno..."
            :invalid="!!(touched.mascotaId && errors.mascotaId)"
            @blur="validateField('mascotaId')"
          />
          <p v-if="showError('mascotaId')" class="text-danger small mt-1 mb-0">{{ errors.mascotaId }}</p>
        </div>

        <div class="col-md-6">
          <label class="form-label" for="c-vet">Veterinario <span class="text-danger">*</span></label>
          <SearchSelect
            id="c-vet"
            v-model="form.veterinario"
            :options="veterinarioOptions"
            icon="bi-person-badge"
            placeholder="Buscar veterinario..."
            :invalid="!!(touched.veterinario && errors.veterinario)"
            @blur="validateField('veterinario')"
          />
          <p v-if="showError('veterinario')" class="text-danger small mt-1 mb-0">{{ errors.veterinario }}</p>
        </div>

        <div class="col-md-4">
          <label class="form-label" for="c-fecha">Fecha <span class="text-danger">*</span></label>
          <input
            id="c-fecha"
            v-model="form.fecha"
            type="date"
            class="form-control"
            :class="invalid('fecha')"
            @blur="validateField('fecha')"
          />
          <p v-if="showError('fecha')" class="text-danger small mt-1 mb-0">{{ errors.fecha }}</p>
        </div>

        <div class="col-md-4">
          <label class="form-label" for="c-hora">Hora <span class="text-danger">*</span></label>
          <input
            id="c-hora"
            v-model="form.hora"
            type="time"
            class="form-control"
            :class="invalid('hora')"
            @blur="validateField('hora')"
          />
          <p v-if="showError('hora')" class="text-danger small mt-1 mb-0">{{ errors.hora }}</p>
        </div>

        <div class="col-md-4">
          <label class="form-label" for="c-estado">Estado</label>
          <select id="c-estado" v-model="form.estado" class="form-select">
            <option v-for="e in ESTADOS_CITA" :key="e" :value="e">{{ e }}</option>
          </select>
        </div>

        <div class="col-12">
          <label class="form-label" for="c-motivo">Motivo <span class="text-danger">*</span></label>
          <input
            id="c-motivo"
            v-model="form.motivo"
            class="form-control"
            :class="invalid('motivo')"
            placeholder="Ej: Vacunacion anual"
            @blur="validateField('motivo')"
          />
          <p v-if="showError('motivo')" class="text-danger small mt-1 mb-0">{{ errors.motivo }}</p>
        </div>

        <div class="col-12">
          <label class="form-label" for="c-notas">Notas</label>
          <textarea id="c-notas" v-model="form.notas" class="form-control" rows="2" placeholder="Observaciones..."></textarea>
        </div>
      </div>
    </form>

    <template #footer>
      <button class="btn btn-light" type="button" @click="$emit('close')">Cancelar</button>
      <button class="btn btn-primary" type="submit" form="cita-form">
        <i class="bi bi-check2 me-1"></i>{{ isEdit ? 'Guardar cambios' : 'Agendar cita' }}
      </button>
    </template>
  </BaseModal>
</template>

<script setup>
import { computed, watch } from 'vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import SearchSelect from '@/components/ui/SearchSelect.vue'
import { useCitasStore } from '@/stores/citas'
import { usePacientesStore } from '@/stores/pacientes'
import { useForm } from '@/composables/useForm'
import { ESTADOS_CITA, VETERINARIOS } from '@/data/catalogos'
import { todayISO, nowHora } from '@/utils/format'
import { notifyValidation, toastSuccess } from '@/utils/alerts'

const props = defineProps({
  open: { type: Boolean, default: false },
  cita: { type: Object, default: null },
})

const emit = defineEmits(['close', 'saved'])

const citas = useCitasStore()
const pacientes = usePacientesStore()

const mascotaOptions = computed(() =>
  pacientes.mascotas.map((m) => ({ value: m.id, label: m.nombre, sublabel: pacientes.duenoNombre(m.duenoId) })),
)
const veterinarioOptions = computed(() => VETERINARIOS.map((v) => ({ value: v, label: v })))

function emptyForm() {
  return {
    mascotaId: '',
    fecha: todayISO(),
    hora: nowHora(),
    veterinario: '',
    estado: 'Pendiente',
    motivo: '',
    notas: '',
  }
}

const { form, errors, touched, validate, validateField, firstError, reset } = useForm(emptyForm(), {
  mascotaId: { label: 'Mascota', required: true },
  veterinario: { label: 'Veterinario', required: true },
  fecha: { label: 'Fecha', required: true },
  hora: { label: 'Hora', required: true },
  motivo: { label: 'Motivo', required: true, min: 3 },
})

const isEdit = computed(() => !!props.cita?.id)

function invalid(field) {
  return { 'is-invalid': touched[field] && errors[field] }
}
function showError(field) {
  return touched[field] && errors[field]
}

watch(
  () => props.open,
  (open) => {
    if (open) reset(props.cita ? { ...emptyForm(), ...props.cita } : emptyForm())
  },
)

function onSubmit() {
  if (!validate()) {
    notifyValidation(firstError())
    return
  }
  citas.save({ ...form, mascotaId: Number(form.mascotaId) })
  toastSuccess(isEdit.value ? 'Cita actualizada' : 'Cita agendada', 'La cita se guardo correctamente.')
  emit('saved')
  emit('close')
}
</script>
