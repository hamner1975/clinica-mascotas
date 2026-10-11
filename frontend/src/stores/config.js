import { defineStore } from 'pinia'
import { ref } from 'vue'

const KEY = 'cm_config'

const DEFAULT = {
  nombre: 'Veterinaria Mascotas',
  eslogan: 'Sistema integral',
  documento: '900.123.456-7',
  telefono: '+57 300 123 4567',
  email: 'contacto@clinicamascotas.test',
  direccion: 'Calle 45 #12-30, Bogota',
  moneda: 'PEN',
  horaApertura: '08:00',
  horaCierre: '18:00',
  duracionCita: 30,
  iva: 19,
}

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? { ...DEFAULT, ...JSON.parse(raw) } : { ...DEFAULT }
  } catch {
    return { ...DEFAULT }
  }
}

/** Store de configuracion del sistema. */
export const useConfigStore = defineStore('config', () => {
  const config = ref(load())

  function save(payload) {
    config.value = { ...config.value, ...payload }
    localStorage.setItem(KEY, JSON.stringify(config.value))
  }

  function reset() {
    config.value = { ...DEFAULT }
    localStorage.setItem(KEY, JSON.stringify(config.value))
  }

  return { config, save, reset, DEFAULT }
})
