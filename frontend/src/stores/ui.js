import { defineStore } from 'pinia'
import { ref } from 'vue'

/**
 * Store de interfaz: controla el estado del menu lateral
 * tanto en escritorio (colapsado) como en movil (offcanvas).
 */
export const useUiStore = defineStore('ui', () => {
  const sidebarCollapsed = ref(false)
  const sidebarMobileOpen = ref(false)

  function toggleSidebar() {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }
  function openMobileSidebar() {
    sidebarMobileOpen.value = true
  }
  function closeMobileSidebar() {
    sidebarMobileOpen.value = false
  }

  return { sidebarCollapsed, sidebarMobileOpen, toggleSidebar, openMobileSidebar, closeMobileSidebar }
})
