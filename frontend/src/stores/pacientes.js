import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { seedDuenos, seedMascotas } from '@/data/seed'

const DUENOS_KEY = 'cm_duenos'
const MASCOTAS_KEY = 'cm_mascotas'

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : structuredClone(fallback)
  } catch {
    return structuredClone(fallback)
  }
}

function nextId(list) {
  return list.reduce((max, item) => Math.max(max, item.id), 0) + 1
}

/**
 * Store de pacientes: dueños (tutores) y mascotas.
 * Fase 1: datos en localStorage. Fase 2: API PHP/MySQL.
 */
export const usePacientesStore = defineStore('pacientes', () => {
  const duenos = ref(load(DUENOS_KEY, seedDuenos))
  const mascotas = ref(load(MASCOTAS_KEY, seedMascotas))

  function persist() {
    localStorage.setItem(DUENOS_KEY, JSON.stringify(duenos.value))
    localStorage.setItem(MASCOTAS_KEY, JSON.stringify(mascotas.value))
  }

  const totalDuenos = computed(() => duenos.value.length)
  const totalMascotas = computed(() => mascotas.value.length)

  function duenoById(id) {
    return duenos.value.find((dueno) => dueno.id === Number(id)) || null
  }

  function mascotasByDueno(id) {
    return mascotas.value.filter((mascota) => mascota.duenoId === Number(id))
  }

  /** Devuelve el nombre completo del dueño o un texto por defecto. */
  function duenoNombre(id) {
    const dueno = duenoById(id)
    return dueno ? `${dueno.nombres} ${dueno.apellidos}` : 'Sin asignar'
  }

  // ---- Duenos ---------------------------------------------------------------
  function saveDueno(payload) {
    if (payload.id) {
      const index = duenos.value.findIndex((dueno) => dueno.id === payload.id)
      if (index !== -1) duenos.value[index] = { ...duenos.value[index], ...payload }
    } else {
      duenos.value.push({ ...payload, id: nextId(duenos.value) })
    }
    persist()
  }

  function deleteDueno(id) {
    duenos.value = duenos.value.filter((dueno) => dueno.id !== id)
    persist()
  }

  // ---- Mascotas -------------------------------------------------------------
  function saveMascota(payload) {
    if (payload.id) {
      const index = mascotas.value.findIndex((mascota) => mascota.id === payload.id)
      if (index !== -1) mascotas.value[index] = { ...mascotas.value[index], ...payload }
    } else {
      mascotas.value.push({ ...payload, id: nextId(mascotas.value) })
    }
    persist()
  }

  function deleteMascota(id) {
    mascotas.value = mascotas.value.filter((mascota) => mascota.id !== id)
    persist()
  }

  return {
    duenos,
    mascotas,
    totalDuenos,
    totalMascotas,
    duenoById,
    mascotasByDueno,
    duenoNombre,
    saveDueno,
    deleteDueno,
    saveMascota,
    deleteMascota,
  }
})
