<template>
  <div>
    <div class="page-head">
      <div>
        <h1 class="page-title">{{ title }}</h1>
        <p class="page-subtitle">Modulo en desarrollo</p>
      </div>
    </div>

    <div class="card">
      <div class="card-body text-center py-5">
        <span class="coming-icon"><i class="bi bi-tools"></i></span>
        <h2 class="h5 mt-3 mb-2">Modulo en construccion</h2>
        <p class="text-muted mb-4">
          Este modulo forma parte de la maqueta y se desarrollara en la siguiente fase del proyecto.
        </p>
        <router-link to="/" class="btn btn-primary">
          <i class="bi bi-arrow-left me-2"></i>Volver al dashboard
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const title = computed(() => route.meta.title || 'Modulo')
</script>
