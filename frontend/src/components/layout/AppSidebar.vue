<template>
  <aside class="app-sidebar" :class="{ 'is-open': ui.sidebarMobileOpen }">
    <div class="sidebar-brand">
      <span class="sidebar-brand__logo">
        <i class="bi bi-heart-pulse-fill"></i>
      </span>
      <span class="sidebar-brand__text">
        <span class="fw-bold">{{ config.config.nombre }}</span>
      </span>
    </div>

    <nav class="sidebar-nav">
      <template v-for="section in secciones" :key="section.title">
        <p class="sidebar-nav__title">{{ section.title }}</p>
        <ul class="sidebar-nav__list">
          <li v-for="item in section.items" :key="item.to">
            <router-link
              :to="item.to"
              class="sidebar-link"
              :title="item.title"
              @click="ui.closeMobileSidebar()"
            >
              <i :class="['bi', item.icon]"></i>
              <span class="sidebar-link__text">{{ item.title }}</span>
            </router-link>
          </li>
        </ul>
      </template>
    </nav>

    <a href="/tienda" target="_blank" rel="noopener" class="sidebar-store-link">
      <i class="bi bi-shop"></i>
      <span>Ver farmacia online</span>
    </a>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { menuSections } from '@/data/menu'
import { useUiStore } from '@/stores/ui'
import { useConfigStore } from '@/stores/config'
import { useAuthStore } from '@/stores/auth'

const ui = useUiStore()
const config = useConfigStore()
const auth = useAuthStore()

// Solo se muestran los items para los que el usuario tiene permiso.
const secciones = computed(() =>
  menuSections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => !item.permiso || auth.can(item.permiso)),
    }))
    .filter((section) => section.items.length > 0),
)
</script>
