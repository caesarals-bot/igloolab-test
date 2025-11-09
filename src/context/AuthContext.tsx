import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import type { ReactNode } from 'react'
import { authService } from '@/lib/api'
import type { User, RegisterData, LoginData } from '@/types'

interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  isAuthenticated: boolean
  login: (data: LoginData) => Promise<boolean>
  register: (data: RegisterData) => Promise<boolean>
  logout: () => void
  checkAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const isAuthenticated = !!user

  // Verificar autenticación al cargar
  const checkAuth = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const accessToken = localStorage.getItem('accessToken')
      if (!accessToken) {
        setUser(null)
        return
      }

      // Obtener usuario actual
      const userData = await authService.me()
      setUser(userData)
    } catch (err: any) {
      console.error('Auth check failed:', err)
      setUser(null)
      // Limpiar tokens si falló la verificación
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
    } finally {
      setLoading(false)
    }
  }, [])

  // Verificar auth al montar
  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  // Login
  const login = useCallback(async (data: LoginData): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)

      const response = await authService.login(data)
      
      // Guardar tokens
      localStorage.setItem('accessToken', response.accessToken)
      localStorage.setItem('refreshToken', response.refreshToken)
      
      // Guardar usuario
      setUser(response.user)
      
      return true
    } catch (err: any) {
      console.error('Login failed:', err)
      const errorMessage = err.response?.data?.message || 'Error al iniciar sesión'
      setError(errorMessage)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  // Register
  const register = useCallback(async (data: RegisterData): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)

      const response = await authService.register(data)
      
      // Guardar tokens
      localStorage.setItem('accessToken', response.accessToken)
      localStorage.setItem('refreshToken', response.refreshToken)
      
      // Guardar usuario
      setUser(response.user)
      
      return true
    } catch (err: any) {
      console.error('Registration failed:', err)
      const errorMessage = err.response?.data?.message || 'Error al registrar usuario'
      setError(errorMessage)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  // Logout
  const logout = useCallback(() => {
    try {
      // Llamar endpoint de logout (opcional, ya que JWT es stateless)
      authService.logout().catch(console.error)
    } finally {
      // Limpiar estado local
      setUser(null)
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
      setError(null)
    }
  }, [])

  const value: AuthContextType = {
    user,
    loading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
    checkAuth,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
