import apiClient from './client'
import type { 
  User, 
  RegisterData, 
  LoginData, 
  AuthResponse, 
  RefreshTokenResponse, 
  MeResponse 
} from '@/types'

export const authService = {
  // Registrar nuevo usuario
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/register', data)
    return response.data
  },

  // Iniciar sesión
  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', data)
    return response.data
  },

  // Refrescar access token
  refreshToken: async (refreshToken: string): Promise<RefreshTokenResponse> => {
    const response = await apiClient.post<RefreshTokenResponse>('/auth/refresh', {
      refreshToken
    })
    return response.data
  },

  // Obtener usuario actual
  me: async (): Promise<User> => {
    const response = await apiClient.get<MeResponse>('/auth/me')
    return response.data.user
  },

  // Cerrar sesión
  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout')
  }
}
