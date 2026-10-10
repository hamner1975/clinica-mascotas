import axios from 'axios'

/**
 * Cliente HTTP centralizado.
 * FASE 1: preparado, aun sin backend. En FASE 2 apuntara a la API PHP/MySQL
 * (por ejemplo: http://localhost/clinica_mascotas/backend/public/api).
 *
 * Configura la URL en un archivo `.env` del frontend:
 *   VITE_API_URL=http://localhost/clinica_mascotas/backend/public/api
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
})

// Adjunta el token JWT (cuando exista) en cada peticion.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('cm_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Normaliza los errores para manejarlos comodamente en las vistas.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || error.message || 'Ocurrio un error inesperado.'
    return Promise.reject({ status: error.response?.status ?? 0, message })
  },
)

export default api
