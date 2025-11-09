# 🔐 Guía de Autenticación JWT - Frontend

Guía completa de implementación y uso del sistema de autenticación JWT en el frontend de igloolab.

---

## 📋 Resumen

El frontend ahora tiene un sistema completo de autenticación JWT que se integra con el backend para:
- ✅ Registro de nuevos usuarios
- ✅ Inicio de sesión
- ✅ Renovación automática de tokens
- ✅ Protección de rutas privadas
- ✅ Persistencia de sesión
- ✅ Logout seguro

---

## 🚀 Inicio Rápido

### 1. Asegúrate que el Backend Esté Corriendo

```bash
# En el directorio del backend
npm run dev

# Debe estar en http://localhost:3000
```

### 2. Inicia el Frontend

```bash
# En el directorio del frontend
npm run dev

# Debe estar en http://localhost:5173
```

### 3. Prueba el Sistema

1. **Ir a Register**: `http://localhost:5173/register`
2. **Crear cuenta**:
   - Nombre: Test User
   - Email: test@example.com
   - Contraseña: Test123 (mayúscula + minúscula + número)
3. **Serás redirigido automáticamente** al dashboard
4. **Logout** desde el sidebar
5. **Login** en `http://localhost:5173/login`

---

## 🏗️ Arquitectura

### Flujo de Autenticación

```
┌─────────────┐
│   Usuario   │
└──────┬──────┘
       │
       │ 1. Login/Register
       ▼
┌─────────────────┐
│   LoginPage /   │
│   RegisterPage  │
└────────┬────────┘
         │
         │ 2. Llama AuthContext
         ▼
┌─────────────────┐
│   AuthContext   │
└────────┬────────┘
         │
         │ 3. Llama auth.service
         ▼
┌─────────────────┐
│  auth.service   │ ──► 4. POST /api/auth/login
└────────┬────────┘      (Axios con interceptors)
         │
         │ 5. Tokens + User data
         ▼
┌─────────────────┐
│  localStorage   │
│ + AuthContext   │
└────────┬────────┘
         │
         │ 6. Redirect
         ▼
┌─────────────────┐
│ ProtectedRoute  │ ──► /admin/dashboard
│   (verificado)  │
└─────────────────┘
```

---

## 📁 Estructura de Archivos

```
src/
├── lib/api/
│   ├── auth.service.ts          # Llamadas API de autenticación
│   └── client.ts                # Axios con interceptors JWT
├── context/
│   ├── AuthContext.tsx          # Estado global de auth
│   └── index.tsx                # Export de contextos
├── components/common/
│   └── ProtectedRoute.tsx       # HOC para rutas privadas
├── auth/
│   ├── LoginPage.tsx            # Página de login
│   └── RegisterPage.tsx         # Página de registro
└── types/
    └── user.types.ts            # Tipos de autenticación
```

---

## 🔧 Componentes Principales

### 1. **auth.service.ts**

Servicio para llamadas API:

```typescript
import { authService } from '@/lib/api'

// Register
const response = await authService.register({
  nombre: 'Juan Pérez',
  email: 'juan@example.com',
  password: 'Password123',
  role: 'user' // opcional, default: 'user'
})

// Login
const response = await authService.login({
  email: 'juan@example.com',
  password: 'Password123'
})

// Get current user
const user = await authService.me()

// Refresh token
const tokens = await authService.refreshToken(refreshToken)

// Logout
await authService.logout()
```

### 2. **AuthContext**

Estado global de autenticación:

```typescript
import { useAuthContext } from '@/context'

function MyComponent() {
  const { user, loading, error, isAuthenticated, login, register, logout } = useAuthContext()
  
  // Verificar si está autenticado
  if (!isAuthenticated) {
    return <div>Por favor inicia sesión</div>
  }
  
  // Mostrar información del usuario
  return (
    <div>
      <p>Bienvenido, {user.nombre}</p>
      <p>Email: {user.email}</p>
      <p>Rol: {user.role}</p>
      <button onClick={logout}>Cerrar Sesión</button>
    </div>
  )
}
```

### 3. **ProtectedRoute**

Proteger rutas privadas:

```typescript
import { ProtectedRoute } from '@/components/common/ProtectedRoute'

// En el router
{
  path: "/admin",
  element: (
    <ProtectedRoute allowedRoles={['admin', 'user']}>
      <AdminLayout />
    </ProtectedRoute>
  )
}

// Solo admin
<ProtectedRoute allowedRoles={['admin']}>
  <AdminOnlyComponent />
</ProtectedRoute>
```

