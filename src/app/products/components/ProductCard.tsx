import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Product } from "@/types"

interface ProductCardProps {
  product: Product
  onViewDetails: (product: Product) => void
}

export function ProductCard({ product, onViewDetails }: ProductCardProps) {
  const formatPrice = (price: number | string) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Number(price))
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={product.imageUrl || "/placeholder.svg?height=300&width=300"}
          alt={product.nombre}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg text-foreground mb-2 line-clamp-1">{product.nombre}</h3>
        <p className="text-sm text-muted-foreground line-clamp-1 mb-3">{product.descripcion}</p>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary">{formatPrice(product.precio)}</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full" onClick={() => onViewDetails(product)}>
          Ver Detalles
        </Button>
      </CardFooter>
    </Card>
  )
}
