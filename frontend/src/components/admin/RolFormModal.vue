<template>
  <BaseModal
    :open="open"
    :title="isEdit ? 'Editar rol' : 'Nuevo rol'"
    icon="bi-shield-lock"
    size="xl"
    @close="$emit('close')"
  >
    <form id="rol-form" novalidate @submit.prevent="onSubmit">
      <div class="row g-3 mb-2">
        <div class="col-md-6">
          <label class="form-label" for="r-nombre">Nombre del rol <span class="text-danger">*</span></label>
          <input id="r-nombre" v-model="form.nombre" class="form-control" :class="invalid('nombre')" placeholder="Ej: Auxiliar de farmacia" @blur="validateField('nombre')" />
          <p v-if="showError('nombre')" class="text-danger small mt-1 mb-0">{{ errors.nombre }}</p>
        </div>
        <div class="col-md-6">
          <label class="form-label" for="r-desc">Descripcion</label>
          <input id="r-desc" v-model="form.descripcion" class="form-control" placeholder="Breve descripcion del rol" />
        </div>
      </div>

      <div v-if="esSistema" class="alert alert-light border d-flex align-items-center gap-2 py-2">
        <i class="bi bi-shield-check text-primary"></i>
        Rol de sistema: tiene <strong>todos los permisos</strong> y no puede modificarse ni eliminarse.
      </div>

      <p class="text-muted small text-uppercase fw-semibold mb-2">
        <i class="bi bi-key me-1"></i>Permisos ({{ form.permisos.length }} seleccionados)
      </p>

      <div class="row g-3">
        <div v-for="grupo in GRUPOS_PERMISOS" :key="grupo.grupo" class="col-12 col-md-6">
          <div class="perm-group">
            <div class="form-check border-bottom pb-1 mb-1">
              <input
                :id="`g-${grupo.grupo}`"
                class="form-check-input"
                type="checkbox"
                :checked="todosDelGrupo(grupo)"
                :disabled="esSistema"
                @change="toggleGrupo(grupo, $event.target.checked)"
              />
              <label class="form-check-label fw-semibold" :for="`g-${grupo.grupo}`">{{ grupo.grupo }}</label>
            </div>
            <div v-for="item in grupo.items" :key="item.key" class="form-check ms-3">
              <input
                :id="`p-${item.key}`"
                v-model="form.permisos"
                class="form-check-input"
                type="checkbox"
                :value="item.key"
                :disabled="esSistema"
              />
              <label class="form-check-label small" :for="`p-${item.key}`">{{ item.label }}</label>
            </div>
          </div>
        </div>
      </div>
    </form>

    <template #footer>
      <button class="btn btn-light" type="button" @click="$emit('close')">Cancelar</button>
      <button class="btn btn-primary" type="submit" form="rol-form">
        <i class="bi bi-check2 me-1"></i>{{ isEdit ? 'Guardar cambios' : 'Crear rol' }}
      </button>
    </template>
  </BaseModal>
</template>

<script setup>
import { computed, watch } from 'vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import { useRolesStore } from '@/stores/roles'
import { useForm } from '@/composables/useForm'
import { GRUPOS_PERMISOS } from '@/data/permisos'
import { notifyValidation, toastError, toastSuccess } from '@/utils/alerts'

const props = defineProps({
  open: { type: Boolean, default: false },
  rol: { type: Object, default: null },
})

const emit = defineEmits(['close', 'saved'])

const store = useRolesStore()

const { form, errors, touched, validate, validateField, firstError, reset } = useForm(
  { nombre: '', descripcion: '', permisos: [] },
  { nombre: { label: 'Nombre del rol', required: true, min: 3 } },
)

const isEdit = computed(() => !!props.rol?.id)
const esSistema = computed(() => !!props.rol?.sistema)

function invalid(field) {
  return { 'is-invalid': touched[field] && errors[field] }
}
function showError(field) {
  return touched[field] && errors[field]
}

function todosDelGrupo(grupo) {
  return grupo.items.every((item) => form.permisos.includes(item.key))
}

function toggleGrupo(grupo, checked) {
  const claves = grupo.items.map((item) => item.key)
  if (checked) {
    form.permisos = Array.from(new Set([...form.permisos, ...claves]))
  } else {
    form.permisos = form.permisos.filter((key) => !claves.includes(key))
  }
}

watch(
  () => props.open,
  (open) => {
    if (!open) return
    if (props.rol) {
      reset({
        id: props.rol.id,
        nombre: props.rol.nombre,
        descripcion: props.rol.descripcion || '',
        permisos: [...(props.rol.permisos || [])],
      })
    } else {
      reset({ nombre: '', descripcion: '', permisos: [] })
    }
  },
)

async function onSubmit() {
  if (!validate()) {
    notifyValidation(firstError())
    return
  }
  try {
    await store.save({
      id: form.id,
      nombre: form.nombre,
      descripcion: form.descripcion,
      permisos: [...form.permisos],
    })
    toastSuccess(isEdit.value ? 'Rol actualizado' : 'Rol creado', `El rol "${form.nombre}" se guardo correctamente.`)
    emit('saved')
    emit('close')
  } catch (error) {
    toastError('No se pudo guardar', error?.message || 'Intenta de nuevo.')
  }
}
</script>