---

## 🔐 Interceptores de Axios

Los interceptores se configuran automáticamente en `client.ts`:

### Request Interceptor

Agrega el token JWT automáticamente a cada request:

```typescript
// Se ejecuta automáticamente
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

### Response Interceptor

Maneja la renovación automática de tokens:

```typescript
// Detecta error 401 (token expirado)
// Intenta refresh automáticamente
// Si falla, redirect a /login
```

**Ventaja**: No necesitas preocuparte por tokens expirados, se renuevan automáticamente.

---

## 💾 Persistencia de Sesión

Los tokens se guardan en `localStorage`:

```javascript
// Guardado automático después de login/register
localStorage.setItem('accessToken', token)
localStorage.setItem('refreshToken', refreshToken)

// Verificación automática al cargar la app
useEffect(() => {
  checkAuth() // Verifica si hay token válido
}, [])

// Limpiado automático después de logout
localStorage.removeItem('accessToken')
localStorage.removeItem('refreshToken')
```

---

## 🎨 Páginas de Autenticación

### LoginPage

**Ubicación**: `src/auth/LoginPage.tsx`

**Características**:
- Formulario con email y contraseña
- Validación de campos
- Spinner de carga
- Mensajes de error
- Link a registro
- Redirect a dashboard después de login

**Uso**:
```
http://localhost:5173/login
```

### RegisterPage

**Ubicación**: `src/auth/RegisterPage.tsx`

**Características**:
- Formulario completo (nombre, email, password, confirm password)
- Validación de contraseña:
  - Mínimo 6 caracteres
  - Al menos una mayúscula
  - Al menos una minúscula
  - Al menos un número
- Confirmación de contraseña
- Spinner de carga
- Mensajes de error
- Link a login
- Redirect a dashboard después de registro

**Uso**:
```
http://localhost:5173/register
```

---

## 🛡️ Seguridad

### Password Requirements

El frontend valida:
- ✅ Mínimo 6 caracteres
- ✅ Al menos una mayúscula
- ✅ Al menos una minúscula
- ✅ Al menos un número

Regex usado:
```typescript
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/
```

### Tokens

- **Access Token**: Expira en 24 horas
- **Refresh Token**: Expira en 7 días
- Almacenados en `localStorage` (considera `httpOnly cookies` en producción)

### Renovación Automática

El sistema detecta cuando el access token expira (error 401) y:
1. Usa el refresh token para obtener nuevos tokens
2. Guarda los nuevos tokens
3. Reintenta el request original automáticamente
4. Si el refresh falla, hace logout y redirect a /login

---

## 🔄 Flujo Detallado

### 1. Registro

```
Usuario en RegisterPage
  ↓
Llena formulario
  ↓
Validación frontend
  ↓
POST /api/auth/register
  ↓
Backend valida y crea usuario
  ↓
Devuelve user + tokens
  ↓
Guarda tokens en localStorage
  ↓
Actualiza AuthContext
  ↓
Redirect a /admin/dashboard
```

### 2. Login

```
Usuario en LoginPage
  ↓
Ingresa email y password
  ↓
POST /api/auth/login
  ↓
Backend valida credenciales
  ↓
Devuelve user + tokens
  ↓
Guarda tokens en localStorage
  ↓
Actualiza AuthContext
  ↓
Redirect a /admin/dashboard
```

### 3. Request Protegido

```
Usuario autenticado intenta acceder a /admin/medications
  ↓
ProtectedRoute verifica isAuthenticated
  ↓
Axios agrega Bearer token al header
  ↓
GET /api/products (con token)
  ↓
Backend valida token
  ↓
Devuelve datos
```

### 4. Token Expirado

```
Request con token expirado
  ↓
Backend devuelve 401
  ↓
Interceptor detecta 401
  ↓
POST /api/auth/refresh (con refresh token)
  ↓
Backend devuelve nuevos tokens
  ↓
Guarda nuevos tokens
  ↓
Reintenta request original
  ↓
Request exitoso
```

### 5. Refresh Token Expirado

```
Request con token expirado
  ↓
Backend devuelve 401
  ↓
Interceptor intenta refresh
  ↓
POST /api/auth/refresh (con refresh token expirado)
  ↓
Backend devuelve 401
  ↓
Limpia localStorage
  ↓
Actualiza AuthContext (user = null)
  ↓
