import axios, { AxiosError } from 'axios'
import type { APIError } from '@/types'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 segundos
})

// Request interceptor (para agregar token después cuando se implemente auth)
apiClient.interceptors.request.use(
  (config) => {
    // Futuro: agregar token JWT aquí
    // const token = localStorage.getItem('token')
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`
    // }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor (manejo de errores global)
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<APIError>) => {
    if (error.response) {
      // Error del servidor (4xx, 5xx)
      console.error('API Error:', error.response.data)
      
      // Manejar errores específicos
      if (error.response.status === 401) {
        // Futuro: redirect a login cuando se implemente auth
        // window.location.href = '/login'
      }
    } else if (error.request) {
      // Request hecho pero sin respuesta
      console.error('Network Error:', error.message)
    } else {
      // Otro tipo de error
      console.error('Error:', error.message)
    }
    
    return Promise.reject(error)
  }
)

export default apiClient
