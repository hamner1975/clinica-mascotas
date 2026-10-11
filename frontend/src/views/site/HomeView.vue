<template>
  <div class="home">
    <!-- Hero -->
    <section class="hero">
      <div class="row align-items-center g-4">
        <div class="col-12 col-lg-6">
          <span class="badge rounded-pill text-bg-light border mb-3">
            <i class="bi bi-heart-pulse me-1 text-primary"></i>{{ sitio.contenido.hero.badge }}
          </span>
          <h1 class="display-6 fw-bold mb-3">{{ sitio.contenido.hero.titulo }}</h1>
          <p class="text-muted fs-5 mb-4">{{ sitio.contenido.hero.subtitulo }}</p>
          <div class="d-flex flex-wrap gap-2">
            <a href="#servicios" class="btn btn-primary btn-lg">
              <i class="bi bi-list-check me-2"></i>{{ sitio.contenido.hero.botonPrimario }}
            </a>
            <router-link :to="{ name: 'tienda' }" class="btn btn-outline-secondary btn-lg">
              <i class="bi bi-capsule me-2"></i>{{ sitio.contenido.hero.botonSecundario }}
            </router-link>
          </div>
        </div>
        <div class="col-12 col-lg-6">
          <div class="hero__art" :class="{ 'hero__art--img': sitio.contenido.hero.imagen }">
            <img v-if="sitio.contenido.hero.imagen" :src="sitio.contenido.hero.imagen" alt="" />
            <i v-else class="bi bi-heart-pulse-fill"></i>
          </div>
        </div>
      </div>
    </section>

    <!-- Servicios -->
    <section v-if="sitio.contenido.secciones.servicios" id="servicios" class="mt-5 pt-3">
      <div class="text-center mb-4">
        <h2 class="fw-bold">Nuestros servicios</h2>
        <p class="text-muted">Atencion completa para perros, gatos y mascotas exoticas.</p>
      </div>
      <div class="row g-3">
        <div v-for="s in sitio.contenido.servicios" :key="s.id" class="col-12 col-sm-6 col-lg-3">
          <div class="card h-100 service-card">
            <div class="card-body">
              <span class="service-card__icon"><i :class="['bi', s.icon]"></i></span>
              <h3 class="h6 mt-3 mb-1">{{ s.titulo }}</h3>
              <p class="text-muted small mb-0">{{ s.descripcion }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Farmacia -->
    <section v-if="sitio.contenido.secciones.farmacia && sitio.contenido.farmacia.visible" id="farmacia" class="mt-5">
      <div class="card pharmacy-banner">
        <div class="card-body d-flex flex-wrap align-items-center justify-content-between gap-4">
          <div class="d-flex align-items-center gap-3">
            <span class="pharmacy-banner__icon"><i class="bi bi-capsule"></i></span>
            <div>
              <h2 class="h4 mb-1">{{ sitio.contenido.farmacia.titulo }}</h2>
              <p class="text-muted mb-0">{{ sitio.contenido.farmacia.texto }}</p>
            </div>
          </div>
          <router-link :to="{ name: 'tienda' }" class="btn btn-primary btn-lg flex-shrink-0">
            <i class="bi bi-shop me-2"></i>{{ sitio.contenido.farmacia.boton }}
          </router-link>
        </div>
      </div>
    </section>

    <!-- Por que elegirnos -->
    <section v-if="sitio.contenido.secciones.elegirnos && sitio.contenido.elegirnos.visible" class="mt-5">
      <div class="text-center mb-4">
        <h2 class="fw-bold">{{ sitio.contenido.elegirnos.titulo }}</h2>
        <p class="text-muted">{{ sitio.contenido.elegirnos.subtitulo }}</p>
      </div>
      <div class="row g-3">
        <div v-for="it in sitio.contenido.elegirnos.items" :key="it.id" class="col-12 col-md-4">
          <div class="card h-100">
            <div class="card-body text-center">
              <span class="service-card__icon mx-auto"><i :class="['bi', it.icon]"></i></span>
              <h3 class="h6 mt-3 mb-1">{{ it.titulo }}</h3>
              <p class="text-muted small mb-0">{{ it.texto }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Contacto -->
    <section v-if="sitio.contenido.secciones.contacto" id="contacto" class="mt-5">
      <div class="text-center mb-4">
        <h2 class="fw-bold">Visitanos</h2>
        <p class="text-muted">Estamos para ayudarte.</p>
      </div>
      <div class="row g-3">
        <div class="col-12 col-md-4">
          <div class="card h-100">
            <div class="card-body">
              <i class="bi bi-geo-alt fs-4 text-primary"></i>
              <h3 class="h6 mt-2">Direccion</h3>
              <p class="text-muted small mb-0">{{ config.config.direccion }}</p>
            </div>
          </div>
        </div>
        <div class="col-12 col-md-4">
          <div class="card h-100">
            <div class="card-body">
              <i class="bi bi-telephone fs-4 text-primary"></i>
              <h3 class="h6 mt-2">Contacto</h3>
              <p class="text-muted small mb-0">{{ config.config.telefono }}<br />{{ config.config.email }}</p>
            </div>
          </div>
        </div>
        <div class="col-12 col-md-4">
          <div class="card h-100">
            <div class="card-body">
              <i class="bi bi-clock fs-4 text-primary"></i>
              <h3 class="h6 mt-2">Horario</h3>
              <p class="text-muted small mb-0">
                Lunes a Sabado: {{ config.config.horaApertura }} - {{ config.config.horaCierre }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div v-if="tieneRedes" class="text-center mt-4">
        <p class="text-muted mb-3">Siguenos en nuestras redes</p>
        <div class="d-flex justify-content-center gap-3">
          <a v-if="redes.facebook" :href="redes.facebook" target="_blank" rel="noopener" class="social-btn social-btn--fb" title="Facebook"><i class="bi bi-facebook"></i></a>
          <a v-if="redes.instagram" :href="redes.instagram" target="_blank" rel="noopener" class="social-btn social-btn--ig" title="Instagram"><i class="bi bi-instagram"></i></a>
          <a v-if="redes.whatsapp" :href="waLink" target="_blank" rel="noopener" class="social-btn social-btn--wa" title="WhatsApp"><i class="bi bi-whatsapp"></i></a>
          <a v-if="redes.tiktok" :href="redes.tiktok" target="_blank" rel="noopener" class="social-btn social-btn--tk" title="TikTok"><i class="bi bi-tiktok"></i></a>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useConfigStore } from '@/stores/config'
import { useSitioStore } from '@/stores/sitio'

const config = useConfigStore()
const sitio = useSitioStore()

const redes = computed(() => sitio.contenido.redes || {})
const tieneRedes = computed(() =>
  Object.values(redes.value).some((valor) => valor && String(valor).trim() !== ''),
)
const waLink = computed(() => {
  const valor = redes.value.whatsapp || ''
  if (valor.startsWith('http')) return valor
  return `https://wa.me/${valor.replace(/[^\d]/g, '')}`
})
</script>
