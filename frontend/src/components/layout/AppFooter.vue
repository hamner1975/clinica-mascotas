<template>
  <footer class="app-footer">
    <span>&copy; {{ year }} Clinica Mascotas</span>
    <span class="text-muted">v0.1.0 &mdash; Fase 1 (Diseno)</span>
  </footer>
</template>

<script setup>
const year = new Date().getFullYear()
</script>
