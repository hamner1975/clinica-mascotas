<template>
  <div class="app-shell" :class="{ 'app-shell--collapsed': ui.sidebarCollapsed }">
    <AppSidebar />

    <div class="app-main">
      <AppNavbar />

      <main class="app-content">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>

      <AppFooter />
    </div>

    <!-- Fondo oscuro al abrir el menu en movil -->
    <div v-if="ui.sidebarMobileOpen" class="app-backdrop d-lg-none" @click="ui.closeMobileSidebar()"></div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppNavbar from '@/components/layout/AppNavbar.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import { useUiStore } from '@/stores/ui'
import { usePacientesStore } from '@/stores/pacientes'
import { useCitasStore } from '@/stores/citas'
import { useConsultasStore } from '@/stores/consultas'
import { useProductosStore } from '@/stores/productos'
import { useVentasStore } from '@/stores/ventas'
import { useUsuariosStore } from '@/stores/usuarios'
import { useRolesStore } from '@/stores/roles'
import { useDiagnosticosStore } from '@/stores/diagnosticos'

const ui = useUiStore()
const pacientes = usePacientesStore()
const citas = useCitasStore()
const consultas = useConsultasStore()
const productos = useProductosStore()
const ventas = useVentasStore()
const usuarios = useUsuariosStore()
const roles = useRolesStore()
const diagnosticos = useDiagnosticosStore()

// Cierra el menu movil al agrandar la ventana.
function onResize() {
  if (window.innerWidth >= 992) ui.closeMobileSidebar()
}

onMounted(() => {
  ui.closeMobileSidebar()
  window.addEventListener('resize', onResize)
  // Carga inicial de datos desde la API (Fase 2)
  pacientes.load().catch(() => {})
  citas.load().catch(() => {})
  consultas.load().catch(() => {})
  productos.load().catch(() => {})
  ventas.load().catch(() => {})
  usuarios.load().catch(() => {})
  roles.load().catch(() => {})
  diagnosticos.load().catch(() => {})
})
onUnmounted(() => window.removeEventListener('resize', onResize))
</script>
