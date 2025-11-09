# 🔗 Plan de Integración Frontend-Backend - igloolab

**Frontend:** React 19 + TypeScript + Vite v0.2.0  
**Backend:** Node.js + Express + TypeORM + PostgreSQL  
**Estado:** Frontend con mockData, listo para conectar con API real

---

## 📊 Estado Actual del Frontend

### ✅ Ya Tenemos
- React 19.1.1 + TypeScript 5.9.3 + Vite 7
- Tipos en `src/types/` (User, Product)
- Componentes admin completos (ProductForm, ProductTable)
- Páginas: Dashboard, Medications, Settings, Products
- Layouts: LayoutPage, AdminLayout
- Mock data en `src/data/mockData.ts`
- 8 rutas configuradas

### ❌ Nos Falta
- Integración con API real
- Axios configurado
- Hooks para llamadas API
- Servicios de API
- Manejo de loading/error states
- Variables de entorno

---

## 🎯 Plan de Integración - 7 Fases

### **FASE 1: Setup Inicial** ⏱️ 30 min

#### 1.1 Instalar Dependencias
```bash
npm install axios
```

#### 1.2 Configurar Variables de Entorno
**Archivo:** `.env` (crear en raíz)
```env
VITE_API_URL=http://localhost:3000/api
VITE_ENV=development
```

**Archivo:** `.env.example` (documentar)
```env
VITE_API_URL=http://localhost:3000/api
VITE_ENV=development
```

#### 1.3 Actualizar .gitignore
```gitignore
# Environment
.env
.env.local
.env.development
.env.production
```

---

### **FASE 2: Actualizar Types** ⏱️ 20 min

#### 2.1 Actualizar Product Type
**Archivo:** `src/types/product.types.ts`

```typescript
// Tipo base del producto (respuesta del backend)
export type Product = {
  id: string
  nombre: string
  precio: number
  descripcion: string
  fechaElaboracion: string  // ISO 8601
  fechaVencimiento: string   // ISO 8601
  imagen?: string
  createdAt: string          // ✅ AGREGAR
  updatedAt: string          // ✅ AGREGAR
}

// DTO para crear producto
export type CreateProductDTO = {
  nombre: string
  precio: number
  descripcion: string
  fechaElaboracion: string
  fechaVencimiento: string
  imagen?: string
}

// DTO para actualizar producto
export type UpdateProductDTO = {
  nombre?: string
  precio?: number
  descripcion?: string
  fechaElaboracion?: string
  fechaVencimiento?: string
  imagen?: string
}

// Respuesta de lista de productos con paginación
export type ProductsResponse = {
  products: Product[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

// Respuesta de un solo producto
export type ProductResponse = {
  product: Product
}
```

#### 2.2 Crear Dashboard Types
**Archivo:** `src/types/dashboard.types.ts` (NUEVO)

```typescript
export type DashboardStats = {
  totalProducts: number
  totalInventoryValue: number
  averagePrice: number
  expiringProducts: number
  expiringProductsList: ExpiringProduct[]
}

export type ExpiringProduct = {
  id: string
  nombre: string
  fechaVencimiento: string
  daysUntilExpiry: number
}

export type ExpiryStatus = {
  expired: number
  expiringSoon: number
  valid: number
}

export type DashboardStatsResponse = {
  stats: DashboardStats
}

export type ExpiryStatusResponse = {
  expiryStatus: ExpiryStatus
}
```

#### 2.3 Crear Error Types
**Archivo:** `src/types/error.types.ts` (NUEVO)

```typescript
export type APIError = {
  error: string
  message: string
  errors?: Array<{
    field: string
    message: string
  }>
}
```

#### 2.4 Actualizar Barrel Export
**Archivo:** `src/types/index.ts`

```typescript
export * from './user.types'
export * from './product.types'
export * from './dashboard.types'  // ✅ AGREGAR
export * from './error.types'      // ✅ AGREGAR
```

---

### **FASE 3: Configurar API Client** ⏱️ 30 min

#### 3.1 Crear API Client
**Archivo:** `src/lib/api/client.ts` (NUEVO)

```typescript
import axios, { AxiosError } from 'axios'
import type { APIError } from '@/types'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 segundos
})

// Request interceptor (para agregar token después en Fase 5)
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
        // Futuro: redirect a login
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
```

---

### **FASE 4: Crear Servicios de API** ⏱️ 45 min

#### 4.1 Servicio de Productos
**Archivo:** `src/lib/api/products.service.ts` (NUEVO)

