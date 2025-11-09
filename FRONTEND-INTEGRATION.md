# 🎨 Frontend Integration Guide

Guía completa para integrar el backend de igloolab con cualquier framework frontend (React, Vue, Angular, etc.)

---

## 📋 Tabla de Contenidos

- [Configuración Inicial](#-configuración-inicial)
- [Base URL y CORS](#-base-url-y-cors)
- [TypeScript Types](#-typescript-types)
- [API Client Setup](#-api-client-setup)
- [Endpoints Disponibles](#-endpoints-disponibles)
- [Ejemplos por Framework](#-ejemplos-por-framework)
- [Manejo de Errores](#-manejo-de-errores)
- [Testing](#-testing)

---

## 🔧 Configuración Inicial

### 1️⃣ Base URL

```javascript
// Desarrollo
const API_BASE_URL = 'http://localhost:3000/api';

// Producción
const API_BASE_URL = 'https://api.igloolab.co/api';
```

### 2️⃣ Variables de Entorno

**React/Vite** (`.env`)
```env
VITE_API_URL=http://localhost:3000/api
```

**Next.js** (`.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

**Angular** (`environment.ts`)
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
```

---

## 🌐 Base URL y CORS

### CORS Configurado

El backend acepta peticiones desde:
- ✅ `http://localhost:5173` (Vite default)
- ✅ `http://localhost:3001` (React default)
- ✅ `http://localhost:4200` (Angular default)
- ✅ Sin origin (Postman, apps móviles)

### Agregar Nuevo Origin

En el backend `.env`:
```env
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000,https://tudominio.com
```

---

## 📦 TypeScript Types

Copia estos tipos en tu proyecto frontend:

```typescript
// types/product.ts
export interface Product {
  id: string;
  nombre: string;
  precio: number;
  descripcion: string;
  fechaElaboracion: string; // ISO 8601
  fechaVencimiento: string; // ISO 8601
  imagen?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductDTO {
  nombre: string;
  precio: number;
  descripcion: string;
  fechaElaboracion: string;
  fechaVencimiento: string;
  imagen?: string;
}

export interface UpdateProductDTO {
  nombre?: string;
  precio?: number;
  descripcion?: string;
  fechaElaboracion?: string;
  fechaVencimiento?: string;
  imagen?: string;
}

export interface ProductsResponse {
  products: Product[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ProductResponse {
  product: Product;
}

// types/dashboard.ts
export interface DashboardStats {
  totalProducts: number;
  totalInventoryValue: number;
  averagePrice: number;
  expiringProducts: number;
  expiringProductsList: ExpiringProduct[];
}

export interface ExpiringProduct {
  id: string;
  nombre: string;
  fechaVencimiento: string;
  daysUntilExpiry: number;
}

export interface ExpiryStatus {
  expired: number;
  expiringSoon: number;
  valid: number;
}

export interface DashboardStatsResponse {
  stats: DashboardStats;
}

export interface ExpiryStatusResponse {
  expiryStatus: ExpiryStatus;
}

// types/error.ts
export interface APIError {
  error: string;
  message: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}
```

---

## 🔌 API Client Setup

### Axios (Recomendado)

**Instalación:**
```bash
npm install axios
```

**Setup (`src/api/client.ts`):**
```typescript
import axios, { AxiosError } from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 segundos
});

// Request interceptor (para agregar token después)
apiClient.interceptors.request.use(
  (config) => {
    // Cuando implementes auth:
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor (manejo de errores global)
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<APIError>) => {
    if (error.response) {
      // Error del servidor (4xx, 5xx)
      console.error('API Error:', error.response.data);
      
      // Opcional: manejar errores específicos
      if (error.response.status === 401) {
        // Redirect a login cuando se implemente auth
        // window.location.href = '/login';
      }
    } else if (error.request) {
      // Request hecho pero sin respuesta
      console.error('Network Error:', error.message);
    } else {
      // Otro tipo de error
      console.error('Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
```

---

## 📡 Endpoints Disponibles

### Products API

**1. Listar Productos**
```typescript
// src/api/products.ts
import apiClient from './client';
import { ProductsResponse } from '../types/product';

export const getProducts = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: 'nombre' | 'precio' | 'fechaElaboracion' | 'fechaVencimiento' | 'createdAt';
  order?: 'asc' | 'desc';
}): Promise<ProductsResponse> => {
  const response = await apiClient.get<ProductsResponse>('/products', { params });
  return response.data;
};

// Uso:
const { products, pagination } = await getProducts({
  page: 1,
  limit: 10,
  search: 'paracetamol',
  sortBy: 'nombre',
  order: 'asc'
});
```

**2. Obtener Producto por ID**
```typescript
export const getProductById = async (id: string): Promise<Product> => {
  const response = await apiClient.get<ProductResponse>(`/products/${id}`);
  return response.data.product;
};

// Uso:
const product = await getProductById('uuid-del-producto');
```

**3. Crear Producto**
```typescript
export const createProduct = async (data: CreateProductDTO): Promise<Product> => {
  const response = await apiClient.post<ProductResponse>('/products', data);
  return response.data.product;
};

// Uso:
const newProduct = await createProduct({
  nombre: 'Paracetamol 500mg',
  precio: 15000,
  descripcion: 'Analgésico y antipirético para alivio del dolor',
  fechaElaboracion: '2024-01-15',
  fechaVencimiento: '2026-01-15',
  imagen: 'https://example.com/image.jpg' // opcional
});
```

**4. Actualizar Producto**
```typescript
export const updateProduct = async (
  id: string,
  data: UpdateProductDTO
): Promise<Product> => {
  const response = await apiClient.put<ProductResponse>(`/products/${id}`, data);
  return response.data.product;
};

// Uso (actualizar solo precio):
const updated = await updateProduct('uuid', {
  precio: 18000
});
```

**5. Eliminar Producto**
```typescript
export const deleteProduct = async (id: string): Promise<void> => {
  await apiClient.delete(`/products/${id}`);
};

// Uso:
await deleteProduct('uuid-del-producto');
```

---

### Dashboard API

**1. Obtener Estadísticas**
```typescript
// src/api/dashboard.ts
import apiClient from './client';
import { DashboardStatsResponse } from '../types/dashboard';

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await apiClient.get<DashboardStatsResponse>('/dashboard/stats');
  return response.data.stats;
};

// Uso:
const stats = await getDashboardStats();
console.log(stats.totalProducts);
console.log(stats.expiringProducts);
```

**2. Obtener Estado de Vencimientos**
```typescript
export const getExpiryStatus = async (): Promise<ExpiryStatus> => {
  const response = await apiClient.get<ExpiryStatusResponse>('/dashboard/expiry-status');
  return response.data.expiryStatus;
};

// Uso:
const status = await getExpiryStatus();
console.log(`Vencidos: ${status.expired}`);
console.log(`Por vencer: ${status.expiringSoon}`);
console.log(`Válidos: ${status.valid}`);
```

---

## 🎨 Ejemplos por Framework

### React + TypeScript

**Hook personalizado para productos:**
```tsx
// hooks/useProducts.ts
import { useState, useEffect } from 'react';
import { getProducts } from '../api/products';
import { Product } from '../types/product';

export const useProducts = (page = 1, limit = 10) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getProducts({ page, limit });
        setProducts(data.products);
        setTotalPages(data.pagination.totalPages);
        setError(null);
      } catch (err) {
        setError('Error al cargar productos');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page, limit]);

  return { products, loading, error, totalPages };
};
```

**Componente de lista:**
```tsx
// components/ProductList.tsx
import React from 'react';
import { useProducts } from '../hooks/useProducts';

export const ProductList: React.FC = () => {
  const { products, loading, error } = useProducts();

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="product-list">
      {products.map((product) => (
        <div key={product.id} className="product-card">
          <h3>{product.nombre}</h3>
          <p>{product.descripcion}</p>
          <p className="price">${product.precio.toLocaleString()}</p>
          <p className="expiry">
            Vence: {new Date(product.fechaVencimiento).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
};
```

**Hook para dashboard:**
```tsx
// hooks/useDashboard.ts
import { useState, useEffect } from 'react';
import { getDashboardStats } from '../api/dashboard';
import { DashboardStats } from '../types/dashboard';

export const useDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading };
};
```

**Componente de dashboard:**
```tsx
// components/Dashboard.tsx
import React from 'react';
import { useDashboard } from '../hooks/useDashboard';

export const Dashboard: React.FC = () => {
  const { stats, loading } = useDashboard();

  if (loading || !stats) return <div>Cargando estadísticas...</div>;

  return (
    <div className="dashboard">
      <div className="stat-card">
        <h3>Total Productos</h3>
        <p className="stat-value">{stats.totalProducts}</p>
      </div>
      
      <div className="stat-card">
        <h3>Valor Inventario</h3>
        <p className="stat-value">${stats.totalInventoryValue.toLocaleString()}</p>
      </div>
      
      <div className="stat-card">
        <h3>Precio Promedio</h3>
        <p className="stat-value">${stats.averagePrice.toLocaleString()}</p>
      </div>
      
      <div className="stat-card alert">
        <h3>Por Vencer (30 días)</h3>
        <p className="stat-value">{stats.expiringProducts}</p>
      </div>

      {stats.expiringProductsList.length > 0 && (
        <div className="expiring-list">
          <h3>Productos Próximos a Vencer</h3>
          {stats.expiringProductsList.map((product) => (
            <div key={product.id} className="expiring-item">
              <span>{product.nombre}</span>
              <span className="days-badge">
                {product.daysUntilExpiry} días
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
```

**Formulario para crear producto:**
```tsx
// components/ProductForm.tsx
import React, { useState } from 'react';
import { createProduct } from '../api/products';
import { CreateProductDTO } from '../types/product';

export const ProductForm: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const [formData, setFormData] = useState<CreateProductDTO>({
    nombre: '',
    precio: 0,
    descripcion: '',
    fechaElaboracion: '',
    fechaVencimiento: '',
    imagen: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await createProduct(formData);
      onSuccess();
      // Reset form
      setFormData({
        nombre: '',
        precio: 0,
        descripcion: '',
        fechaElaboracion: '',
        fechaVencimiento: '',
        imagen: '',
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al crear producto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="product-form">
      <div className="form-group">
        <label htmlFor="nombre">Nombre *</label>
        <input
          type="text"
          id="nombre"
          value={formData.nombre}
          onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
          required
          minLength={3}
          maxLength={255}
        />
      </div>

      <div className="form-group">
        <label htmlFor="precio">Precio *</label>
        <input
          type="number"
          id="precio"
          value={formData.precio}
          onChange={(e) => setFormData({ ...formData, precio: Number(e.target.value) })}
          required
          min={0}
        />
      </div>

      <div className="form-group">
        <label htmlFor="descripcion">Descripción *</label>
        <textarea
          id="descripcion"
          value={formData.descripcion}
          onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
          required
          minLength={10}
        />
      </div>

      <div className="form-group">
        <label htmlFor="fechaElaboracion">Fecha de Elaboración *</label>
        <input
          type="date"
          id="fechaElaboracion"
          value={formData.fechaElaboracion}
          onChange={(e) => setFormData({ ...formData, fechaElaboracion: e.target.value })}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="fechaVencimiento">Fecha de Vencimiento *</label>
        <input
          type="date"
          id="fechaVencimiento"
          value={formData.fechaVencimiento}
          onChange={(e) => setFormData({ ...formData, fechaVencimiento: e.target.value })}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="imagen">URL de Imagen (opcional)</label>
        <input
          type="url"
          id="imagen"
          value={formData.imagen}
          onChange={(e) => setFormData({ ...formData, imagen: e.target.value })}
          maxLength={500}
        />
      </div>

      {error && <div className="error-message">{error}</div>}

      <button type="submit" disabled={loading}>
        {loading ? 'Creando...' : 'Crear Producto'}
      </button>
    </form>
  );
};
```

---

### Vue 3 + TypeScript (Composition API)

**Composable para productos:**
```typescript
// composables/useProducts.ts
import { ref, Ref } from 'vue';
import { getProducts } from '@/api/products';
import { Product } from '@/types/product';

export function useProducts() {
  const products: Ref<Product[]> = ref([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchProducts = async (page = 1, limit = 10) => {
    loading.value = true;
    error.value = null;
    
    try {
      const data = await getProducts({ page, limit });
      products.value = data.products;
    } catch (err) {
      error.value = 'Error al cargar productos';
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  return {
    products,
    loading,
    error,
    fetchProducts,
  };
}
```

**Componente Vue:**
```vue
<template>
  <div class="product-list">
    <div v-if="loading">Cargando...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else>
      <div
        v-for="product in products"
        :key="product.id"
        class="product-card"
      >
        <h3>{{ product.nombre }}</h3>
        <p>{{ product.descripcion }}</p>
        <p class="price">${{ product.precio.toLocaleString() }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useProducts } from '@/composables/useProducts';

const { products, loading, error, fetchProducts } = useProducts();

onMounted(() => {
  fetchProducts();
});
</script>
```

---

## ❌ Manejo de Errores

### Errores de Validación (400)

```typescript
try {
  await createProduct(data);
} catch (error: any) {
  if (error.response?.status === 400) {
    const errors = error.response.data.errors;
    
    // Mostrar errores por campo
    errors?.forEach((err: any) => {
      console.error(`${err.field}: ${err.message}`);
    });
    
    // O mostrar mensaje general
    alert(error.response.data.message);
  }
}
```

### Error 404 (Not Found)

```typescript
try {
  const product = await getProductById(id);
} catch (error: any) {
  if (error.response?.status === 404) {
    console.error('Producto no encontrado');
    // Redirect a lista de productos
    router.push('/products');
  }
}
```

### Error 500 (Server Error)

```typescript
try {
  const stats = await getDashboardStats();
} catch (error: any) {
  if (error.response?.status === 500) {
    console.error('Error del servidor');
    // Mostrar mensaje al usuario
    toast.error('Error del servidor. Intenta más tarde.');
  }
}
```

---

## 🧪 Testing

### Test de API con Vitest

```typescript
// tests/api/products.test.ts
import { describe, it, expect, beforeAll } from 'vitest';
import { getProducts, createProduct } from '@/api/products';

describe('Products API', () => {
  it('should fetch products', async () => {
    const data = await getProducts({ page: 1, limit: 10 });
    
    expect(data).toHaveProperty('products');
    expect(data).toHaveProperty('pagination');
    expect(Array.isArray(data.products)).toBe(true);
  });

  it('should create a product', async () => {
    const newProduct = {
      nombre: 'Test Product',
      precio: 1000,
      descripcion: 'Test description for product',
      fechaElaboracion: '2024-01-01',
      fechaVencimiento: '2026-01-01',
    };

    const product = await createProduct(newProduct);
    
    expect(product).toHaveProperty('id');
    expect(product.nombre).toBe(newProduct.nombre);
  });
});
```

---

## 📝 Checklist de Integración

- [ ] ✅ CORS configurado en backend
- [ ] ✅ Variables de entorno configuradas
- [ ] ✅ Axios instalado y configurado
- [ ] ✅ TypeScript types copiados
- [ ] ✅ API client con interceptors
- [ ] ✅ Funciones de API creadas
- [ ] ✅ Hooks/Composables implementados
- [ ] ✅ Componentes conectados a API
- [ ] ✅ Manejo de errores implementado
- [ ] ✅ Loading states implementados
- [ ] ✅ Testing básico funcionando

---

## 🚀 Próximos Pasos (Cuando se implemente Auth)

1. **Agregar token a headers:**
```typescript
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

2. **Implementar login/register:**
```typescript
export const login = async (email: string, password: string) => {
  const response = await apiClient.post('/auth/login', { email, password });
  localStorage.setItem('token', response.data.token);
  return response.data.user;
};
```

3. **Protected routes con React Router:**
```tsx
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};
```

---

## 📚 Recursos

- **Axios Docs**: https://axios-http.com/
- **React Query** (recomendado para cache): https://tanstack.com/query
- **SWR** (alternativa): https://swr.vercel.app/

---

**¡Backend listo para conectar con tu frontend!** 🎉

Todos los endpoints están funcionando sin autenticación. Cuando se implemente JWT en la Fase 5, se actualizará esta guía con los cambios necesarios.
