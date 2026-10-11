<template>
  <BaseModal
    :open="open"
    :title="isEdit ? 'Editar mascota' : 'Nueva mascota'"
    icon="bi-heart"
    size="lg"
    @close="$emit('close')"
  >
    <form id="mascota-form" novalidate @submit.prevent="onSubmit">
      <div class="row g-3">
        <div class="col-12">
          <label class="form-label">Foto</label>
          <ImageInput v-model="form.foto" shape="circle" placeholder-icon="bi-heart" />
        </div>

        <div class="col-md-6">
          <label class="form-label" for="m-nombre">Nombre <span class="text-danger">*</span></label>
          <input
            id="m-nombre"
            v-model="form.nombre"
            class="form-control"
            :class="invalid('nombre')"
            placeholder="Ej: Luna"
            @blur="validateField('nombre')"
          />
          <p v-if="showError('nombre')" class="text-danger small mt-1 mb-0">{{ errors.nombre }}</p>
        </div>

        <div class="col-md-6">
          <label class="form-label" for="m-especie">Especie <span class="text-danger">*</span></label>
          <SearchSelect
            id="m-especie"
            v-model="form.especie"
            :options="especieOptions"
            icon="bi-heart"
            placeholder="Especie"
            :invalid="!!(touched.especie && errors.especie)"
            @blur="validateField('especie')"
          />
          <p v-if="showError('especie')" class="text-danger small mt-1 mb-0">{{ errors.especie }}</p>
        </div>

        <div class="col-md-6">
          <label class="form-label" for="m-raza">Raza</label>
          <input id="m-raza" v-model="form.raza" class="form-control" placeholder="Ej: Golden Retriever" />
        </div>

        <div class="col-md-6">
          <label class="form-label" for="m-sexo">Sexo</label>
          <SearchSelect id="m-sexo" v-model="form.sexo" :options="sexoOptions" icon="" :clearable="false" placeholder="Sexo" />
        </div>

        <div class="col-md-6">
          <label class="form-label" for="m-fecha">Fecha de nacimiento</label>
          <input
            id="m-fecha"
            v-model="form.fechaNacimiento"
            type="date"
            class="form-control"
            :class="invalid('fechaNacimiento')"
            @blur="validateField('fechaNacimiento')"
          />
          <p v-if="showError('fechaNacimiento')" class="text-danger small mt-1 mb-0">{{ errors.fechaNacimiento }}</p>
        </div>

        <div class="col-md-6">
          <label class="form-label" for="m-peso">Peso (kg)</label>
          <input
            id="m-peso"
            v-model="form.peso"
            type="number"
            step="0.1"
            min="0"
            class="form-control"
            :class="invalid('peso')"
            placeholder="Ej: 12.5"
            @blur="validateField('peso')"
          />
          <p v-if="showError('peso')" class="text-danger small mt-1 mb-0">{{ errors.peso }}</p>
        </div>

        <div class="col-md-6">
          <label class="form-label" for="m-color">Color</label>
          <input id="m-color" v-model="form.color" class="form-control" placeholder="Ej: Dorado" />
        </div>

        <div class="col-md-6">
          <label class="form-label" for="m-dueno">Dueño / Tutor <span class="text-danger">*</span></label>
          <SearchSelect
            id="m-dueno"
            v-model="form.duenoId"
            :options="duenoOptions"
            icon="bi-people"
            placeholder="Buscar dueno..."
            :invalid="!!(touched.duenoId && errors.duenoId)"
            @blur="validateField('duenoId')"
          />
          <p v-if="showError('duenoId')" class="text-danger small mt-1 mb-0">{{ errors.duenoId }}</p>
        </div>

        <div class="col-12">
          <div class="form-check form-switch">
            <input id="m-esterilizado" v-model="form.esterilizado" class="form-check-input" type="checkbox" />
            <label class="form-check-label" for="m-esterilizado">Esterilizado / castrado</label>
          </div>
        </div>

        <div class="col-12">
          <label class="form-label" for="m-notas">Notas</label>
          <textarea id="m-notas" v-model="form.notas" class="form-control" rows="2" placeholder="Alergias, observaciones..."></textarea>
        </div>
      </div>
    </form>

    <template #footer>
      <button class="btn btn-light" type="button" @click="$emit('close')">Cancelar</button>
      <button class="btn btn-primary" type="submit" form="mascota-form">
        <i class="bi bi-check2 me-1"></i>{{ isEdit ? 'Guardar cambios' : 'Registrar mascota' }}
      </button>
    </template>
  </BaseModal>
</template>

<script setup>
import { computed, watch } from 'vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import SearchSelect from '@/components/ui/SearchSelect.vue'
import ImageInput from '@/components/ui/ImageInput.vue'
import { usePacientesStore } from '@/stores/pacientes'
import { useForm } from '@/composables/useForm'
import { ESPECIES, SEXOS } from '@/data/catalogos'
import { notifyValidation, toastError, toastSuccess } from '@/utils/alerts'

const props = defineProps({
  open: { type: Boolean, default: false },
  mascota: { type: Object, default: null },
})

const emit = defineEmits(['close', 'saved'])

const store = usePacientesStore()

const duenoOptions = computed(() =>
  store.duenos.map((d) => ({ value: d.id, label: `${d.nombres} ${d.apellidos}`, sublabel: d.documento || '' })),
)

const especieOptions = [
  { value: '', label: 'Selecciona una especie' },
  ...ESPECIES.map((e) => ({ value: e, label: e })),
]
const sexoOptions = [
  { value: '', label: 'Sin especificar' },
  ...SEXOS.map((s) => ({ value: s, label: s })),
]

const EMPTY = {
  foto: '',
  nombre: '',
  especie: '',
  raza: '',
  sexo: '',
  fechaNacimiento: '',
  peso: '',
  color: '',
  duenoId: '',
  esterilizado: false,
  notas: '',
}

const today = new Date().toISOString().slice(0, 10)

const { form, errors, touched, validate, validateField, firstError, reset } = useForm(
  { ...EMPTY },
  {
    nombre: { label: 'Nombre', required: true, min: 2 },
    especie: { label: 'Especie', required: true },
    duenoId: { label: 'Dueño', required: true },
    peso: { label: 'Peso (kg)', number: true, minValue: 0 },
    fechaNacimiento: {
      label: 'Fecha de nacimiento',
      custom: (value) => (value && value > today ? 'La fecha de nacimiento no puede ser futura.' : ''),
    },
  },
)

const isEdit = computed(() => !!props.mascota?.id)

function invalid(field) {
  return { 'is-invalid': touched[field] && errors[field] }
}
function showError(field) {
  return touched[field] && errors[field]
}

watch(
  () => props.open,
  (open) => {
    if (open) reset(props.mascota ? { ...EMPTY, ...props.mascota } : { ...EMPTY })
  },
)

async function onSubmit() {
  if (!validate()) {
    notifyValidation(firstError())
    return
  }
  try {
    await store.saveMascota({
      ...form,
      duenoId: Number(form.duenoId),
      peso: form.peso === '' ? null : Number(form.peso),
    })
    toastSuccess(
      isEdit.value ? 'Mascota actualizada' : 'Mascota registrada',
      `${form.nombre} se guardo correctamente.`,
    )
    emit('saved')
    emit('close')
  } catch (error) {
    toastError('No se pudo guardar', error?.message || 'Intenta de nuevo.')
  }
}
</script>
