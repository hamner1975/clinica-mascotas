<template>
  <div class="home">
    <!-- Hero -->
    <section class="hero">
      <div class="row align-items-center g-4">
        <div class="col-12 col-lg-6">
          <span class="badge rounded-pill text-bg-light border mb-3">
            <i class="bi bi-heart-pulse me-1 text-primary"></i>Clinica veterinaria
          </span>
          <h1 class="display-6 fw-bold mb-3">
            Cuidamos a tus mascotas <span class="text-primary">como a nuestra familia</span>
          </h1>
          <p class="text-muted fs-5 mb-4">
            En <strong>{{ config.config.nombre }}</strong> ofrecemos atencion veterinaria integral: consultas,
            vacunacion, cirugia, laboratorio y mas. Y ahora tambien puedes comprar en nuestra
            <strong>farmacia online</strong>.
          </p>
          <div class="d-flex flex-wrap gap-2">
            <a href="#servicios" class="btn btn-primary btn-lg">
              <i class="bi bi-list-check me-2"></i>Ver servicios
            </a>
            <router-link :to="{ name: 'tienda' }" class="btn btn-outline-secondary btn-lg">
              <i class="bi bi-capsule me-2"></i>Ir a la farmacia
            </router-link>
          </div>
        </div>
        <div class="col-12 col-lg-6">
          <div class="hero__art">
            <i class="bi bi-heart-pulse-fill"></i>
          </div>
        </div>
      </div>
    </section>

    <!-- Servicios -->
    <section id="servicios" class="mt-5 pt-3">
      <div class="text-center mb-4">
        <h2 class="fw-bold">Nuestros servicios</h2>
        <p class="text-muted">Atencion completa para perros, gatos y mascotas exoticas.</p>
      </div>
      <div class="row g-3">
        <div v-for="s in servicios" :key="s.titulo" class="col-12 col-sm-6 col-lg-3">
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
    <section id="farmacia" class="mt-5">
      <div class="card pharmacy-banner">
        <div class="card-body d-flex flex-wrap align-items-center justify-content-between gap-4">
          <div class="d-flex align-items-center gap-3">
            <span class="pharmacy-banner__icon"><i class="bi bi-capsule"></i></span>
            <div>
              <h2 class="h4 mb-1">Nuestra farmacia veterinaria</h2>
              <p class="text-muted mb-0">
                Medicamentos, vacunas, alimentos y accesorios. Compra online y recoge en la clinica o recibe en casa.
              </p>
            </div>
          </div>
          <router-link :to="{ name: 'tienda' }" class="btn btn-primary btn-lg flex-shrink-0">
            <i class="bi bi-shop me-2"></i>Entrar a la farmacia
          </router-link>
        </div>
      </div>
    </section>

    <!-- Contacto -->
    <section id="contacto" class="mt-5">
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
    </section>
  </div>
</template>

<script setup>
import { useConfigStore } from '@/stores/config'
import { servicios } from '@/data/servicios'

const config = useConfigStore()
</script>
