<template>
  <aside class="app-sidebar" :class="{ 'is-open': ui.sidebarMobileOpen }">
    <div class="sidebar-brand">
      <span class="sidebar-brand__logo">
        <i class="bi bi-heart-pulse-fill"></i>
      </span>
      <span class="sidebar-brand__text">
        <span><strong>Clinica</strong> Mascotas</span>
        <small>Sistema integral</small>
      </span>
    </div>

    <nav class="sidebar-nav">
      <template v-for="section in menuSections" :key="section.title">
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
  </aside>
</template>

<script setup>
import { menuSections } from '@/data/menu'
import { useUiStore } from '@/stores/ui'

const ui = useUiStore()
</script>
