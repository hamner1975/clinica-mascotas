import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import api from '@/services/api'

/**
 * Store de roles (RBAC).
 * FASE 2: los datos viven en MySQL; aqui se consultan via la API.
 */
export const useRolesStore = defineStore('roles', () => {
  const roles = ref([])
  const loading = ref(false)
  const loaded = ref(false)

  async function load(force = false) {
    if (loading.value) return
    if (loaded.value && !force) return
    loading.value = true
    try {
      const { data } = await api.get('/roles')
      roles.value = data.data ?? []
      loaded.value = true
    } finally {
      loading.value = false
    }
  }

  const total = computed(() => roles.value.length)

  const byId = (id) => roles.value.find((rol) => rol.id === Number(id)) || null
  const nombre = (id) => byId(id)?.nombre || 'Sin rol'

  async function save(payload) {
    if (payload.id) {
      const { data } = await api.put(`/roles/${payload.id}`, payload)
      const index = roles.value.findIndex((r) => r.id === payload.id)
      if (index !== -1) roles.value[index] = data.data
    } else {
      const { data } = await api.post('/roles', payload)
      roles.value.push(data.data)
    }
  }

  async function remove(id) {
    await api.delete(`/roles/${id}`)
    roles.value = roles.value.filter((r) => r.id !== Number(id))
  }

  return { roles, loading, loaded, total, byId, nombre, load, save, remove }
})
