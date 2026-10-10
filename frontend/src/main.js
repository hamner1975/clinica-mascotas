import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// Hojas de estilo (el orden importa)
import 'bootstrap-icons/font/bootstrap-icons.css'
import '@/assets/scss/main.scss'

// JavaScript de Bootstrap (dropdowns, modales, offcanvas, tooltips...)
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
