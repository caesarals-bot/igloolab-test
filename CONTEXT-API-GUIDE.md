# 🎯 Context API - Guía de Uso

Gestión de estado global con React Context API para igloolab.

---

## 📋 Contexts Disponibles

### 1. **ProductsContext**
Maneja todo el estado relacionado con productos (CRUD completo).

### 2. **DashboardContext**
Maneja estadísticas y datos del dashboard admin.

---

## 🚀 Setup Completado

### Estructura de Archivos

```
src/
├── context/
│   ├── ProductsContext.tsx    ✅ Context de productos
│   ├── DashboardContext.tsx   ✅ Context de dashboard
│   └── index.tsx              ✅ AppProviders combinados
├── AppIgloobal.tsx            ✅ Envuelto con AppProviders
└── app/products/
    └── ProductsPage.tsx       ✅ Usando useProductsContext
```

---

## 📦 ProductsContext

### Estado Disponible

```typescript
{
  products: Product[]           // Lista de productos
  selectedProduct: Product | null  // Producto seleccionado
  loading: boolean              // Estado de carga
  error: string | null          // Mensajes de error
  pagination: {                 // Info de paginación
    total: number
    page: number
    limit: number
    totalPages: number
  }
}
```

### Acciones Disponibles

```typescript
{
  fetchProducts(params?)        // Obtener lista de productos
  fetchProductById(id)           // Obtener un producto
  createProduct(data)            // Crear producto
  updateProduct(id, data)        // Actualizar producto
  deleteProduct(id)              // Eliminar producto
  setSelectedProduct(product)    // Seleccionar producto
  clearError()                   // Limpiar errores
}
```

### Ejemplo de Uso

```typescript
import { useProductsContext } from '@/context'

function MyComponent() {
  const {
    products,
    loading,
    error,
    fetchProducts,
    createProduct
  } = useProductsContext()

  // Fetch products on mount
  useEffect(() => {
    fetchProducts({ limit: 10, page: 1 })
  }, [])

  // Create new product
  const handleCreate = async (data) => {
    const newProduct = await createProduct(data)
    if (newProduct) {
      console.log('Producto creado:', newProduct)
    }
  }

  if (loading) return <div>Cargando...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      {products.map(product => (
        <div key={product.id}>{product.nombre}</div>
      ))}
    </div>
  )
}
```

---

## 📊 DashboardContext

### Estado Disponible

```typescript
{
  stats: DashboardStats | null  // Estadísticas generales
  expiryStatus: ExpiryStatus | null  // Estado de vencimientos
  loading: boolean              // Estado de carga
  error: string | null          // Mensajes de error
}
```

### Acciones Disponibles

```typescript
{
  fetchStats()           // Obtener estadísticas
  fetchExpiryStatus()    // Obtener estado de vencimientos
  refreshDashboard()     // Refrescar todo
  clearError()           // Limpiar errores
}
```

### Ejemplo de Uso

```typescript
import { useDashboardContext } from '@/context'

function DashboardPage() {
  const { stats, loading, fetchStats } = useDashboardContext()

  useEffect(() => {
    fetchStats()
  }, [])

  if (loading || !stats) return <div>Cargando...</div>

  return (
    <div>
      <h2>Total Productos: {stats.totalProducts}</h2>
      <h2>Valor Inventario: ${stats.totalInventoryValue}</h2>
      <h2>Precio Promedio: ${stats.averagePrice}</h2>
      <h2>Por Vencer: {stats.expiringProducts}</h2>
    </div>
  )
}
```

---

## 🎨 Ventajas de Context API

### ✅ Ventajas

1. **No Props Drilling** - No pasar props por múltiples niveles
2. **Estado Global Centralizado** - Un solo lugar para el estado
3. **Fácil de Entender** - API simple de React
4. **TypeScript Completo** - Todo tipado
5. **Actualizaciones Optimizadas** - Solo re-renderiza lo necesario
6. **Sin Librerías Extra** - Built-in en React

### 🆚 Context API vs Redux

| Feature | Context API | Redux |
|---------|-------------|-------|
| Setup | ✅ Simple | ❌ Complejo |
| Boilerplate | ✅ Mínimo | ❌ Mucho |
| DevTools | ❌ No | ✅ Sí |
| Middleware | ❌ No | ✅ Sí |
| Tamaño Bundle | ✅ 0 KB | ❌ ~10 KB |
| Learning Curve | ✅ Bajo | ❌ Alto |

**Para igloolab:** Context API es suficiente ✅

---

## 🔄 Flujo de Datos

