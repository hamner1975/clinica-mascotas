import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import api from '@/services/api'

/**
 * Store de pacientes (dueños y mascotas).
 * FASE 2: los datos viven en MySQL; aqui se consultan via la API.
 */
export const usePacientesStore = defineStore('pacientes', () => {
  const duenos = ref([])
  const mascotas = ref([])
  const loading = ref(false)
  const loaded = ref(false)

  const totalDuenos = computed(() => duenos.value.length)
  const totalMascotas = computed(() => mascotas.value.length)

  async function load(force = false) {
    if (loading.value) return
    if (loaded.value && !force) return
    loading.value = true
    try {
      const [resDuenos, resMascotas] = await Promise.all([
        api.get('/duenos'),
        api.get('/mascotas'),
      ])
      duenos.value = resDuenos.data.data ?? []
      mascotas.value = resMascotas.data.data ?? []
      loaded.value = true
    } finally {
      loading.value = false
    }
  }

  const duenoById = (id) => duenos.value.find((d) => d.id === Number(id)) || null
  const mascotasByDueno = (id) => mascotas.value.filter((m) => m.duenoId === Number(id))

  function duenoNombre(id) {
    const dueno = duenoById(id)
    return dueno ? `${dueno.nombres} ${dueno.apellidos}` : 'Sin asignar'
  }

  // ---- Duenos ---------------------------------------------------------------
  async function saveDueno(payload) {
    if (payload.id) {
      const { data } = await api.put(`/duenos/${payload.id}`, payload)
      const index = duenos.value.findIndex((d) => d.id === payload.id)
      if (index !== -1) duenos.value[index] = data.data
    } else {
      const { data } = await api.post('/duenos', payload)
      duenos.value.push(data.data)
    }
  }

  async function deleteDueno(id) {
    await api.delete(`/duenos/${id}`)
    duenos.value = duenos.value.filter((d) => d.id !== id)
  }

  // ---- Mascotas -------------------------------------------------------------
  async function saveMascota(payload) {
    if (payload.id) {
      const { data } = await api.put(`/mascotas/${payload.id}`, payload)
      const index = mascotas.value.findIndex((m) => m.id === payload.id)
      if (index !== -1) mascotas.value[index] = data.data
    } else {
      const { data } = await api.post('/mascotas', payload)
      mascotas.value.push(data.data)
    }
  }

  async function deleteMascota(id) {
    await api.delete(`/mascotas/${id}`)
    mascotas.value = mascotas.value.filter((m) => m.id !== id)
  }

  return {
    duenos,
    mascotas,
    loading,
    loaded,
    totalDuenos,
    totalMascotas,
    load,
    duenoById,
    mascotasByDueno,
    duenoNombre,
    saveDueno,
    deleteDueno,
    saveMascota,
    deleteMascota,
  }
})
