import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

const STORAGE_KEY = 'cm_auth_user'

/**
 * Store de autenticacion.
 * FASE 1: login SIMULADO (cualquier correo + contrasena de 6+ caracteres).
 * FASE 2: se reemplaza `login()` por una llamada real a la API PHP/MySQL.
 */
export const useAuthStore = defineStore('auth', () => {
  const user = ref(JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'))

  const isAuthenticated = computed(() => !!user.value)
  const fullName = computed(() => user.value?.name ?? '')
  const role = computed(() => user.value?.role ?? '')
  const email = computed(() => user.value?.email ?? '')

  const initials = computed(() => {
    const name = user.value?.name ?? ''
    const letters = name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0]?.toUpperCase())
      .join('')
    return letters || 'CM'
  })

  function login({ email: mail }) {
    const isAdmin = /admin/i.test(mail)
    user.value = {
      name: isAdmin ? 'Dra. Ana Ramirez' : 'Usuario Demo',
      email: mail,
      role: isAdmin ? 'Administrador' : 'Personal',
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user.value))
    return user.value
  }

  function logout() {
    user.value = null
    localStorage.removeItem(STORAGE_KEY)
  }

  return { user, isAuthenticated, fullName, role, email, initials, login, logout }
})