```
┌─────────────────────────────────────────────┐
│         AppProviders (AppIgloobal)          │
│  ┌─────────────────────────────────────┐   │
│  │      ProductsProvider                │   │
│  │  ┌──────────────────────────────┐   │   │
│  │  │   DashboardProvider           │   │   │
│  │  │  ┌──────────────────────┐    │   │   │
│  │  │  │   RouterProvider      │    │   │   │
│  │  │  │  (Toda la app)        │    │   │   │
│  │  │  └──────────────────────┘    │   │   │
│  │  └──────────────────────────────┘   │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘

Cualquier componente puede acceder a:
- useProductsContext()
- useDashboardContext()
```

---

## 📝 Casos de Uso

### Caso 1: Lista de Productos (ProductsPage)

```typescript
// ✅ IMPLEMENTADO
const { products, loading, error, fetchProducts } = useProductsContext()

useEffect(() => {
  fetchProducts({ limit: 20 })
}, [])
```

### Caso 2: Admin - MedicationsPage (Próximo)

```typescript
// Próximo a implementar
const {
  products,
  loading,
  createProduct,
  updateProduct,
  deleteProduct,
  fetchProducts
} = useProductsContext()

// CRUD completo disponible
const handleCreate = async (data) => {
  const result = await createProduct(data)
  if (result) {
    await fetchProducts() // Refrescar lista
  }
}
```

### Caso 3: Dashboard Stats (Próximo)

```typescript
// Próximo a implementar
const { stats, loading, fetchStats } = useDashboardContext()

useEffect(() => {
  fetchStats()
}, [])

// Auto-refresh cada 5 minutos
useEffect(() => {
  const interval = setInterval(() => {
    fetchStats()
  }, 5 * 60 * 1000)
  
  return () => clearInterval(interval)
}, [])
```

---

## 🎯 Próximos Pasos

### A Actualizar (Fase 6 del plan):

1. **DashboardPage** (`src/admin/page/DashboardPage.tsx`)
   ```typescript
   - ❌ Quitar datos hardcodeados
   + ✅ Usar useDashboardContext()
   ```

2. **MedicationsPage** (`src/admin/page/MedicationsPage.tsx`)
   ```typescript
   - ❌ Quitar mockProducts
   + ✅ Usar useProductsContext()
   + ✅ Implementar CRUD con context
   ```

3. **ProductTable** (`src/admin/components/ProductTable.tsx`)
   ```typescript
   + ✅ Usar deleteProduct del context
   + ✅ Loading states en botones
   ```

4. **ProductForm** (`src/admin/components/ProductForm.tsx`)
   ```typescript
   + ✅ Usar createProduct/updateProduct del context
   + ✅ Mostrar errores de validación
   + ✅ Callback onSuccess para refrescar
   ```

---

## 🐛 Debugging

### Ver Estado en Consola

```typescript
// En cualquier componente
const context = useProductsContext()
console.log('Products Context:', context)
```

### React DevTools

1. Instalar React DevTools
2. Ir a Components tab
3. Buscar `ProductsProvider` o `DashboardProvider`
4. Ver estado en tiempo real

---

## ⚠️ Notas Importantes

1. **Siempre usar los hooks dentro de componentes**
   ```typescript
   // ❌ Mal - fuera de componente
   const products = useProductsContext()
   
   // ✅ Bien - dentro de componente
   function MyComponent() {
     const products = useProductsContext()
   }
   ```

2. **Error si se usa fuera del Provider**
   ```typescript
   // Si ves este error:
   // "useProductsContext must be used within a ProductsProvider"
   // Significa que el componente no está dentro de AppProviders
   ```

3. **No crear providers duplicados**
   ```typescript
   // ❌ Mal - providers duplicados
   <ProductsProvider>
     <ProductsProvider>
       <App />
     </ProductsProvider>
   </ProductsProvider>
   
   // ✅ Bien - un solo AppProviders en AppIgloobal
   <AppProviders>
     <RouterProvider router={AppRouter} />
   </AppProviders>
   ```

---

## 🔗 Integración con Backend

El Context API se conecta directamente con los servicios de API:

```
Component
   ↓ useProductsContext()
ProductsContext
   ↓ productsService.getAll()
API Client (axios)
   ↓ GET /api/products
Backend
```

---

## 📚 Recursos

- [React Context API Docs](https://react.dev/reference/react/useContext)
- [When to use Context](https://react.dev/learn/passing-data-deeply-with-context)
- [Context API Best Practices](https://kentcdodds.com/blog/how-to-use-react-context-effectively)

---

**Estado:** ✅ Context API Implementado  
**ProductsPage:** ✅ Conectado con API real  
**Próximo:** Actualizar admin pages (Dashboard, Medications)