```typescript
import apiClient from './client'
import type {
  Product,
  ProductsResponse,
  ProductResponse,
  CreateProductDTO,
  UpdateProductDTO,
} from '@/types'

export const productsService = {
  // Listar productos con paginación y filtros
  getAll: async (params?: {
    page?: number
    limit?: number
    search?: string
    sortBy?: 'nombre' | 'precio' | 'fechaElaboracion' | 'fechaVencimiento' | 'createdAt'
    order?: 'asc' | 'desc'
  }): Promise<ProductsResponse> => {
    const response = await apiClient.get<ProductsResponse>('/products', { params })
    return response.data
  },

  // Obtener producto por ID
  getById: async (id: string): Promise<Product> => {
    const response = await apiClient.get<ProductResponse>(`/products/${id}`)
    return response.data.product
  },

  // Crear producto
  create: async (data: CreateProductDTO): Promise<Product> => {
    const response = await apiClient.post<ProductResponse>('/products', data)
    return response.data.product
  },

  // Actualizar producto
  update: async (id: string, data: UpdateProductDTO): Promise<Product> => {
    const response = await apiClient.put<ProductResponse>(`/products/${id}`, data)
    return response.data.product
  },

  // Eliminar producto
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/products/${id}`)
  },
}
```

#### 4.2 Servicio de Dashboard
**Archivo:** `src/lib/api/dashboard.service.ts` (NUEVO)

```typescript
import apiClient from './client'
import type {
  DashboardStats,
  DashboardStatsResponse,
  ExpiryStatus,
  ExpiryStatusResponse,
} from '@/types'

export const dashboardService = {
  // Obtener estadísticas del dashboard
  getStats: async (): Promise<DashboardStats> => {
    const response = await apiClient.get<DashboardStatsResponse>('/dashboard/stats')
    return response.data.stats
  },

  // Obtener estado de vencimientos
  getExpiryStatus: async (): Promise<ExpiryStatus> => {
    const response = await apiClient.get<ExpiryStatusResponse>('/dashboard/expiry-status')
    return response.data.expiryStatus
  },
}
```

#### 4.3 Barrel Export de Servicios
**Archivo:** `src/lib/api/index.ts` (NUEVO)

```typescript
export { default as apiClient } from './client'
export * from './products.service'
export * from './dashboard.service'
```

---

### **FASE 5: Crear Custom Hooks** ⏱️ 1 hora

#### 5.1 Hook para Productos
**Archivo:** `src/hooks/useProducts.ts` (NUEVO)

```typescript
import { useState, useEffect } from 'react'
import { productsService } from '@/lib/api'
import type { Product, ProductsResponse } from '@/types'

interface UseProductsOptions {
  page?: number
  limit?: number
  search?: string
  sortBy?: 'nombre' | 'precio' | 'fechaElaboracion' | 'fechaVencimiento' | 'createdAt'
  order?: 'asc' | 'desc'
  autoFetch?: boolean
}

export const useProducts = (options: UseProductsOptions = {}) => {
  const {
    page = 1,
    limit = 10,
    search = '',
    sortBy = 'nombre',
    order = 'asc',
    autoFetch = true,
  } = options

  const [products, setProducts] = useState<Product[]>([])
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await productsService.getAll({ page, limit, search, sortBy, order })
      setProducts(data.products)
      setPagination(data.pagination)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar productos')
      console.error('Error fetching products:', err)
    } finally {
      setLoading(false)
    }
  }

  const refetch = () => {
    fetchProducts()
  }

  useEffect(() => {
    if (autoFetch) {
      fetchProducts()
    }
  }, [page, limit, search, sortBy, order])

  return {
    products,
    pagination,
    loading,
    error,
    refetch,
  }
}
```

#### 5.2 Hook para Dashboard
**Archivo:** `src/hooks/useDashboard.ts` (NUEVO)

```typescript
import { useState, useEffect } from 'react'
import { dashboardService } from '@/lib/api'
import type { DashboardStats } from '@/types'

export const useDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await dashboardService.getStats()
      setStats(data)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar estadísticas')
      console.error('Error fetching dashboard stats:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  }
}
```

#### 5.3 Hook para Crear/Actualizar Producto
**Archivo:** `src/hooks/useProductMutations.ts` (NUEVO)

```typescript
import { useState } from 'react'
import { productsService } from '@/lib/api'
import type { CreateProductDTO, UpdateProductDTO, Product } from '@/types'

