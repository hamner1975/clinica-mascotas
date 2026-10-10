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

const ui = useUiStore()

// Cierra el menu movil al agrandar la ventana.
function onResize() {
  if (window.innerWidth >= 992) ui.closeMobileSidebar()
}

onMounted(() => {
  ui.closeMobileSidebar()
  window.addEventListener('resize', onResize)
})
onUnmounted(() => window.removeEventListener('resize', onResize))
</script>
