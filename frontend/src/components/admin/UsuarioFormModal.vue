<template>
  <BaseModal
    :open="open"
    :title="isEdit ? 'Editar usuario' : 'Nuevo usuario'"
    icon="bi-person-badge"
    size="lg"
    @close="$emit('close')"
  >
    <form id="usuario-form" novalidate @submit.prevent="onSubmit">
      <div class="row g-3">
        <div class="col-md-6">
          <label class="form-label" for="u-nombres">Nombres <span class="text-danger">*</span></label>
          <input id="u-nombres" v-model="form.nombres" class="form-control" :class="invalid('nombres')" placeholder="Ej: Ana" @blur="validateField('nombres')" />
          <p v-if="showError('nombres')" class="text-danger small mt-1 mb-0">{{ errors.nombres }}</p>
        </div>

        <div class="col-md-6">
          <label class="form-label" for="u-apellidos">Apellidos <span class="text-danger">*</span></label>
          <input id="u-apellidos" v-model="form.apellidos" class="form-control" :class="invalid('apellidos')" placeholder="Ej: Ramirez" @blur="validateField('apellidos')" />
          <p v-if="showError('apellidos')" class="text-danger small mt-1 mb-0">{{ errors.apellidos }}</p>
        </div>

        <div class="col-md-6">
          <label class="form-label" for="u-email">Correo electronico <span class="text-danger">*</span></label>
          <input id="u-email" v-model="form.email" type="email" class="form-control" :class="invalid('email')" placeholder="usuario@clinica.test" @blur="validateField('email')" />
          <p v-if="showError('email')" class="text-danger small mt-1 mb-0">{{ errors.email }}</p>
        </div>

        <div class="col-md-6">
          <label class="form-label" for="u-telefono">Telefono</label>
          <input id="u-telefono" v-model="form.telefono" class="form-control" :class="invalid('telefono')" placeholder="Ej: +57 300 123 4567" @blur="validateField('telefono')" />
          <p v-if="showError('telefono')" class="text-danger small mt-1 mb-0">{{ errors.telefono }}</p>
        </div>

        <div class="col-md-6">
          <label class="form-label" for="u-doc">Documento / DNI</label>
          <input id="u-doc" v-model="form.documento" class="form-control" placeholder="Ej: 10234567" />
        </div>

        <div class="col-md-6">
          <label class="form-label" for="u-rol">Rol <span class="text-danger">*</span></label>
          <SearchSelect
            id="u-rol"
            v-model="form.rolId"
            :options="rolOptions"
            icon="bi-shield-lock"
            placeholder="Buscar rol..."
            :invalid="!!(touched.rolId && errors.rolId)"
            @blur="validateField('rolId')"
          />
          <p v-if="showError('rolId')" class="text-danger small mt-1 mb-0">{{ errors.rolId }}</p>
        </div>

        <div class="col-12">
          <hr class="my-1" />
          <p class="text-muted small mb-2">
            <i class="bi bi-key me-1"></i>
            {{ isEdit ? 'Deja la contrasena en blanco para no cambiarla.' : 'La contrasena es obligatoria.' }}
          </p>
        </div>

        <div class="col-md-6">
          <label class="form-label" for="u-pass">Contrasena</label>
          <input id="u-pass" v-model="form.password" type="password" class="form-control" :class="invalid('password')" placeholder="Minimo 6 caracteres" @blur="validateField('password')" />
          <p v-if="showError('password')" class="text-danger small mt-1 mb-0">{{ errors.password }}</p>
        </div>

        <div class="col-md-6">
          <label class="form-label" for="u-pass2">Confirmar contrasena</label>
          <input id="u-pass2" v-model="form.password2" type="password" class="form-control" :class="invalid('password2')" placeholder="Repite la contrasena" @blur="validateField('password2')" />
          <p v-if="showError('password2')" class="text-danger small mt-1 mb-0">{{ errors.password2 }}</p>
        </div>

        <div class="col-12">
          <div class="form-check form-switch">
            <input id="u-activo" v-model="form.activo" class="form-check-input" type="checkbox" />
            <label class="form-check-label" for="u-activo">Usuario activo (puede iniciar sesion)</label>
          </div>
        </div>
      </div>
    </form>

    <template #footer>
      <button class="btn btn-light" type="button" @click="$emit('close')">Cancelar</button>
      <button class="btn btn-primary" type="submit" form="usuario-form">
        <i class="bi bi-check2 me-1"></i>{{ isEdit ? 'Guardar cambios' : 'Crear usuario' }}
      </button>
    </template>
  </BaseModal>
</template>

<script setup>
import { computed, watch } from 'vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import SearchSelect from '@/components/ui/SearchSelect.vue'
import { useUsuariosStore } from '@/stores/usuarios'
import { useRolesStore } from '@/stores/roles'
import { useForm } from '@/composables/useForm'
import { notifyValidation, toastSuccess } from '@/utils/alerts'

const props = defineProps({
  open: { type: Boolean, default: false },
  usuario: { type: Object, default: null },
})

const emit = defineEmits(['close', 'saved'])

const store = useUsuariosStore()
const roles = useRolesStore()

const rolOptions = computed(() =>
  roles.roles.map((r) => ({ value: r.id, label: r.nombre, sublabel: `${r.permisos.length} permisos` })),
)

function emptyForm() {
  return {
    nombres: '',
    apellidos: '',
    documento: '',
    email: '',
    telefono: '',
    rolId: '',
    activo: true,
    password: '',
    password2: '',
  }
}

const { form, errors, touched, validate, validateField, firstError, reset } = useForm(emptyForm(), {
  nombres: { label: 'Nombres', required: true, min: 2 },
  apellidos: { label: 'Apellidos', required: true, min: 2 },
  email: { label: 'Correo electronico', required: true, email: true },
  telefono: { label: 'Telefono', phone: true },
  rolId: { label: 'Rol', required: true },
  password: {
    label: 'Contrasena',
    custom: (value) => {
      if (!isEdit.value && !value) return 'La contrasena es obligatoria.'
      if (value && String(value).length < 6) return 'La contrasena debe tener al menos 6 caracteres.'
      return ''
    },
  },
  password2: {
    label: 'Confirmar contrasena',
    custom: (value, fields) => {
      if (!isEdit.value && !value) return 'Confirma la contrasena.'
      if (value !== fields.password) return 'Las contrasenas no coinciden.'
      return ''
    },
  },
})

const isEdit = computed(() => !!props.usuario?.id)

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
    const base = props.usuario ? { ...emptyForm(), ...props.usuario, password: '', password2: '' } : emptyForm()
    reset(base)
  },
)

function onSubmit() {
  if (!validate()) {
    notifyValidation(firstError())
    return
  }
  // La contrasena NO se guarda en el frontend (Fase 2: se envia al backend).
  const { password, password2, ...payload } = form
  store.save({ ...payload, rolId: Number(payload.rolId) })
  toastSuccess(
    isEdit.value ? 'Usuario actualizado' : 'Usuario creado',
    `${form.nombres} ${form.apellidos} se guardo correctamente.`,
  )
  emit('saved')
  emit('close')
}
</script>
