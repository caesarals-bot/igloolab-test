import type { Product } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { useState } from "react"

interface ProductFormProps {
  productToEdit: Product | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProductForm({ productToEdit, open, onOpenChange }: ProductFormProps) {
  const [fechaElaboracion, setFechaElaboracion] = useState<Date | undefined>(
    productToEdit ? new Date(productToEdit.fechaElaboracion) : undefined,
  )
  const [fechaVencimiento, setFechaVencimiento] = useState<Date | undefined>(
    productToEdit ? new Date(productToEdit.fechaVencimiento) : undefined,
  )

  const isEditing = productToEdit !== null
  const title = isEditing ? "Editar Medicamento" : "Agregar Nuevo Medicamento"
  const description = isEditing
    ? "Modifica los datos del medicamento en el formulario"
    : "Completa los datos del nuevo medicamento"

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>

        <form className="space-y-6 mt-6">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre del Medicamento *</Label>
            <Input id="nombre" placeholder="Ej: Amoxicilina 500mg" defaultValue={productToEdit?.nombre} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción *</Label>
            <Textarea
              id="descripcion"
              placeholder="Describe el medicamento, presentación, y características principales"
              rows={3}
              defaultValue={productToEdit?.descripcion}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="precio">Precio (USD) *</Label>
            <Input
              id="precio"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              defaultValue={productToEdit?.precio}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Fecha de Elaboración *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !fechaElaboracion && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {fechaElaboracion ? (
                    format(fechaElaboracion, "dd 'de' MMMM 'de' yyyy", { locale: es })
                  ) : (
                    <span>Selecciona una fecha</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={fechaElaboracion}
                  onSelect={setFechaElaboracion}
                  initialFocus
                  locale={es}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>Fecha de Vencimiento *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !fechaVencimiento && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {fechaVencimiento ? (
                    format(fechaVencimiento, "dd 'de' MMMM 'de' yyyy", { locale: es })
                  ) : (
                    <span>Selecciona una fecha</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={fechaVencimiento}
                  onSelect={setFechaVencimiento}
                  initialFocus
                  locale={es}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1 bg-transparent"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              {isEditing ? "Guardar Cambios" : "Agregar Medicamento"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
