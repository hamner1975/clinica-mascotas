import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { seedRoles } from '@/data/seed'

const KEY = 'cm_roles'

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

/** Store de roles (RBAC). */
export const useRolesStore = defineStore('roles', () => {
  const roles = ref(load(seedRoles))

  function persist() {
    localStorage.setItem(KEY, JSON.stringify(roles.value))
  }

  const total = computed(() => roles.value.length)

  function byId(id) {
    return roles.value.find((rol) => rol.id === Number(id)) || null
  }

  function nombre(id) {
    return byId(id)?.nombre || 'Sin rol'
  }

  function save(payload) {
    if (payload.id) {
      const index = roles.value.findIndex((rol) => rol.id === payload.id)
      if (index !== -1) roles.value[index] = { ...roles.value[index], ...payload }
    } else {
      roles.value.push({ ...payload, id: nextId(roles.value), sistema: false })
    }
    persist()
  }

  /** No se puede eliminar un rol de sistema. Devuelve true si elimino. */
  function remove(id) {
    const rol = byId(id)
    if (!rol || rol.sistema) return false
    roles.value = roles.value.filter((r) => r.id !== id)
    persist()
    return true
  }

  return { roles, total, byId, nombre, save, remove }
})
