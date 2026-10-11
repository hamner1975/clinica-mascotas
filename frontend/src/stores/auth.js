import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import api from '@/services/api'

const USER_KEY = 'cm_auth_user'
const TOKEN_KEY = 'cm_token'

/**
 * Store de autenticacion.
 * FASE 2: login real contra la API PHP/MySQL (token JWT).
 */
export const useAuthStore = defineStore('auth', () => {
  const user = ref(JSON.parse(localStorage.getItem(USER_KEY) || 'null'))
  const token = ref(localStorage.getItem(TOKEN_KEY) || '')

  const isAuthenticated = computed(() => !!user.value)

  const fullName = computed(() => {
    const u = user.value
    if (!u) return ''
    return `${u.nombres || ''} ${u.apellidos || ''}`.trim() || u.name || ''
  })

  const role = computed(() => user.value?.rol || user.value?.role || '')
  const email = computed(() => user.value?.email || '')
  const permisos = computed(() => user.value?.permisos || [])

  function can(permiso) {
    const list = permisos.value
    return list.includes('*') || list.includes(permiso)
  }

  const initials = computed(() => {
    const base = fullName.value || 'CM'
    const letters = base
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0]?.toUpperCase())
      .join('')
    return letters || 'CM'
  })

  async function login({ email: mail, password }) {
    const { data } = await api.post('/auth/login', { email: mail, password })
    user.value = data.user
    token.value = data.token
    localStorage.setItem(USER_KEY, JSON.stringify(data.user))
    localStorage.setItem(TOKEN_KEY, data.token)
    return data.user
  }

  async function fetchMe() {
    const { data } = await api.get('/auth/me')
    user.value = data.user
    localStorage.setItem(USER_KEY, JSON.stringify(data.user))
    return data.user
  }

  function logout() {
    user.value = null
    token.value = ''
    localStorage.removeItem(USER_KEY)
    localStorage.removeItem(TOKEN_KEY)
  }

  return { user, token, isAuthenticated, fullName, role, email, permisos, initials, can, login, fetchMe, logout }
})
