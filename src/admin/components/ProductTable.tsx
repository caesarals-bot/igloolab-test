import type { Product } from "@/types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Edit, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface ProductTableProps {
  products: Product[]
}

export function ProductTable({ products }: ProductTableProps) {
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd MMM yyyy", { locale: es })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "USD",
    }).format(price)
  }

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden md:block rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="font-semibold">Nombre</TableHead>
              <TableHead className="font-semibold">Descripción</TableHead>
              <TableHead className="font-semibold">Precio</TableHead>
              <TableHead className="font-semibold">Fecha Elaboración</TableHead>
              <TableHead className="font-semibold">Fecha Vencimiento</TableHead>
              <TableHead className="text-right font-semibold">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id} className="hover:bg-muted/30">
                <TableCell className="font-medium">{product.nombre}</TableCell>
                <TableCell className="text-muted-foreground max-w-xs truncate">{product.descripcion}</TableCell>
                <TableCell className="font-mono font-semibold">{formatPrice(product.precio)}</TableCell>
                <TableCell className="text-muted-foreground">{formatDate(product.fechaElaboracion)}</TableCell>
                <TableCell className="text-muted-foreground">{formatDate(product.fechaVencimiento)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Editar</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Eliminar</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {products.map((product) => (
          <Card key={product.id} className="p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1 flex-1">
                <h3 className="font-semibold text-base leading-tight">{product.nombre}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{product.descripcion}</p>
              </div>
              <div className="font-mono font-bold text-lg whitespace-nowrap">{formatPrice(product.precio)}</div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Elaboración</p>
                <p className="font-medium">{formatDate(product.fechaElaboracion)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Vencimiento</p>
                <p className="font-medium">{formatDate(product.fechaVencimiento)}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-border">
              <Button variant="outline" size="sm" className="flex-1 gap-2 bg-transparent">
                <Edit className="h-4 w-4" />
                Editar
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 gap-2 text-destructive hover:bg-destructive/10 bg-transparent"
              >
                <Trash2 className="h-4 w-4" />
                Eliminar
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </>
  )
}
