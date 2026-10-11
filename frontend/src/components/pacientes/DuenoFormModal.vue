<template>
  <BaseModal
    :open="open"
    :title="isEdit ? 'Editar dueño / tutor' : 'Nuevo dueño / tutor'"
    icon="bi-people"
    size="lg"
    @close="$emit('close')"
  >
    <form id="dueno-form" novalidate @submit.prevent="onSubmit">
      <div class="row g-3">
        <div class="col-md-6">
          <label class="form-label" for="d-nombres">Nombres <span class="text-danger">*</span></label>
          <input
            id="d-nombres"
            v-model="form.nombres"
            class="form-control"
            :class="invalid('nombres')"
            placeholder="Ej: Maria"
            @blur="validateField('nombres')"
          />
          <p v-if="showError('nombres')" class="text-danger small mt-1 mb-0">{{ errors.nombres }}</p>
        </div>

        <div class="col-md-6">
          <label class="form-label" for="d-apellidos">Apellidos <span class="text-danger">*</span></label>
          <input
            id="d-apellidos"
            v-model="form.apellidos"
            class="form-control"
            :class="invalid('apellidos')"
            placeholder="Ej: Gomez Ruiz"
            @blur="validateField('apellidos')"
          />
          <p v-if="showError('apellidos')" class="text-danger small mt-1 mb-0">{{ errors.apellidos }}</p>
        </div>

        <div class="col-md-6">
          <label class="form-label" for="d-documento">Documento / DNI</label>
          <input
            id="d-documento"
            v-model="form.documento"
            class="form-control"
            :class="invalid('documento')"
            placeholder="Ej: 10234567"
            @blur="validateField('documento')"
          />
          <p v-if="showError('documento')" class="text-danger small mt-1 mb-0">{{ errors.documento }}</p>
        </div>

        <div class="col-md-6">
          <label class="form-label" for="d-telefono">Telefono <span class="text-danger">*</span></label>
          <input
            id="d-telefono"
            v-model="form.telefono"
            class="form-control"
            :class="invalid('telefono')"
            placeholder="Ej: +57 300 123 4567"
            @blur="validateField('telefono')"
          />
          <p v-if="showError('telefono')" class="text-danger small mt-1 mb-0">{{ errors.telefono }}</p>
        </div>

        <div class="col-md-6">
          <label class="form-label" for="d-email">Correo electronico</label>
          <input
            id="d-email"
            v-model="form.email"
            type="email"
            class="form-control"
            :class="invalid('email')"
            placeholder="Ej: correo@dominio.com"
            @blur="validateField('email')"
          />
          <p v-if="showError('email')" class="text-danger small mt-1 mb-0">{{ errors.email }}</p>
        </div>

        <div class="col-md-6">
          <label class="form-label" for="d-direccion">Direccion</label>
          <input id="d-direccion" v-model="form.direccion" class="form-control" placeholder="Ej: Calle 45 #12-30" />
        </div>

        <div class="col-12">
          <label class="form-label" for="d-notas">Notas</label>
          <textarea id="d-notas" v-model="form.notas" class="form-control" rows="2" placeholder="Observaciones..."></textarea>
        </div>
      </div>
    </form>

    <template #footer>
      <button class="btn btn-light" type="button" @click="$emit('close')">Cancelar</button>
      <button class="btn btn-primary" type="submit" form="dueno-form">
        <i class="bi bi-check2 me-1"></i>{{ isEdit ? 'Guardar cambios' : 'Registrar dueño' }}
      </button>
    </template>
  </BaseModal>
</template>

<script setup>
import { computed, watch } from 'vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import { usePacientesStore } from '@/stores/pacientes'
import { useForm } from '@/composables/useForm'
import { notifyValidation, toastError, toastSuccess } from '@/utils/alerts'

const props = defineProps({
  open: { type: Boolean, default: false },
  dueno: { type: Object, default: null },
})

const emit = defineEmits(['close', 'saved'])

const store = usePacientesStore()

const EMPTY = {
  nombres: '',
  apellidos: '',
  documento: '',
  telefono: '',
  email: '',
  direccion: '',
  notas: '',
}

const { form, errors, touched, validate, validateField, firstError, reset } = useForm(
  { ...EMPTY },
  {
    nombres: { label: 'Nombres', required: true, min: 2 },
    apellidos: { label: 'Apellidos', required: true, min: 2 },
    telefono: { label: 'Telefono', required: true, phone: true },
    email: { label: 'Correo electronico', email: true },
    documento: { label: 'Documento', min: 4 },
  },
)

const isEdit = computed(() => !!props.dueno?.id)

function invalid(field) {
  return { 'is-invalid': touched[field] && errors[field] }
}
function showError(field) {
  return touched[field] && errors[field]
}

watch(
  () => props.open,
  (open) => {
    if (open) reset(props.dueno ? { ...EMPTY, ...props.dueno } : { ...EMPTY })
  },
)

async function onSubmit() {
  if (!validate()) {
    notifyValidation(firstError())
    return
  }
  try {
    await store.saveDueno({ ...form })
    toastSuccess(
      isEdit.value ? 'Dueño actualizado' : 'Dueño registrado',
      `${form.nombres} ${form.apellidos} se guardo correctamente.`,
    )
    emit('saved')
    emit('close')
  } catch (error) {
    toastError('No se pudo guardar', error?.message || 'Intenta de nuevo.')
  }
}
</script>
