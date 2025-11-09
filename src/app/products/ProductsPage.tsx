import { useState, useEffect } from "react"
import { useProductsContext } from "@/context"
import type { Product } from "@/types"
import { ProductCard } from "./components/ProductCard"
import { ProductDetailModal } from "./components/ProductDetailModal"
import HeroProducts from "./components/HeroProducts"

export default function ProductosPage() {
  const { products, loading, error, fetchProducts } = useProductsContext()
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  // Fetch products on mount
  useEffect(() => {
    fetchProducts({ limit: 20 })
  }, [])

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product)
    setModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <HeroProducts />

      {/* Products Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
              <p className="mt-4 text-muted-foreground">Cargando productos...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="text-center py-12">
              <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg max-w-md mx-auto">
                <p className="font-medium">Error al cargar productos</p>
                <p className="text-sm mt-1">{error}</p>
                <button 
                  onClick={() => fetchProducts({ limit: 20 })}
                  className="mt-3 text-sm underline"
                >
                  Intentar de nuevo
                </button>
              </div>
            </div>
          )}

          {/* Products Grid */}
          {!loading && !error && products.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} onViewDetails={handleViewDetails} />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && products.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No hay productos disponibles</p>
            </div>
          )}
        </div>
      </section>

      {/* Product Detail Modal */}
      <ProductDetailModal product={selectedProduct} open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  )
}
