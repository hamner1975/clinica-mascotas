<template>
  <div>
    <div class="page-head">
      <div>
        <h1 class="page-title">Usuarios</h1>
        <p class="page-subtitle">{{ store.total }} usuarios &middot; {{ store.activos }} activos</p>
      </div>
      <button class="btn btn-primary" type="button" @click="openCreate">
        <i class="bi bi-person-plus me-2"></i>Nuevo usuario
      </button>
    </div>

    <!-- Resumen -->
    <div class="row g-3 mb-3">
      <div class="col-6 col-xl-3">
        <StatCard label="Usuarios" :value="store.total" icon="bi-person-badge" variant="primary" />
      </div>
      <div class="col-6 col-xl-3">
        <StatCard label="Activos" :value="store.activos" icon="bi-person-check" variant="success" />
      </div>
      <div class="col-6 col-xl-3">
        <StatCard label="Inactivos" :value="store.inactivos" icon="bi-person" variant="warning" />
      </div>
      <div class="col-6 col-xl-3">
        <StatCard label="Roles" :value="roles.total" icon="bi-shield-lock" variant="info" />
      </div>
    </div>

    <div class="card">
      <div class="card-body">
        <!-- Filtros -->
        <div class="row g-2 mb-3">
          <div class="col-12 col-md-6">
            <div class="position-relative">
              <i class="bi bi-search search-icon"></i>
              <input v-model="search" class="form-control ps-5" placeholder="Buscar por nombre o correo..." />
            </div>
          </div>
          <div class="col-6 col-md-3">
            <SearchSelect v-model="rolFiltro" :options="rolOptions" icon="bi-funnel" placeholder="Rol" />
          </div>
          <div class="col-6 col-md-3">
            <SearchSelect v-model="estadoFiltro" :options="estadoOptions" icon="bi-funnel" placeholder="Estado" />
          </div>
        </div>

        <!-- Tabla -->
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead>
              <tr class="text-muted small text-uppercase">
                <th scope="col">Usuario</th>
                <th scope="col" class="d-none d-lg-table-cell">Contacto</th>
                <th scope="col">Rol</th>
                <th scope="col" class="text-center">Activo</th>
                <th scope="col" class="d-none d-xl-table-cell">Ultimo acceso</th>
                <th scope="col" class="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="u in paginated" :key="u.id">
                <td>
                  <div class="d-flex align-items-center gap-2">
                    <span class="avatar avatar--sm">{{ iniciales(u) }}</span>
                    <div>
                      <div class="fw-semibold">{{ u.nombres }} {{ u.apellidos }}</div>
                      <small class="text-muted">{{ u.documento || 'Sin documento' }}</small>
                    </div>
                  </div>
                </td>
                <td class="d-none d-lg-table-cell">
                  <div class="small"><i class="bi bi-envelope me-1 text-muted"></i>{{ u.email }}</div>
                  <div class="small text-muted"><i class="bi bi-telephone me-1"></i>{{ u.telefono || '—' }}</div>
                </td>
                <td><span class="badge rounded-pill text-bg-primary">{{ roles.nombre(u.rolId) }}</span></td>
                <td class="text-center">
                  <div class="form-check form-switch d-inline-block">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      role="switch"
                      :checked="u.activo"
                      @change="toggleActivo(u, $event)"
                    />
                  </div>
                </td>
                <td class="d-none d-xl-table-cell text-muted">{{ u.ultimoAcceso ? formatFecha(u.ultimoAcceso) : 'Nunca' }}</td>
                <td class="text-end text-nowrap">
                  <button class="btn btn-sm btn-light" type="button" title="Editar" @click="openEdit(u)">
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button class="btn btn-sm btn-light text-danger" type="button" title="Eliminar" @click="onDelete(u)">
                    <i class="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
              <tr v-if="paginated.length === 0">
                <td colspan="6">
                  <div class="text-center text-muted py-5">
                    <i class="bi bi-person-badge fs-3 d-block mb-2"></i>
                    No se encontraron usuarios.
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <TablePagination :page="page" :per-page="perPage" :total="total" @update:page="setPage" />
      </div>
    </div>

    <UsuarioFormModal :open="modalOpen" :usuario="editing" @close="modalOpen = false" @saved="onSaved" />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useUsuariosStore } from '@/stores/usuarios'
import { useRolesStore } from '@/stores/roles'
import { formatFecha } from '@/utils/format'
import { usePagination } from '@/composables/usePagination'
import TablePagination from '@/components/ui/TablePagination.vue'
import StatCard from '@/components/ui/StatCard.vue'
import SearchSelect from '@/components/ui/SearchSelect.vue'
import UsuarioFormModal from '@/components/admin/UsuarioFormModal.vue'
import { confirmDialog, toastSuccess, toastInfo } from '@/utils/alerts'

const store = useUsuariosStore()
const roles = useRolesStore()

const search = ref('')
const rolFiltro = ref('')
const estadoFiltro = ref('')

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  return store.usuarios.filter((u) => {
    const full = `${u.nombres} ${u.apellidos}`.toLowerCase()
    const matchesSearch = !q || full.includes(q) || (u.email || '').toLowerCase().includes(q)
    const matchesRol = !rolFiltro.value || u.rolId === rolFiltro.value
    const matchesEstado =
      !estadoFiltro.value || (estadoFiltro.value === 'activo' ? u.activo : !u.activo)
    return matchesSearch && matchesRol && matchesEstado
  })
})

const { page, perPage, total, paginated, setPage } = usePagination(filtered, 8)

const rolOptions = computed(() => [
  { value: '', label: 'Todos los roles' },
  ...roles.roles.map((r) => ({ value: r.id, label: r.nombre })),
])
const estadoOptions = [
  { value: '', label: 'Todos' },
  { value: 'activo', label: 'Activos' },
  { value: 'inactivo', label: 'Inactivos' },
]

const modalOpen = ref(false)
const editing = ref(null)

function iniciales(u) {
  const a = (u.nombres || '').charAt(0)
  const b = (u.apellidos || '').charAt(0)
  return `${a}${b}`.toUpperCase() || 'US'
}

function openCreate() {
  editing.value = null
  modalOpen.value = true
}
function openEdit(usuario) {
  editing.value = { ...usuario }
  modalOpen.value = true
}
function onSaved() {
  // El store ya persistio.
}

function toggleActivo(usuario, event) {
  store.setActivo(usuario.id, event.target.checked)
  toastInfo(
    event.target.checked ? 'Usuario activado' : 'Usuario desactivado',
    `${usuario.nombres} ${usuario.apellidos} ahora esta ${event.target.checked ? 'activo' : 'inactivo'}.`,
  )
}

async function onDelete(usuario) {
  const result = await confirmDialog({
    title: 'Eliminar usuario',
    text: `¿Seguro que deseas eliminar a ${usuario.nombres} ${usuario.apellidos}?`,
    confirmText: 'Si, eliminar',
    icon: 'warning',
  })
  if (result.isConfirmed) {
    store.remove(usuario.id)
    toastSuccess('Usuario eliminado', `${usuario.nombres} ${usuario.apellidos} fue eliminado.`)
  }
}
</script>