Redirect a /login
```

---

## 🧪 Testing

### Prueba Manual

#### 1. Registro

```bash
# 1. Ir a http://localhost:5173/register
# 2. Llenar formulario:
Nombre: Test User
Email: test@igloolab.com
Password: Test123
Confirm Password: Test123

# 3. Clic en "Crear Cuenta"
# 4. Verificar redirect a /admin/dashboard
# 5. Verificar que aparece el nombre en el sidebar
```

#### 2. Login

```bash
# 1. Hacer logout desde el sidebar
# 2. Ir a http://localhost:5173/login
# 3. Ingresar credenciales:
Email: test@igloolab.com
Password: Test123

# 4. Clic en "Iniciar Sesión"
# 5. Verificar redirect a /admin/dashboard
```

#### 3. Rutas Protegidas

```bash
# 1. Hacer logout
# 2. Intentar acceder a http://localhost:5173/admin/dashboard
# 3. Verificar redirect automático a /login
# 4. Hacer login
# 5. Verificar acceso exitoso a /admin/dashboard
```

#### 4. Persistencia de Sesión

```bash
# 1. Hacer login
# 2. Recargar la página (F5)
# 3. Verificar que sigue autenticado
# 4. Cerrar pestaña y volver a abrir
# 5. Ir a http://localhost:5173/admin/dashboard
# 6. Verificar que sigue autenticado
```

### Verificar Tokens en DevTools

```javascript
// Abrir consola del navegador (F12)

// Ver tokens
localStorage.getItem('accessToken')
localStorage.getItem('refreshToken')

// Limpiar tokens (forzar logout)
localStorage.clear()
```

---

## 🐛 Troubleshooting

### Error: "Network Error"

**Causa**: Backend no está corriendo.

**Solución**:
```bash
cd backend
npm run dev
```

### Error: "Email ya registrado"

**Causa**: Email ya existe en la base de datos.

**Solución**: Usar otro email o eliminar el usuario de la BD.

### Error: "Credenciales inválidas"

**Causa**: Email o contraseña incorrectos.

**Solución**: Verificar credenciales o registrar un nuevo usuario.

### Usuario no aparece en sidebar después de login

**Causa**: AuthContext no se actualizó.

**Solución**: Verificar que `AuthProvider` está en `AppProviders`.

### Redirect a /login después de cada refresh

**Causa**: Refresh token expirado o inválido.

**Solución**: Hacer login nuevamente. Los refresh tokens expiran en 7 días.

### CORS Error

**Causa**: Backend no acepta requests del frontend.

**Solución**: Verificar configuración CORS en el backend:
```typescript
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))
```

---

## 📚 Documentación Relacionada

- [AUTH-ENDPOINTS.md](./AUTH-ENDPOINTS.md) - Documentación de endpoints del backend
- [AUTH-SETUP.md](./AUTH-SETUP.md) - Setup del backend
- [README.md](../README.md) - Documentación general del proyecto

---

## 🎯 Próximos Pasos

### Opcional - Mejoras Futuras

1. **HTTP-Only Cookies** (más seguro que localStorage)
   ```typescript
   // En lugar de localStorage
   // Usar cookies httpOnly desde el backend
   ```

2. **Remember Me**
   ```typescript
   // Opción para extender duración de tokens
   <input type="checkbox" id="rememberMe" />
   ```

3. **Forgot Password**
   ```typescript
   // Implementar reset de contraseña
   POST /api/auth/forgot-password
   POST /api/auth/reset-password
   ```

4. **Email Verification**
   ```typescript
   // Verificar email después de registro
   POST /api/auth/verify-email
   ```

5. **Two-Factor Authentication (2FA)**
   ```typescript
   // Agregar capa extra de seguridad
   POST /api/auth/2fa/enable
   POST /api/auth/2fa/verify
   ```

---

## ✅ Checklist de Implementación

- [x] auth.service.ts creado
- [x] AuthContext implementado
- [x] Interceptores de Axios configurados
- [x] LoginPage actualizado
- [x] RegisterPage actualizado
- [x] ProtectedRoute creado
- [x] Rutas de admin protegidas
- [x] AdminLayout con user info y logout
- [x] Tipos TypeScript actualizados
- [x] Persistencia de sesión
- [x] Auto-refresh de tokens
- [x] Manejo de errores
- [x] Loading states
- [x] Validaciones de contraseña
- [x] Documentación completa

---

**🎉 Sistema de Autenticación JWT Completamente Implementado**

El frontend ahora tiene un sistema robusto y seguro de autenticación que se integra perfectamente con el backend.
