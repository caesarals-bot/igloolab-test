// Roles de usuario
export type UserRole = 'admin' | 'user'

// Usuario completo
export type User = {
  id: string
  nombre: string
  email: string
  role: UserRole
  createdAt: string
  updatedAt: string
}

// Datos para registro
export type RegisterData = {
  nombre: string
  email: string
  password: string
  role?: UserRole
}

// Datos para login
export type LoginData = {
  email: string
  password: string
}

// Respuesta de autenticación
export type AuthResponse = {
  message: string
  user: User
  accessToken: string
  refreshToken: string
}

// Respuesta de refresh token
export type RefreshTokenResponse = {
  message: string
  accessToken: string
  refreshToken: string
}

// Respuesta de /me
export type MeResponse = {
  user: User
}
