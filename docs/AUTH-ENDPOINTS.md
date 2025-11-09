# 🔐 Authentication Endpoints

Documentación de los endpoints de autenticación para igloolab Backend API.

## Base URL
```
http://localhost:3000/api/auth
```

---

## Endpoints Disponibles

### 1. Registrar Usuario
**POST** `/api/auth/register`

Registra un nuevo usuario en el sistema.

**Request Body:**
```json
{
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "password": "Password123",
  "role": "user"
}
```

**Validaciones:**
- `nombre`: Requerido, 2-255 caracteres
- `email`: Requerido, formato email válido
- `password`: Requerido, mínimo 6 caracteres, debe contener mayúscula, minúscula y número
- `role`: Opcional, "admin" o "user" (default: "user")

**Response (201 Created):**
```json
{
  "message": "Usuario registrado exitosamente",
  "user": {
    "id": "uuid",
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "role": "user",
    "createdAt": "2024-11-09T12:00:00.000Z",
    "updatedAt": "2024-11-09T12:00:00.000Z"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `400 Bad Request` - Email ya registrado o datos inválidos
- `500 Internal Server Error` - Error del servidor

---

### 2. Iniciar Sesión
**POST** `/api/auth/login`

Autentica un usuario y devuelve tokens de acceso.

**Request Body:**
```json
{
  "email": "juan@example.com",
  "password": "Password123"
}
```

**Validaciones:**
- `email`: Requerido, formato email válido
- `password`: Requerido

**Response (200 OK):**
```json
{
  "message": "Inicio de sesión exitoso",
  "user": {
    "id": "uuid",
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "role": "user",
    "createdAt": "2024-11-09T12:00:00.000Z",
    "updatedAt": "2024-11-09T12:00:00.000Z"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `401 Unauthorized` - Credenciales inválidas
- `500 Internal Server Error` - Error del servidor

---

### 3. Refrescar Token
**POST** `/api/auth/refresh`

Obtiene un nuevo access token usando el refresh token.

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Validaciones:**
- `refreshToken`: Requerido, string válido

**Response (200 OK):**
```json
{
  "message": "Token actualizado exitosamente",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `401 Unauthorized` - Token inválido o expirado
- `500 Internal Server Error` - Error del servidor

---

### 4. Obtener Usuario Actual
**GET** `/api/auth/me`

Obtiene la información del usuario autenticado.

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Response (200 OK):**
```json
{
  "user": {
    "id": "uuid",
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "role": "user",
    "createdAt": "2024-11-09T12:00:00.000Z",
    "updatedAt": "2024-11-09T12:00:00.000Z"
  }
}
```

**Error Responses:**
- `401 Unauthorized` - No autenticado o token inválido
- `404 Not Found` - Usuario no encontrado
- `500 Internal Server Error` - Error del servidor

---

### 5. Cerrar Sesión
**POST** `/api/auth/logout`

Cierra la sesión del usuario (el cliente debe eliminar los tokens).

**Response (200 OK):**
```json
{
  "message": "Sesión cerrada exitosamente"
}
```

> **Nota:** Como los JWT son stateless, el logout se maneja en el cliente eliminando los tokens del almacenamiento local.

---

## Tokens

### Access Token
- **Duración:** 24 horas (configurable en `.env`)
- **Uso:** Autenticar requests a endpoints protegidos
- **Header:** `Authorization: Bearer <accessToken>`

### Refresh Token
- **Duración:** 7 días (configurable en `.env`)
- **Uso:** Obtener nuevos access tokens sin volver a hacer login
- **Endpoint:** `POST /api/auth/refresh`

---

## Ejemplos de Uso

### Con cURL

**Registro:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "password": "Password123",
    "role": "user"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com",
    "password": "Password123"
  }'
```

**Obtener usuario actual:**
```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Con JavaScript (Fetch)

**Registro:**
```javascript
const response = await fetch('http://localhost:3000/api/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    nombre: 'Juan Pérez',
    email: 'juan@example.com',
    password: 'Password123',
    role: 'user'
  })
});

const data = await response.json();
console.log(data.accessToken);
```

**Login:**
```javascript
const response = await fetch('http://localhost:3000/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'juan@example.com',
    password: 'Password123'
  })
});

const data = await response.json();
localStorage.setItem('accessToken', data.accessToken);
localStorage.setItem('refreshToken', data.refreshToken);
```

**Request autenticado:**
```javascript
const accessToken = localStorage.getItem('accessToken');

const response = await fetch('http://localhost:3000/api/auth/me', {
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});

const data = await response.json();
console.log(data.user);
```

### Con Axios

```javascript
import axios from 'axios';

// Configurar interceptor para agregar token automáticamente
const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api',
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Login
const login = async (email, password) => {
  const response = await apiClient.post('/auth/login', { email, password });
  localStorage.setItem('accessToken', response.data.accessToken);
  localStorage.setItem('refreshToken', response.data.refreshToken);
  return response.data;
};

// Obtener usuario actual
const getMe = async () => {
  const response = await apiClient.get('/auth/me');
  return response.data.user;
};
```

---

## Códigos de Estado HTTP

| Código | Significado |
|--------|-------------|
| 200 | OK - Solicitud exitosa |
| 201 | Created - Usuario registrado exitosamente |
| 400 | Bad Request - Datos inválidos o email ya registrado |
| 401 | Unauthorized - Credenciales inválidas o token expirado |
| 404 | Not Found - Usuario no encontrado |
| 500 | Internal Server Error - Error del servidor |

---

## Seguridad

### Password Requirements
- Mínimo 6 caracteres
- Al menos una letra mayúscula
- Al menos una letra minúscula
- Al menos un número

### Tokens
- Access Token expira en 24 horas
- Refresh Token expira en 7 días
- Los tokens se almacenan en el cliente (localStorage o httpOnly cookies)
- Usar HTTPS en producción

### Best Practices
1. **Nunca** almacenar passwords en texto plano
2. Usar HTTPS en producción
3. Regenerar tokens periódicamente
4. Implementar rate limiting en endpoints de autenticación
5. Validar y sanitizar todas las entradas

---

## Próximos Pasos

Para proteger endpoints existentes (productos, dashboard), se necesita:

1. **Crear middleware de autenticación** (`auth.middleware.ts`)
2. **Crear middleware de roles** (`role.middleware.ts`)
3. **Aplicar middlewares a rutas protegidas**

Ejemplo:
```typescript
// Proteger rutas de productos
router.post('/', authenticate, authorize(['admin']), createProduct);
router.put('/:id', authenticate, authorize(['admin']), updateProduct);
router.delete('/:id', authenticate, authorize(['admin']), deleteProduct);
```

---

## Notas

- ⚠️ El endpoint `/api/auth/me` requiere implementar el middleware de autenticación
- 🔒 Cambiar `JWT_SECRET` y `JWT_REFRESH_SECRET` en producción
- 📝 Los tokens son stateless (no se almacenan en base de datos)
- 🔄 El refresh token debe usarse cuando el access token expire
