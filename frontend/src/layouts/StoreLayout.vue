<template>
  <div class="store-shell">
    <header class="store-header">
      <div class="container d-flex align-items-center justify-content-between">
        <router-link :to="{ name: 'tienda' }" class="store-brand">
          <span class="store-brand__logo"><i class="bi bi-heart-pulse-fill"></i></span>
          <span class="d-flex flex-column lh-1">
            <strong>{{ config.config.nombre }}</strong>
            <small class="text-muted">{{ config.config.eslogan }}</small>
          </span>
        </router-link>

        <div class="d-flex align-items-center gap-3">
          <span class="d-none d-md-inline text-muted small">
            <i class="bi bi-telephone me-1"></i>{{ config.config.telefono }}
          </span>
          <router-link :to="{ name: 'login' }" class="btn btn-outline-secondary btn-sm">
            <i class="bi bi-person-lock me-1"></i>Acceso personal
          </router-link>
        </div>
      </div>
    </header>

    <main class="store-main">
      <div class="container py-4">
        <router-view />
      </div>
    </main>

    <footer class="store-footer">
      <div class="container d-flex flex-wrap justify-content-between gap-2">
        <span>&copy; {{ year }} {{ config.config.nombre }}. Todos los derechos reservados.</span>
        <span class="text-muted">
          <i class="bi bi-geo-alt me-1"></i>{{ config.config.direccion }}
          <span class="mx-2">&middot;</span>
          <i class="bi bi-envelope me-1"></i>{{ config.config.email }}
        </span>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { useConfigStore } from '@/stores/config'

const config = useConfigStore()
const year = new Date().getFullYear()
</script>
