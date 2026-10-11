import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'

/**
 * Store de consultas.
 * FASE 2: los datos viven en MySQL; aqui se consultan via la API.
 */
export const useConsultasStore = defineStore('consultas', () => {
  const consultas = ref([])
  const loading = ref(false)
  const loaded = ref(false)

  async function load(force = false) {
    if (loading.value) return
    if (loaded.value && !force) return
    loading.value = true
    try {
      const { data } = await api.get('/consultas')
      consultas.value = data.data ?? []
      loaded.value = true
    } finally {
      loading.value = false
    }
  }

  /** Consultas de una mascota (para su historia clinica), mas recientes primero. */
  function byMascota(mascotaId) {
    return consultas.value
      .filter((consulta) => consulta.mascotaId === Number(mascotaId))
      .sort((a, b) => (a.fecha < b.fecha ? 1 : -1))
  }

  async function save(payload) {
    if (payload.id) {
      const { data } = await api.put(`/consultas/${payload.id}`, payload)
      const index = consultas.value.findIndex((c) => c.id === payload.id)
      if (index !== -1) consultas.value[index] = data.data
    } else {
      const { data } = await api.post('/consultas', payload)
      consultas.value.unshift(data.data)
    }
  }

  async function remove(id) {
    await api.delete(`/consultas/${id}`)
    consultas.value = consultas.value.filter((c) => c.id !== Number(id))
  }

  return { consultas, loading, loaded, load, byMascota, save, remove }
})
