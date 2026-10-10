import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { seedConsultas } from '@/data/seed'

const KEY = 'cm_consultas'

function load(fallback) {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : structuredClone(fallback)
  } catch {
    return structuredClone(fallback)
  }
}

function nextId(list) {
  return list.reduce((max, item) => Math.max(max, item.id), 0) + 1
}

/** Store de consultas. Fase 1: localStorage. Fase 2: API PHP/MySQL. */
export const useConsultasStore = defineStore('consultas', () => {
  const consultas = ref(load(seedConsultas))

  function persist() {
    localStorage.setItem(KEY, JSON.stringify(consultas.value))
  }

  const total = computed(() => consultas.value.length)

  /** Consultas de una mascota (para su historia clinica). */
  function byMascota(mascotaId) {
    return consultas.value
      .filter((consulta) => consulta.mascotaId === Number(mascotaId))
      .sort((a, b) => (a.fecha < b.fecha ? 1 : -1))
  }

  function save(payload) {
    if (payload.id) {
      const index = consultas.value.findIndex((consulta) => consulta.id === payload.id)
      if (index !== -1) consultas.value[index] = { ...consultas.value[index], ...payload }
    } else {
      consultas.value.push({ ...payload, id: nextId(consultas.value) })
    }
    persist()
  }

  function remove(id) {
    consultas.value = consultas.value.filter((consulta) => consulta.id !== id)
    persist()
  }

  return { consultas, total, byMascota, save, remove }
})