export const useProductMutations = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createProduct = async (data: CreateProductDTO): Promise<Product | null> => {
    try {
      setLoading(true)
      setError(null)
      const product = await productsService.create(data)
      return product
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al crear producto')
      console.error('Error creating product:', err)
      return null
    } finally {
      setLoading(false)
    }
  }

  const updateProduct = async (id: string, data: UpdateProductDTO): Promise<Product | null> => {
    try {
      setLoading(true)
      setError(null)
      const product = await productsService.update(id, data)
      return product
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al actualizar producto')
      console.error('Error updating product:', err)
      return null
    } finally {
      setLoading(false)
    }
  }

  const deleteProduct = async (id: string): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      await productsService.delete(id)
      return true
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al eliminar producto')
      console.error('Error deleting product:', err)
      return false
    } finally {
      setLoading(false)
    }
  }

  return {
    createProduct,
    updateProduct,
    deleteProduct,
    loading,
    error,
  }
}
```

#### 5.4 Barrel Export de Hooks
**Archivo:** `src/hooks/index.ts` (NUEVO)

```typescript
export * from './useProducts'
export * from './useDashboard'
export * from './useProductMutations'
```

---

### **FASE 6: Actualizar Componentes** ⏱️ 2 horas

#### 6.1 Actualizar ProductsPage (Catálogo Público)
**Archivo:** `src/app/products/ProductsPage.tsx`

**Cambios:**
- ❌ Eliminar: `import { mockProducts } from '@/data/mockData'`
- ✅ Agregar: `import { useProducts } from '@/hooks'`
- ✅ Usar hook: `const { products, loading, error } = useProducts({ limit: 20 })`
- ✅ Agregar estados de loading y error

#### 6.2 Actualizar DashboardPage
**Archivo:** `src/admin/page/DashboardPage.tsx`

**Cambios:**
- ❌ Eliminar: Datos hardcodeados
- ✅ Agregar: `import { useDashboard } from '@/hooks'`
- ✅ Usar hook: `const { stats, loading, error } = useDashboard()`
- ✅ Actualizar stats cards con datos reales

#### 6.3 Actualizar MedicationsPage
**Archivo:** `src/admin/page/MedicationsPage.tsx`

**Cambios:**
- ❌ Eliminar: `import { mockProducts } from '@/data/mockData'`
- ✅ Agregar: `import { useProducts } from '@/hooks'`
- ✅ Usar hook con paginación
- ✅ Pasar productos a ProductTable
- ✅ Callback de refetch después de crear/editar

#### 6.4 Actualizar ProductTable
**Archivo:** `src/admin/components/ProductTable.tsx`

**Cambios:**
- ✅ Agregar: `import { useProductMutations } from '@/hooks'`
- ✅ Implementar delete con confirmación
- ✅ Callback para refrescar lista después de delete
- ✅ Loading state en botones

#### 6.5 Actualizar ProductForm
**Archivo:** `src/admin/components/ProductForm.tsx`

**Cambios:**
- ✅ Agregar: `import { useProductMutations } from '@/hooks'`
- ✅ Usar hook para create/update
- ✅ Mostrar errores de validación del backend
- ✅ Loading state en botón submit
- ✅ Callback onSuccess para cerrar sheet y refrescar

---

### **FASE 7: Testing y Validación** ⏱️ 1 hora

#### 7.1 Verificar Backend Funcionando
```bash
# En carpeta del backend:
npm run dev

# Debe estar corriendo en http://localhost:3000
```

#### 7.2 Verificar CORS
```bash
# Test rápido con curl:
curl -X GET http://localhost:3000/api/products
```

#### 7.3 Testing en Frontend
```bash
# En carpeta del frontend:
npm run dev

