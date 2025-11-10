import axios, { AxiosError } from 'axios'
import type { APIError } from '@/types'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 segundos
})

// Request interceptor - Agregar token JWT automáticamente
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Variable para evitar múltiples refresh simultáneos
let isRefreshing = false
let failedQueue: Array<{
  resolve: (value: unknown) => void
  reject: (reason?: unknown) => void
}> = []

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

// Response interceptor - Auto-refresh de tokens y manejo de errores
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<APIError>) => {
    const originalRequest = error.config as any

    if (error.response) {
      // Error 401: Token expirado, intentar refresh
      // NO intentar refresh en login, register o refresh mismo
      const skipRefreshUrls = ['/auth/login', '/auth/register', '/auth/refresh']
      const shouldSkipRefresh = skipRefreshUrls.some(url => originalRequest?.url?.includes(url))
      
      // IMPORTANTE: Solo intentar refresh UNA VEZ por request
      if (error.response.status === 401 && originalRequest && !shouldSkipRefresh && !originalRequest._retry) {
        originalRequest._retry = true // Marcar para no reintentar
        if (isRefreshing) {
          // Si ya se está refrescando, agregar a la cola
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject })
          }).then(token => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`
            }
            return apiClient(originalRequest)
          }).catch(err => Promise.reject(err))
        }

        isRefreshing = true

        const refreshToken = localStorage.getItem('refreshToken')
        if (!refreshToken) {
          processQueue(error, null)
          isRefreshing = false
          return Promise.reject(error)
        }

        try {
          // Intentar refrescar el token
          const response = await axios.post(
            `${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/auth/refresh`,
            { refreshToken }
          )

          const { accessToken, refreshToken: newRefreshToken } = response.data

          // Guardar nuevos tokens
          localStorage.setItem('accessToken', accessToken)
          localStorage.setItem('refreshToken', newRefreshToken)

          // Actualizar header del request original
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`
          }

          // Procesar la cola de requests fallidos
          processQueue(null, accessToken)

          // Reintentar el request original
          return apiClient(originalRequest)
        } catch (refreshError: any) {
          // Refresh falló, limpiar tokens
          processQueue(refreshError, null)
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          localStorage.removeItem('user')
          return Promise.reject(refreshError)
        } finally {
          isRefreshing = false
        }
      }

      // Otros errores
      console.error('API Error:', error.response.data)
    } else if (error.request) {
      console.error('Network Error:', error.message)
    } else {
      console.error('Error:', error.message)
    }
    
    return Promise.reject(error)
  }
)

export default apiClient
