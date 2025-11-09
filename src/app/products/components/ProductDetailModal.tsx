import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Package } from "lucide-react"
import type { Product } from "@/types"

interface ProductDetailModalProps {
  product: Product | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProductDetailModal({ product, open, onOpenChange }: ProductDetailModalProps) {
  if (!product) return null

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const day = date.getDate()
    const month = date.toLocaleDateString("es-ES", { month: "short" })
    const year = date.getFullYear()
    return `${day} de ${month} de ${year}`
  }

  const formatPrice = (price: number | string) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Number(price))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{product.nombre}</DialogTitle>
          <DialogDescription>Información detallada del producto</DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6 mt-4">
          {/* Imagen del producto */}
          <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
            <img
              src={product.imageUrl || "/placeholder.svg?height=400&width=400"}
              alt={product.nombre}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Información del producto */}
          <div className="space-y-6">
            {/* Precio destacado */}
            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-primary">{formatPrice(product.precio)}</span>
              </div>
              <Badge variant="secondary" className="text-xs w-fit">
                Precio unitario
              </Badge>
            </div>

            {/* Descripción completa */}
            <div>
              <h4 className="font-semibold text-foreground mb-2">Descripción</h4>
              <p className="text-muted-foreground leading-relaxed">{product.descripcion}</p>
            </div>

            {/* Fechas importantes */}
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary shrink-0">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Fecha de Elaboración</p>
                  <p className="text-sm text-muted-foreground">{formatDate(product.fechaElaboracion)}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent/10 text-accent shrink-0">
                  <CalendarDays className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Fecha de Vencimiento</p>
                  <p className="text-sm text-muted-foreground">{formatDate(product.fechaVencimiento)}</p>
                </div>
              </div>
            </div>

            {/* ID del producto */}
            <div className="pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <span>SKU:</span>
                <span className="font-mono font-medium text-foreground">
                  {product.id.slice(0, 8).toUpperCase()}
                </span>
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