# Abrir: http://localhost:5173
```

#### 7.4 Checklist de Pruebas

**Página de Productos (Público):**
- [ ] Se cargan productos desde API
- [ ] Loading state funciona
- [ ] Error state funciona si backend está apagado
- [ ] Modal de detalles funciona

**Dashboard:**
- [ ] Stats cards muestran datos reales
- [ ] Loading skeleton funciona
- [ ] Error state funciona

**Medications (Admin):**
- [ ] Tabla muestra productos desde API
- [ ] Crear producto funciona
- [ ] Editar producto funciona
- [ ] Eliminar producto funciona (con confirmación)
- [ ] Paginación funciona
- [ ] Búsqueda funciona (cuando backend la implemente)
- [ ] Loading states funcionan
- [ ] Errores de validación se muestran

---

## 🗂️ Estructura Final del Proyecto

```
src/
├── admin/
│   ├── components/
│   │   ├── ProductForm.tsx        ✏️ ACTUALIZAR
│   │   └── ProductTable.tsx       ✏️ ACTUALIZAR
│   ├── layout/
│   │   └── AdminLayout.tsx
│   └── page/
│       ├── DashboardPage.tsx      ✏️ ACTUALIZAR
│       ├── MedicationsPage.tsx    ✏️ ACTUALIZAR
│       └── SettingsPage.tsx
├── app/
│   ├── products/
│   │   └── ProductsPage.tsx       ✏️ ACTUALIZAR
│   └── ... (rest of components)
├── hooks/                          ✨ CREAR CARPETA
│   ├── index.ts                   ✨ NUEVO
│   ├── useProducts.ts             ✨ NUEVO
│   ├── useDashboard.ts            ✨ NUEVO
│   └── useProductMutations.ts     ✨ NUEVO
├── lib/                            ✨ CREAR CARPETA
│   └── api/                       ✨ CREAR CARPETA
│       ├── index.ts               ✨ NUEVO
│       ├── client.ts              ✨ NUEVO
│       ├── products.service.ts    ✨ NUEVO
│       └── dashboard.service.ts   ✨ NUEVO
├── types/
│   ├── index.ts                   ✏️ ACTUALIZAR
│   ├── product.types.ts           ✏️ ACTUALIZAR
│   ├── user.types.ts
│   ├── dashboard.types.ts         ✨ NUEVO
│   └── error.types.ts             ✨ NUEVO
├── data/
│   └── mockData.ts                🗑️ DEPRECAR (mantener para referencia)
├── .env                            ✨ CREAR
└── .env.example                    ✨ CREAR
```

---

## 📋 Checklist General de Integración

### Setup
- [ ] Axios instalado
- [ ] Variables de entorno configuradas (.env)
- [ ] .gitignore actualizado

### Types
- [ ] Product types actualizados
- [ ] Dashboard types creados
- [ ] Error types creados
- [ ] Barrel exports actualizados

### API
- [ ] API client configurado
- [ ] Interceptors implementados
- [ ] Products service creado
- [ ] Dashboard service creado

### Hooks
- [ ] useProducts hook creado
- [ ] useDashboard hook creado
- [ ] useProductMutations hook creado

### Componentes
- [ ] ProductsPage actualizado
- [ ] DashboardPage actualizado
- [ ] MedicationsPage actualizado
- [ ] ProductTable actualizado
- [ ] ProductForm actualizado

### Testing
- [ ] Backend corriendo en :3000
- [ ] CORS verificado
- [ ] Productos se cargan
- [ ] CRUD funciona
- [ ] Dashboard stats funcionan
- [ ] Loading states funcionan
- [ ] Error handling funciona

---

## ⚠️ Notas Importantes

1. **No eliminar mockData.ts todavía** - mantener como referencia
2. **Verificar CORS** - backend debe permitir `http://localhost:5173`
3. **Manejo de fechas** - backend envía ISO 8601, usar `date-fns` para formatear
4. **Imágenes** - por ahora URLs string, después implementar upload
5. **Autenticación** - Fase 5 del backend, no incluida en esta integración inicial

---

## 🚀 Orden de Ejecución Recomendado

1. ✅ **FASE 1** - Setup inicial (30 min)
2. ✅ **FASE 2** - Actualizar types (20 min)
3. ✅ **FASE 3** - Configurar API client (30 min)
4. ✅ **FASE 4** - Crear servicios (45 min)
5. ✅ **FASE 5** - Crear hooks (1 hora)
6. ✅ **FASE 6** - Actualizar componentes (2 horas)
7. ✅ **FASE 7** - Testing (1 hora)

**Tiempo total estimado:** ~5.5 horas

---

## 📞 ¿Problemas?

### Backend no responde
```bash
# Verificar que esté corriendo:
curl http://localhost:3000/api/products

# Si no funciona, revisar:
# - Backend está corriendo?
# - Puerto correcto (3000)?
# - CORS configurado?
```

### CORS Error
```
Access to XMLHttpRequest at 'http://localhost:3000' from origin 
'http://localhost:5173' has been blocked by CORS policy
```

**Solución:** Verificar `.env` del backend incluye:
```env
ALLOWED_ORIGINS=http://localhost:5173
```

### TypeScript Errors
- Verificar imports usan `@/` path alias
- Verificar tsconfig.json tiene paths configurados

---

**¡Listo para integrar! 🎉**

Empieza por la Fase 1 y sigue en orden. Cada fase es independiente pero construye sobre la anterior.
