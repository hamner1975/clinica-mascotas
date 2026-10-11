import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// Hojas de estilo (el orden importa)
import 'bootstrap-icons/font/bootstrap-icons.css'
import '@/assets/scss/main.scss'

// JavaScript de Bootstrap (dropdowns, modales, offcanvas, tooltips...)
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// Version del juego de datos de ejemplo (Fase 1). Al incrementarla, el navegador
// descarta los datos locales y vuelve a cargar los de ejemplo. Util mientras el
// proyecto es solo diseno; en la Fase 2 la persistencia la maneja MySQL.
const SEED_VERSION = '4'
const SEED_KEYS = [
  'cm_duenos',
  'cm_mascotas',
  'cm_citas',
  'cm_consultas',
  'cm_productos',
  'cm_ventas',
  'cm_roles',
  'cm_usuarios',
  'cm_diagnosticos',
  'cm_sitio',
  'cm_config',
]
if (localStorage.getItem('cm_seed_version') !== SEED_VERSION) {
  SEED_KEYS.forEach((key) => localStorage.removeItem(key))
  localStorage.setItem('cm_seed_version', SEED_VERSION)
}

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
