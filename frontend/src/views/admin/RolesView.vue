<template>
  <div>
    <div class="page-head">
      <div>
        <h1 class="page-title">Roles y permisos</h1>
        <p class="page-subtitle">{{ store.total }} roles &middot; control de acceso (RBAC)</p>
      </div>
      <button class="btn btn-primary" type="button" @click="openCreate">
        <i class="bi bi-shield-plus me-2"></i>Nuevo rol
      </button>
    </div>

    <div class="row g-3">
      <div v-for="rol in store.roles" :key="rol.id" class="col-12 col-md-6 col-xl-4">
        <div class="card h-100">
          <div class="card-body d-flex flex-column">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <span class="avatar avatar--sm"><i class="bi bi-shield-check"></i></span>
              <span v-if="rol.sistema" class="badge rounded-pill text-bg-dark">
                <i class="bi bi-lock-fill me-1"></i>Sistema
              </span>
            </div>

            <h2 class="h5 mb-1">{{ rol.nombre }}</h2>
            <p class="text-muted small flex-grow-1">{{ rol.descripcion || 'Sin descripcion.' }}</p>

            <div class="d-flex gap-3 small text-muted mb-3">
              <span><i class="bi bi-key me-1"></i>{{ rol.permisos.length }} permisos</span>
              <span><i class="bi bi-people me-1"></i>{{ usuarios.byRol(rol.id).length }} usuarios</span>
            </div>

            <div class="d-flex gap-2">
              <button class="btn btn-sm btn-outline-secondary flex-grow-1" type="button" @click="openEdit(rol)">
                <i class="bi bi-pencil me-1"></i>{{ rol.sistema ? 'Ver permisos' : 'Editar' }}
              </button>
              <button
                class="btn btn-sm btn-outline-danger"
                type="button"
                :disabled="rol.sistema"
                :title="rol.sistema ? 'Los roles de sistema no se eliminan' : 'Eliminar'"
                @click="onDelete(rol)"
              >
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <RolFormModal :open="modalOpen" :rol="editing" @close="modalOpen = false" @saved="onSaved" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRolesStore } from '@/stores/roles'
import { useUsuariosStore } from '@/stores/usuarios'
import RolFormModal from '@/components/admin/RolFormModal.vue'
import { confirmDialog, toastError, toastSuccess } from '@/utils/alerts'
const store = useRolesStore()
const usuarios = useUsuariosStore()

const modalOpen = ref(false)
const editing = ref(null)

function openCreate() {
  editing.value = null
  modalOpen.value = true
}
function openEdit(rol) {
  editing.value = { ...rol }
  modalOpen.value = true
}
function onSaved() {
  // El store ya persistio.
}

async function onDelete(rol) {
  const enUso = usuarios.byRol(rol.id).length
  if (enUso > 0) {
    toastError('No se puede eliminar', `${enUso} usuario(s) tienen asignado el rol "${rol.nombre}".`)
    return
  }
  const result = await confirmDialog({
    title: 'Eliminar rol',
    text: `¿Deseas eliminar el rol "${rol.nombre}"?`,
    confirmText: 'Si, eliminar',
    icon: 'warning',
  })
  if (result.isConfirmed) {
    try {
      await store.remove(rol.id)
      toastSuccess('Rol eliminado', `El rol "${rol.nombre}" fue eliminado.`)
    } catch (error) {
      toastError('No se pudo eliminar', error?.message || 'Intenta de nuevo.')
    }
  }
}

onMounted(() => {
  store.load().catch(() => {})
  usuarios.load().catch(() => {})
})
</script>
