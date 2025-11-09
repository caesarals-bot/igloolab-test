import { useState } from "react"
import type { Product } from "@/types"
import { useProductsContext } from "@/context"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Edit, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface ProductTableProps {
  products: Product[]
  onEdit?: (product: Product) => void
  onRefresh?: () => void
}

export function ProductTable({ products, onEdit, onRefresh }: ProductTableProps) {
  const { deleteProduct, loading } = useProductsContext()
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd MMM yyyy", { locale: es })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "USD",
    }).format(price)
  }

  const handleEdit = (product: Product) => {
    onEdit?.(product)
  }

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product)
  }

  const handleConfirmDelete = async () => {
    if (!productToDelete) return
    
    setIsDeleting(true)
    const success = await deleteProduct(productToDelete.id)
    setIsDeleting(false)
    
    if (success) {
      setProductToDelete(null)
      onRefresh?.()
    }
  }

  const handleCancelDelete = () => {
    setProductToDelete(null)
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
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => handleEdit(product)}
                      disabled={loading}
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Editar</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleDeleteClick(product)}
                      disabled={loading}
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
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 gap-2 bg-transparent"
                onClick={() => handleEdit(product)}
                disabled={loading}
              >
                <Edit className="h-4 w-4" />
                Editar
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 gap-2 text-destructive hover:bg-destructive/10 bg-transparent"
                onClick={() => handleDeleteClick(product)}
                disabled={loading}
              >
                <Trash2 className="h-4 w-4" />
                Eliminar
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!productToDelete} onOpenChange={handleCancelDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar producto?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el producto{" "}
              <span className="font-semibold">{productToDelete?.nombre}</span> del inventario.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
