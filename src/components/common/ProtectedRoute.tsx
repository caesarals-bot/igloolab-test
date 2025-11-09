import { Navigate } from 'react-router'
import { useAuthContext } from '@/context'
import { PageLoader } from './PageLoader'
import type { UserRole } from '@/types'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: UserRole[]
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, loading, isAuthenticated } = useAuthContext()

  // Mostrar loader mientras verifica autenticación
  if (loading) {
    return <PageLoader message="Verificando autenticación..." />
  }

  // Si no está autenticado, redirect a login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Si se especificaron roles, verificar que el usuario tenga uno permitido
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-destructive">Acceso Denegado</h1>
          <p className="text-muted-foreground">No tienes permisos para acceder a esta página</p>
          <Navigate to="/" replace />
        </div>
      </div>
    )
  }

  // Usuario autenticado y con rol permitido
  return <>{children}</>
}
