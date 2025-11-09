import { useState, useEffect } from "react"
import { useProductsContext } from "@/context"
import type { Product } from "@/types"
import { ProductCard } from "./components/ProductCard"
import { ProductDetailModal } from "./components/ProductDetailModal"
import HeroProducts from "./components/HeroProducts"
import { SEO } from "@/components/seo/SEO"

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
      <SEO
        title="Productos Farmacéuticos - Catálogo Completo"
        description="Explora nuestro catálogo completo de productos farmacéuticos. Medicamentos, tratamientos y soluciones para profesionales de la salud."
        keywords="productos farmacéuticos, medicamentos, catálogo médico, tratamientos, soluciones de salud"
        url="https://igloolab.co/productos"
        type="website"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          "name": "Productos Farmacéuticos",
          "description": "Catálogo de productos farmacéuticos",
          "numberOfItems": products.length,
          "itemListElement": products.slice(0, 10).map((product, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "item": {
              "@type": "Product",
              "name": product.nombre,
              "description": product.descripcion,
              "offers": {
                "@type": "Offer",
                "price": product.precio,
                "priceCurrency": "USD"
              }
            }
          }))
        }}
      />
      
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

          {/* Warning/Error State */}
          {error && !loading && (
            <div className="mb-6">
              {error.includes('demostración') ? (
                // Warning suave para mock data
                <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 px-4 py-3 rounded-lg max-w-3xl mx-auto">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">⚠️</span>
                    <div className="flex-1">
                      <p className="font-medium">Modo demostración</p>
                      <p className="text-sm mt-1">
                        El backend no está disponible. Mostrando datos de ejemplo. 
                        Para usar datos reales, inicia el servidor backend en <code className="bg-amber-100 dark:bg-amber-900 px-1 rounded">http://localhost:3000</code>
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                // Error real
                <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg max-w-md mx-auto text-center">
                  <p className="font-medium">Error al cargar productos</p>
                  <p className="text-sm mt-1">{error}</p>
                  <button 
                    onClick={() => fetchProducts({ limit: 20 })}
                    className="mt-3 text-sm underline"
                  >
                    Intentar de nuevo
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Products Grid */}
          {!loading && products.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} onViewDetails={handleViewDetails} />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && products.length === 0 && !error?.includes('demostración') && (
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
