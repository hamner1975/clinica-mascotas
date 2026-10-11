import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import api from '@/services/api'

/**
 * Store de usuarios del sistema.
 * FASE 2: los datos viven en MySQL; aqui se consultan via la API.
 */
export const useUsuariosStore = defineStore('usuarios', () => {
  const usuarios = ref([])
  const loading = ref(false)
  const loaded = ref(false)

  async function load(force = false) {
    if (loading.value) return
    if (loaded.value && !force) return
    loading.value = true
    try {
      const { data } = await api.get('/usuarios')
      usuarios.value = data.data ?? []
      loaded.value = true
    } finally {
      loading.value = false
    }
  }

  const total = computed(() => usuarios.value.length)
  const activos = computed(() => usuarios.value.filter((u) => u.activo).length)
  const inactivos = computed(() => usuarios.value.filter((u) => !u.activo).length)

  const byId = (id) => usuarios.value.find((u) => u.id === Number(id)) || null
  const byRol = (rolId) => usuarios.value.filter((u) => u.rolId === Number(rolId))

  async function save(payload) {
    if (payload.id) {
      const { data } = await api.put(`/usuarios/${payload.id}`, payload)
      const index = usuarios.value.findIndex((u) => u.id === payload.id)
      if (index !== -1) usuarios.value[index] = data.data
    } else {
      const { data } = await api.post('/usuarios', payload)
      usuarios.value.push(data.data)
    }
  }

  async function setActivo(id, activo) {
    const { data } = await api.put(`/usuarios/${id}/estado`, { activo })
    const index = usuarios.value.findIndex((u) => u.id === Number(id))
    if (index !== -1) usuarios.value[index] = data.data
  }

  async function remove(id) {
    await api.delete(`/usuarios/${id}`)
    usuarios.value = usuarios.value.filter((u) => u.id !== Number(id))
  }

  return { usuarios, loading, loaded, total, activos, inactivos, byId, byRol, load, save, setActivo, remove }
})
