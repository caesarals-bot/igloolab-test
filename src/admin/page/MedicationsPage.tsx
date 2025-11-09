import { lazy, Suspense, useEffect, useState } from "react"
import { useProductsContext, useDashboardContext } from "@/context"
import { Button } from "@/components/ui/button"
import { Plus, RefreshCw } from "lucide-react"
import { ProductTable } from "../components/ProductTable"
import { FormSkeleton } from "@/components/common/PageSkeleton"
import type { Product } from "@/types"

// Lazy load ProductForm (componente pesado ~21KB)
const ProductForm = lazy(() => import("../components/ProductForm").then(module => ({ 
  default: module.ProductForm 
})))

export default function MedicationsPage() {
  const { products, loading, error, fetchProducts } = useProductsContext()
  const { stats, fetchStats } = useDashboardContext()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [productToEdit, setProductToEdit] = useState<Product | null>(null)

  // Fetch products and stats on mount
  useEffect(() => {
    fetchProducts({ limit: 50 })
    fetchStats()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleRefresh = () => {
    fetchProducts({ limit: 50 })
    fetchStats()
  }

  const handleAddProduct = () => {
    setProductToEdit(null)
    setIsFormOpen(true)
  }

  const handleEditProduct = (product: Product) => {
    setProductToEdit(product)
    setIsFormOpen(true)
  }

  const handleFormSuccess = async () => {
    setIsFormOpen(false)
    setProductToEdit(null)
    // Refresh both products and stats
    await fetchProducts({ limit: 50 })
    await fetchStats()
  }

  return (
    <>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Panel de Medicamentos</h1>
            <p className="text-muted-foreground">Gestiona tu inventario farmacéutico de forma profesional</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button 
              variant="outline" 
              size="lg" 
              onClick={handleRefresh}
              disabled={loading}
              className="gap-2"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Actualizar</span>
            </Button>
            <Button size="lg" className="gap-2 flex-1 sm:flex-none" onClick={handleAddProduct}>
              <Plus className="w-5 h-5" />
              Agregar Producto
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-lg border border-border bg-card p-6 space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Total Medicamentos</p>
            {loading && !stats ? (
              <div className="h-9 w-16 bg-muted animate-pulse rounded"></div>
            ) : (
              <p className="text-3xl font-bold">{stats?.totalProducts || 0}</p>
            )}
          </div>
          <div className="rounded-lg border border-border bg-card p-6 space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Valor Total</p>
            {loading && !stats ? (
              <div className="h-9 w-24 bg-muted animate-pulse rounded"></div>
            ) : (
              <p className="text-3xl font-bold">
                ${stats?.totalInventoryValue.toLocaleString('es-CO', { minimumFractionDigits: 2 }) || '0.00'}
              </p>
            )}
          </div>
          <div className="rounded-lg border border-border bg-card p-6 space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Próximos a Vencer</p>
            {loading && !stats ? (
              <div className="h-9 w-12 bg-muted animate-pulse rounded"></div>
            ) : (
              <p className="text-3xl font-bold">{stats?.expiringProducts || 0}</p>
            )}
          </div>
        </div>

        {/* Error/Warning State */}
        {error && !loading && (
          <div className={error.includes('demostración') 
            ? "rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20 p-4"
            : "rounded-lg border border-destructive/50 bg-destructive/10 p-4"
          }>
            <div className="flex items-start gap-3">
              {error.includes('demostración') && <span className="text-2xl">⚠️</span>}
              <div className="flex-1">
                <p className={`font-medium ${error.includes('demostración') 
                  ? 'text-amber-800 dark:text-amber-200' 
                  : 'text-destructive'}`}>
                  {error.includes('demostración') ? 'Modo demostración' : 'Error al cargar productos'}
                </p>
                <p className={`text-sm mt-1 ${error.includes('demostración') 
                  ? 'text-amber-700 dark:text-amber-300' 
                  : 'text-destructive/80'}`}>
                  {error}
                </p>
                {error.includes('demostración') && (
                  <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
                    💡 Inicia el backend en <code className="bg-amber-100 dark:bg-amber-900 px-1 rounded">http://localhost:3000</code> para usar datos reales
                  </p>
                )}
              </div>
              {!error.includes('demostración') && (
                <Button variant="outline" size="sm" onClick={handleRefresh}>
                  Reintentar
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Products Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Inventario</h2>
            <p className="text-sm text-muted-foreground">
              {products.length} producto{products.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Loading State */}
          {loading && products.length === 0 ? (
            <div className="rounded-lg border border-border bg-card p-8">
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-muted animate-pulse rounded"></div>
                ))}
              </div>
            </div>
          ) : (
            <ProductTable 
              products={products} 
              onEdit={handleEditProduct}
              onRefresh={handleRefresh}
            />
          )}

          {/* Empty State */}
          {!loading && products.length === 0 && !error?.includes('demostración') && (
            <div className="rounded-lg border border-border bg-card p-12 text-center">
              <p className="text-muted-foreground">No hay productos en el inventario</p>
              <Button className="mt-4" onClick={handleAddProduct}>
                <Plus className="w-4 h-4 mr-2" />
                Agregar Primer Producto
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Product Form Sheet */}
      <Suspense fallback={<FormSkeleton />}>
        <ProductForm 
          productToEdit={productToEdit} 
          open={isFormOpen} 
          onOpenChange={setIsFormOpen}
          onSuccess={handleFormSuccess}
        />
      </Suspense>
    </>
  )
}
