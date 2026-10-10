import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { seedCitas } from '@/data/seed'
import { todayISO } from '@/utils/format'

const KEY = 'cm_citas'

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

/** Store de citas. Fase 1: localStorage. Fase 2: API PHP/MySQL. */
export const useCitasStore = defineStore('citas', () => {
  const citas = ref(load(seedCitas))

  function persist() {
    localStorage.setItem(KEY, JSON.stringify(citas.value))
  }

  const total = computed(() => citas.value.length)
  const citasHoy = computed(() => citas.value.filter((cita) => cita.fecha === todayISO()))

  /** Conteo de citas por estado (para el resumen del dashboard del modulo). */
  const resumen = computed(() => {
    const base = { Pendiente: 0, Confirmada: 0, 'En sala': 0, Atendida: 0, Cancelada: 0 }
    citas.value.forEach((cita) => {
      base[cita.estado] = (base[cita.estado] || 0) + 1
    })
    return base
  })

  function save(payload) {
    if (payload.id) {
      const index = citas.value.findIndex((cita) => cita.id === payload.id)
      if (index !== -1) citas.value[index] = { ...citas.value[index], ...payload }
    } else {
      citas.value.push({ ...payload, id: nextId(citas.value) })
    }
    persist()
  }

  function setEstado(id, estado) {
    const index = citas.value.findIndex((cita) => cita.id === id)
    if (index !== -1) {
      citas.value[index] = { ...citas.value[index], estado }
      persist()
    }
  }

  function remove(id) {
    citas.value = citas.value.filter((cita) => cita.id !== id)
    persist()
  }

  return { citas, total, citasHoy, resumen, save, setEstado, remove }
})
