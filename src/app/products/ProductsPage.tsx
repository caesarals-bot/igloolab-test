import { useState } from "react"
import { mockProducts } from "@/data/mockData"
import type { Product } from "@/types"
import { ProductCard } from "./components/ProductCard"
import { ProductDetailModal } from "./components/ProductDetailModal"
import HeroProducts from "./components/HeroProducts"

export default function ProductosPage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {mockProducts.map((product) => (
              <ProductCard key={product.id} product={product} onViewDetails={handleViewDetails} />
            ))}
          </div>
        </div>
      </section>

      {/* Product Detail Modal */}
      <ProductDetailModal product={selectedProduct} open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  )
}
