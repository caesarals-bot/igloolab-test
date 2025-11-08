import { mockProducts } from "@/data/mockData"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useState } from "react"
import { ProductTable } from "../components/ProductTable"
import { ProductForm } from "../components/ProductForm"

export default function MedicationsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false)

  return (
    <>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Panel de Medicamentos</h1>
            <p className="text-muted-foreground">Gestiona tu inventario farmacéutico de forma profesional</p>
          </div>
          <Button size="lg" className="gap-2 w-full sm:w-auto" onClick={() => setIsFormOpen(true)}>
            <Plus className="w-5 h-5" />
            Agregar Producto
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-lg border border-border bg-card p-6 space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Total Medicamentos</p>
            <p className="text-3xl font-bold">{mockProducts.length}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-6 space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Valor Total</p>
            <p className="text-3xl font-bold">${mockProducts.reduce((sum, p) => sum + p.precio, 0).toFixed(2)}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-6 space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Próximos a Vencer</p>
            <p className="text-3xl font-bold">1</p>
          </div>
        </div>

        {/* Products Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Inventario</h2>
          </div>
          <ProductTable products={mockProducts} />
        </div>
      </div>

      {/* Product Form Sheet */}
      <ProductForm productToEdit={null} open={isFormOpen} onOpenChange={setIsFormOpen} />
    </>
  )
}
