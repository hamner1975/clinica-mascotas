import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import api from '@/services/api'
import { todayISO } from '@/utils/format'

/**
 * Store de citas.
 * FASE 2: los datos viven en MySQL; aqui se consultan via la API.
 */
export const useCitasStore = defineStore('citas', () => {
  const citas = ref([])
  const loading = ref(false)
  const loaded = ref(false)

  const total = computed(() => citas.value.length)
  const citasHoy = computed(() => citas.value.filter((cita) => cita.fecha === todayISO()))

  const resumen = computed(() => {
    const base = { Pendiente: 0, Confirmada: 0, 'En sala': 0, Atendida: 0, Cancelada: 0 }
    citas.value.forEach((cita) => {
      base[cita.estado] = (base[cita.estado] || 0) + 1
    })
    return base
  })

  async function load(force = false) {
    if (loading.value) return
    if (loaded.value && !force) return
    loading.value = true
    try {
      const { data } = await api.get('/citas')
      citas.value = data.data ?? []
      loaded.value = true
    } finally {
      loading.value = false
    }
  }

  async function save(payload) {
    if (payload.id) {
      const { data } = await api.put(`/citas/${payload.id}`, payload)
      const index = citas.value.findIndex((c) => c.id === payload.id)
      if (index !== -1) citas.value[index] = data.data
    } else {
      const { data } = await api.post('/citas', payload)
      citas.value.push(data.data)
    }
  }

  async function setEstado(id, estado) {
    const cita = citas.value.find((c) => c.id === Number(id))
    if (!cita) return
    const { data } = await api.put(`/citas/${id}`, { ...cita, estado })
    const index = citas.value.findIndex((c) => c.id === Number(id))
    if (index !== -1) citas.value[index] = data.data
  }

  async function remove(id) {
    await api.delete(`/citas/${id}`)
    citas.value = citas.value.filter((c) => c.id !== Number(id))
  }

  return { citas, loading, loaded, total, citasHoy, resumen, load, save, setEstado, remove }
})
