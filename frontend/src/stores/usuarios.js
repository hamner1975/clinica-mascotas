import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { seedUsuarios } from '@/data/seed'

const KEY = 'cm_usuarios'

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

/** Store de usuarios del sistema. */
export const useUsuariosStore = defineStore('usuarios', () => {
  const usuarios = ref(load(seedUsuarios))

  function persist() {
    localStorage.setItem(KEY, JSON.stringify(usuarios.value))
  }

  const total = computed(() => usuarios.value.length)
  const activos = computed(() => usuarios.value.filter((u) => u.activo).length)
  const inactivos = computed(() => usuarios.value.filter((u) => !u.activo).length)

  function byId(id) {
    return usuarios.value.find((u) => u.id === Number(id)) || null
  }

  function byRol(rolId) {
    return usuarios.value.filter((u) => u.rolId === Number(rolId))
  }

  function save(payload) {
    if (payload.id) {
      const index = usuarios.value.findIndex((u) => u.id === payload.id)
      if (index !== -1) usuarios.value[index] = { ...usuarios.value[index], ...payload }
    } else {
      usuarios.value.push({ ...payload, id: nextId(usuarios.value), ultimoAcceso: '' })
    }
    persist()
  }

  function setActivo(id, activo) {
    const index = usuarios.value.findIndex((u) => u.id === id)
    if (index !== -1) {
      usuarios.value[index] = { ...usuarios.value[index], activo }
      persist()
    }
  }

  function remove(id) {
    usuarios.value = usuarios.value.filter((u) => u.id !== id)
    persist()
  }

  return { usuarios, total, activos, inactivos, byId, byRol, save, setActivo, remove }
})
