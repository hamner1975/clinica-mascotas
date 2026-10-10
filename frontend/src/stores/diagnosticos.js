import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { seedDiagnosticos } from '@/data/seed'

const KEY = 'cm_diagnosticos'

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

/** Store del catalogo de diagnosticos. */
export const useDiagnosticosStore = defineStore('diagnosticos', () => {
  const diagnosticos = ref(load(seedDiagnosticos))

  function persist() {
    localStorage.setItem(KEY, JSON.stringify(diagnosticos.value))
  }

  const total = computed(() => diagnosticos.value.length)
  const contagiosos = computed(() => diagnosticos.value.filter((d) => d.contagioso).length)

  const listaNombres = computed(() => diagnosticos.value.map((d) => d.nombre))

  function byId(id) {
    return diagnosticos.value.find((d) => d.id === Number(id)) || null
  }

  function save(payload) {
    if (payload.id) {
      const index = diagnosticos.value.findIndex((d) => d.id === payload.id)
      if (index !== -1) diagnosticos.value[index] = { ...diagnosticos.value[index], ...payload }
    } else {
      diagnosticos.value.push({ ...payload, id: nextId(diagnosticos.value) })
    }
    persist()
  }

  function remove(id) {
    diagnosticos.value = diagnosticos.value.filter((d) => d.id !== id)
    persist()
  }

  return { diagnosticos, total, contagiosos, listaNombres, byId, save, remove }
})
