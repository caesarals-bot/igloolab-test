# 🔐 Guía de Implementación de Autenticación

**Estado Actual:** Modo Desarrollo - Todo accesible sin restricciones  
**Objetivo:** Implementar autenticación y autorización real con backend

---

## 📋 Estado Actual del Proyecto

### Modo Desarrollo Actual
- ✅ Todas las rutas accesibles sin login
- ✅ Admin accesible directamente
- ✅ Login/Register simulan autenticación y redirigen al admin
- ✅ Usuarios públicos ven Home y Productos
- ⚠️ **NO HAY VALIDACIÓN REAL** - Todo es simulado

### Rutas Actuales
```
Públicas (sin autenticación):
  / (Home)
  /productos
  /login
  /register

Admin (debería requerir autenticación):
  /admin/dashboard
  /admin/medications
  /admin/settings
```

---

## 🚀 Pasos para Implementar Autenticación Real

### **PASO 1: Crear Context de Autenticación**

**Archivo:** `src/context/AuthContext.tsx`

```typescript
import { createContext, useContext, useState, ReactNode } from "react"
import type { User } from "@/types"

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  register: (name: string, email: string, password: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  const login = async (email: string, password: string) => {
    // TODO: Llamar a tu API de backend
    // const response = await fetch('/api/auth/login', {
    //   method: 'POST',
    //   body: JSON.stringify({ email, password })
    // })
    // const data = await response.json()
    // setUser(data.user)
    // localStorage.setItem('token', data.token)
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('token')
    // TODO: Llamar a tu API para invalidar token
  }

  const register = async (name: string, email: string, password: string) => {
    // TODO: Llamar a tu API de backend
  }

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      logout,
      register
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within AuthProvider")
  return context
}
```

---

### **PASO 2: Envolver App con AuthProvider**

**Archivo:** `src/main.tsx`

```typescript
import { AuthProvider } from './context/AuthContext'

// Envolver todo con AuthProvider
<AuthProvider>
  <RouterProvider router={AppRouter} />
</AuthProvider>
```

---

### **PASO 3: Crear Componente de Rutas Protegidas**

**Archivo:** `src/components/ProtectedRoute.tsx`

```typescript
import { Navigate } from "react-router"
import { useAuth } from "@/context/AuthContext"

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    // Redirigir a login si no está autenticado
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
```

---

### **PASO 4: Actualizar LoginPage.tsx**

```typescript
import { useAuth } from "@/context/AuthContext"

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      await login(email, password)
      navigate("/admin/dashboard")
    } catch (err) {
      setError("Credenciales inválidas")
    }
  }

  // Resto del componente...
}
```

---

### **PASO 5: Actualizar RegisterPage.tsx**

Similar a LoginPage, usar `useAuth()` y llamar a `register()`.

---

### **PASO 6: Proteger Rutas de Admin en Router**

**Archivo:** `src/router/AppRouter.tsx`

```typescript
import { ProtectedRoute } from "@/components/ProtectedRoute"

const AppRouter = createBrowserRouter([
  // Rutas públicas sin cambios
  {
    path: "/",
    element: <LayoutPage />,
    children: [...]
  },
  
  // Rutas de auth sin cambios
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  
  // Rutas protegidas del admin
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/admin/dashboard",
        element: <DashboardPage />
      },
      {
        path: "/admin/medications",
        element: <MedicationsPage />
      },
      {
        path: "/admin/settings",
        element: <SettingsPage />
      }
    ]
  }
])
```

---

### **PASO 7: Actualizar AdminLayout para Logout Real**

**Archivo:** `src/admin/layout/AdminLayout.tsx`

```typescript
import { useAuth } from "@/context/AuthContext"
import { useNavigate } from "react-router"

const AdminLayout = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  // En el botón de logout:
  <Button onClick={handleLogout}>
    <LogOut className="w-5 h-5" />
    Cerrar Sesión
  </Button>

  // Usar user real en lugar de mockUser:
  <p className="text-sm font-medium text-foreground truncate">
    {user?.nombre}
  </p>
}
```

---

### **PASO 8: Actualizar LayoutPage para Usuario Logueado**

**Archivo:** `src/app/layout/LayoutPage.tsx`

```typescript
import { useAuth } from "@/context/AuthContext"

const LayoutPage = () => {
  const { user } = useAuth()

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={user} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
```

---

### **PASO 9: Integración con Backend**

#### API Endpoints Necesarios:

```
POST /api/auth/register
  Body: { name, email, password }
  Response: { user, token }

POST /api/auth/login
  Body: { email, password }
  Response: { user, token }

POST /api/auth/logout
  Headers: { Authorization: "Bearer <token>" }
  Response: { success: true }

GET /api/auth/me
  Headers: { Authorization: "Bearer <token>" }
  Response: { user }
```

#### Axios Interceptor para Token:

```typescript
// src/lib/axios.ts
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
```

---

### **PASO 10: Persistencia de Sesión**

En `AuthProvider`, verificar token al cargar:

```typescript
useEffect(() => {
  const token = localStorage.getItem('token')
  if (token) {
    // Verificar si el token es válido
    fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => setUser(data.user))
    .catch(() => {
      localStorage.removeItem('token')
    })
  }
}, [])
```

---

## 🔒 Seguridad Adicional

### Variables de Entorno
```env
VITE_API_URL=http://localhost:3000
```

### Protección CSRF
- Implementar tokens CSRF en formularios
- Validar en backend

### Refresh Tokens
- Implementar refresh token mechanism
- Renovar token antes de expiración

### Rate Limiting
- Limitar intentos de login
- Bloquear después de X intentos fallidos

---

## ✅ Checklist de Implementación

Cuando estés listo para implementar autenticación real:

- [ ] Crear `AuthContext.tsx`
- [ ] Crear `ProtectedRoute.tsx`
- [ ] Actualizar `main.tsx` con AuthProvider
- [ ] Actualizar `LoginPage.tsx` con lógica real
- [ ] Actualizar `RegisterPage.tsx` con lógica real
- [ ] Proteger rutas de admin en router
- [ ] Actualizar `AdminLayout.tsx` para logout real
- [ ] Actualizar `LayoutPage.tsx` para usar contexto
- [ ] Configurar axios con interceptors
- [ ] Implementar endpoints en backend
- [ ] Configurar variables de entorno
- [ ] Testing de flujos de autenticación
- [ ] Implementar refresh tokens
- [ ] Agregar rate limiting

---

## 📝 Notas Importantes

1. **No commitear tokens** - Usar variables de entorno
2. **HTTPS en producción** - Obligatorio para tokens
3. **Validar en backend** - Frontend puede ser manipulado
4. **Expiración de tokens** - Implementar tiempo de expiración
5. **Manejo de errores** - Mostrar mensajes claros al usuario

---

**Última actualización:** Modo Desarrollo  
**Próximo paso:** Backend + Implementación de estos pasos
