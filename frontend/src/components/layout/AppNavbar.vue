<template>
  <header class="app-topbar">
    <!-- Menu: en movil abre el offcanvas, en escritorio colapsa -->
    <button class="btn-icon" type="button" aria-label="Abrir menu" @click="onMenu">
      <i class="bi bi-list"></i>
    </button>

    <button
      class="btn-icon d-none d-lg-inline-flex"
      type="button"
      aria-label="Colapsar menu"
      @click="ui.toggleSidebar()"
    >
      <i class="bi bi-layout-sidebar-inset"></i>
    </button>

    <form class="topbar-search d-none d-md-flex" @submit.prevent>
      <i class="bi bi-search"></i>
      <input
        type="search"
        class="form-control"
        placeholder="Buscar paciente, cita o producto..."
        aria-label="Buscar"
      />
    </form>

    <div class="ms-auto d-flex align-items-center gap-1">
      <button class="btn-icon position-relative" type="button" aria-label="Notificaciones" @click="onNotifications">
        <i class="bi bi-bell"></i>
        <span class="badge-dot"></span>
      </button>

      <div class="dropdown">
        <button
          class="btn-user dropdown-toggle"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <span class="avatar">{{ auth.initials }}</span>
          <span class="d-none d-sm-flex flex-column text-start lh-1">
            <span class="fw-semibold small">{{ auth.fullName }}</span>
            <span class="text-muted" style="font-size: 0.72rem">{{ auth.role }}</span>
          </span>
        </button>
        <ul class="dropdown-menu dropdown-menu-end shadow-sm">
          <li><a class="dropdown-item" href="#" @click.prevent="onSoon"><i class="bi bi-person me-2"></i>Mi perfil</a></li>
          <li><a class="dropdown-item" href="#" @click.prevent="onSoon"><i class="bi bi-gear me-2"></i>Configuracion</a></li>
          <li><hr class="dropdown-divider" /></li>
          <li>
            <button class="dropdown-item text-danger" type="button" @click="onLogout">
              <i class="bi bi-box-arrow-right me-2"></i>Cerrar sesion
            </button>
          </li>
        </ul>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useUiStore } from '@/stores/ui'
import { confirmDialog, toastInfo, toastSuccess } from '@/utils/alerts'

const auth = useAuthStore()
const ui = useUiStore()
const router = useRouter()

function onMenu() {
  if (window.innerWidth < 992) ui.openMobileSidebar()
  else ui.toggleSidebar()
}

function onNotifications() {
  toastInfo('Notificaciones', 'Aun no tienes notificaciones nuevas.')
}

function onSoon() {
  toastInfo('Proximamente', 'Esta opcion estara disponible en una siguiente fase.')
}

async function onLogout() {
  const result = await confirmDialog({
    title: 'Cerrar sesion',
    text: 'Deseas salir del sistema?',
    confirmText: 'Si, salir',
    icon: 'warning',
  })
  if (!result.isConfirmed) return

  auth.logout()
  toastSuccess('Sesion cerrada', 'Hasta pronto.')
  router.push({ name: 'login' })
}
</script>
