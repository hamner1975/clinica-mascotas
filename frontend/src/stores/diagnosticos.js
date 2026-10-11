import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import api from '@/services/api'

/**
 * Store del catalogo de diagnosticos.
 * FASE 2: los datos viven en MySQL; aqui se consultan via la API.
 */
export const useDiagnosticosStore = defineStore('diagnosticos', () => {
  const diagnosticos = ref([])
  const loading = ref(false)
  const loaded = ref(false)

  async function load(force = false) {
    if (loading.value) return
    if (loaded.value && !force) return
    loading.value = true
    try {
      const { data } = await api.get('/diagnosticos')
      diagnosticos.value = data.data ?? []
      loaded.value = true
    } finally {
      loading.value = false
    }
  }

  const total = computed(() => diagnosticos.value.length)
  const contagiosos = computed(() => diagnosticos.value.filter((d) => d.contagioso).length)

  const listaNombres = computed(() => diagnosticos.value.map((d) => d.nombre))

  const byId = (id) => diagnosticos.value.find((d) => d.id === Number(id)) || null

  async function save(payload) {
    if (payload.id) {
      const { data } = await api.put(`/diagnosticos/${payload.id}`, payload)
      const index = diagnosticos.value.findIndex((d) => d.id === payload.id)
      if (index !== -1) diagnosticos.value[index] = data.data
    } else {
      const { data } = await api.post('/diagnosticos', payload)
      diagnosticos.value.push(data.data)
    }
  }

  async function remove(id) {
    await api.delete(`/diagnosticos/${id}`)
    diagnosticos.value = diagnosticos.value.filter((d) => d.id !== Number(id))
  }

  return { diagnosticos, loading, loaded, total, contagiosos, listaNombres, byId, load, save, remove }
})
