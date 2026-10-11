import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'

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

/**
 * Store de configuracion del sistema.
 * FASE 2: los datos viven en MySQL; aqui se consultan via la API.
 */
export const useConfigStore = defineStore('config', () => {
  const config = ref(structuredClone(DEFAULT))
  const loaded = ref(false)

  async function load(force = false) {
    if (loaded.value && !force) return
    try {
      const { data } = await api.get('/configuracion')
      if (data.data) {
        config.value = { ...structuredClone(DEFAULT), ...data.data }
      }
      loaded.value = true
    } catch {
      // Se mantiene la configuracion por defecto.
    }
  }

  async function save(payload) {
    const { data } = await api.put('/configuracion', payload)
    config.value = data.data ?? payload
  }

  async function reset() {
    await save(structuredClone(DEFAULT))
  }

  return { config, loaded, load, save, reset, DEFAULT }
})
