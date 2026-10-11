<template>
  <div class="store-shell">
    <header class="store-header">
      <div class="container d-flex align-items-center justify-content-between">
        <router-link :to="{ name: 'home' }" class="store-brand">
          <span class="store-brand__logo"><i class="bi bi-heart-pulse-fill"></i></span>
          <span class="d-flex flex-column lh-1">
            <strong>{{ config.config.nombre }}</strong>
            <small class="text-muted">{{ config.config.eslogan }}</small>
          </span>
        </router-link>

        <div class="d-flex align-items-center gap-3">
          <nav class="store-nav d-none d-lg-flex align-items-center gap-3">
            <router-link :to="{ name: 'home' }" class="store-nav__link">Inicio</router-link>
            <router-link :to="{ path: '/', hash: '#servicios' }" class="store-nav__link">Servicios</router-link>
            <router-link :to="{ name: 'tienda' }" class="store-nav__link">Farmacia</router-link>
            <router-link :to="{ path: '/', hash: '#contacto' }" class="store-nav__link">Contacto</router-link>
          </nav>
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
      <div class="container d-flex flex-wrap justify-content-between align-items-center gap-2">
        <span>&copy; {{ year }} {{ config.config.nombre }}. Todos los derechos reservados.</span>

        <span v-if="tieneRedes" class="d-flex align-items-center gap-3">
          <a v-if="redes.facebook" :href="redes.facebook" target="_blank" rel="noopener" class="store-social" title="Facebook"><i class="bi bi-facebook"></i></a>
          <a v-if="redes.instagram" :href="redes.instagram" target="_blank" rel="noopener" class="store-social" title="Instagram"><i class="bi bi-instagram"></i></a>
          <a v-if="redes.whatsapp" :href="waLink" target="_blank" rel="noopener" class="store-social" title="WhatsApp"><i class="bi bi-whatsapp"></i></a>
          <a v-if="redes.tiktok" :href="redes.tiktok" target="_blank" rel="noopener" class="store-social" title="TikTok"><i class="bi bi-tiktok"></i></a>
        </span>

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
import { computed, onMounted } from 'vue'
import { useConfigStore } from '@/stores/config'
import { useSitioStore } from '@/stores/sitio'

const config = useConfigStore()
const sitio = useSitioStore()
const year = new Date().getFullYear()

onMounted(() => {
  config.load().catch(() => {})
  sitio.load().catch(() => {})
})

const redes = computed(() => sitio.contenido.redes || {})
const tieneRedes = computed(() =>
  Object.values(redes.value).some((valor) => valor && String(valor).trim() !== ''),
)
const waLink = computed(() => {
  const valor = redes.value.whatsapp || ''
  if (valor.startsWith('http')) return valor
  const numero = valor.replace(/[^\d]/g, '')
  return `https://wa.me/${numero}`
})
</script>
