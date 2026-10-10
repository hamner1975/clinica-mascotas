<template>
  <BaseModal
    :open="open"
    :title="isEdit ? 'Editar diagnostico' : 'Nuevo diagnostico'"
    icon="bi-heart-pulse"
    size="lg"
    @close="$emit('close')"
  >
    <form id="diagnostico-form" novalidate @submit.prevent="onSubmit">
      <div class="row g-3">
        <div class="col-md-4">
          <label class="form-label" for="dg-codigo">Codigo <span class="text-danger">*</span></label>
          <input id="dg-codigo" v-model="form.codigo" class="form-control" :class="invalid('codigo')" placeholder="Ej: DX-013" @blur="validateField('codigo')" />
          <p v-if="showError('codigo')" class="text-danger small mt-1 mb-0">{{ errors.codigo }}</p>
        </div>

        <div class="col-md-8">
          <label class="form-label" for="dg-nombre">Nombre <span class="text-danger">*</span></label>
          <input id="dg-nombre" v-model="form.nombre" class="form-control" :class="invalid('nombre')" placeholder="Ej: Dermatitis alergica" @blur="validateField('nombre')" />
          <p v-if="showError('nombre')" class="text-danger small mt-1 mb-0">{{ errors.nombre }}</p>
        </div>

        <div class="col-md-6">
          <label class="form-label" for="dg-categoria">Categoria <span class="text-danger">*</span></label>
          <SearchSelect
            id="dg-categoria"
            v-model="form.categoria"
            :options="categoriaOptions"
            icon="bi-tags"
            placeholder="Categoria"
            :invalid="!!(touched.categoria && errors.categoria)"
            @blur="validateField('categoria')"
          />
          <p v-if="showError('categoria')" class="text-danger small mt-1 mb-0">{{ errors.categoria }}</p>
        </div>

        <div class="col-md-6">
          <label class="form-label" for="dg-especie">Especie afectada</label>
          <SearchSelect id="dg-especie" v-model="form.especie" :options="especieOptions" icon="bi-heart" :clearable="false" placeholder="Especie" />
        </div>

        <div class="col-12">
          <label class="form-label" for="dg-desc">Descripcion</label>
          <textarea id="dg-desc" v-model="form.descripcion" class="form-control" rows="2" placeholder="Breve descripcion clinica..."></textarea>
        </div>

        <div class="col-12 d-flex gap-4">
          <div class="form-check form-switch">
            <input id="dg-contagioso" v-model="form.contagioso" class="form-check-input" type="checkbox" />
            <label class="form-check-label" for="dg-contagioso">Contagioso</label>
          </div>
          <div class="form-check form-switch">
            <input id="dg-activo" v-model="form.activo" class="form-check-input" type="checkbox" />
            <label class="form-check-label" for="dg-activo">Activo</label>
          </div>
        </div>
      </div>
    </form>

    <template #footer>
      <button class="btn btn-light" type="button" @click="$emit('close')">Cancelar</button>
      <button class="btn btn-primary" type="submit" form="diagnostico-form">
        <i class="bi bi-check2 me-1"></i>{{ isEdit ? 'Guardar cambios' : 'Registrar diagnostico' }}
      </button>
    </template>
  </BaseModal>
</template>

<script setup>
import { computed, watch } from 'vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import SearchSelect from '@/components/ui/SearchSelect.vue'
import { useDiagnosticosStore } from '@/stores/diagnosticos'
import { useForm } from '@/composables/useForm'
import { CATEGORIAS_DIAGNOSTICO, ESPECIES } from '@/data/catalogos'
import { notifyValidation, toastSuccess } from '@/utils/alerts'

const props = defineProps({
  open: { type: Boolean, default: false },
  diagnostico: { type: Object, default: null },
})

const emit = defineEmits(['close', 'saved'])

const store = useDiagnosticosStore()

const categoriaOptions = [
  { value: '', label: 'Selecciona una categoria' },
  ...CATEGORIAS_DIAGNOSTICO.map((c) => ({ value: c, label: c })),
]
const especieOptions = [
  { value: 'Todas', label: 'Todas' },
  ...ESPECIES.map((e) => ({ value: e, label: e })),
]

function emptyForm() {
  return {
    codigo: '',
    nombre: '',
    categoria: '',
    especie: 'Todas',
    contagioso: false,
    activo: true,
    descripcion: '',
  }
}

const { form, errors, touched, validate, validateField, firstError, reset } = useForm(emptyForm(), {
  codigo: { label: 'Codigo', required: true, min: 2 },
  nombre: { label: 'Nombre', required: true, min: 3 },
  categoria: { label: 'Categoria', required: true },
})

const isEdit = computed(() => !!props.diagnostico?.id)

function invalid(field) {
  return { 'is-invalid': touched[field] && errors[field] }
}
function showError(field) {
  return touched[field] && errors[field]
}

watch(
  () => props.open,
  (open) => {
    if (open) reset(props.diagnostico ? { ...emptyForm(), ...props.diagnostico } : emptyForm())
  },
)

function onSubmit() {
  if (!validate()) {
    notifyValidation(firstError())
    return
  }
  store.save({ ...form })
  toastSuccess(isEdit.value ? 'Diagnostico actualizado' : 'Diagnostico registrado', `${form.nombre} se guardo correctamente.`)
  emit('saved')
  emit('close')
}
</script>
