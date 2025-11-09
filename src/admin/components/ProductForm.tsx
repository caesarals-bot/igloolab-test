import { useState, useEffect } from "react"
import type { Product } from "@/types"
import { useProductsContext } from "@/context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Package, DollarSign, Calendar as CalendarClock, Image as ImageIcon, Upload, Link2, X } from "lucide-react"
import { Card } from "@/components/ui/card"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"

interface ProductFormProps {
  productToEdit: Product | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function ProductForm({ productToEdit, open, onOpenChange, onSuccess }: ProductFormProps) {
  const { createProduct, updateProduct, loading, error, clearError } = useProductsContext()
  const [fechaElaboracion, setFechaElaboracion] = useState<Date | undefined>(undefined)
  const [fechaVencimiento, setFechaVencimiento] = useState<Date | undefined>(undefined)
  const [formError, setFormError] = useState<string | null>(null)
  const [imageMode, setImageMode] = useState<'upload' | 'url'>('upload')
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageUrl, setImageUrl] = useState<string>('')

  const isEditing = productToEdit !== null
  const title = isEditing ? "Editar Medicamento" : "Agregar Nuevo Medicamento"
  const description = isEditing
    ? "Modifica los datos del medicamento en el formulario"
    : "Completa los datos del nuevo medicamento"

  // Función para optimizar imagen
  const optimizeImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          
          // Dimensiones máximas
          const MAX_WIDTH = 800
          const MAX_HEIGHT = 800
          let width = img.width
          let height = img.height

          // Calcular nuevas dimensiones manteniendo aspect ratio
          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width
              width = MAX_WIDTH
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height
              height = MAX_HEIGHT
            }
          }

          canvas.width = width
          canvas.height = height
          ctx?.drawImage(img, 0, 0, width, height)

          // Convertir a base64 con calidad optimizada
          const optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.85)
          resolve(optimizedDataUrl)
        }
        img.onerror = reject
        img.src = e.target?.result as string
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      setFormError('Por favor selecciona un archivo de imagen válido')
      return
    }

    // Validar tamaño (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setFormError('La imagen no debe superar 5MB')
      return
    }

    try {
      const optimizedImage = await optimizeImage(file)
      setImagePreview(optimizedImage)
      setFormError(null)
    } catch (error) {
      setFormError('Error al procesar la imagen')
    }
  }

  const handleImageUrlChange = (url: string) => {
    setImageUrl(url)
    
    // Validar URL básica
    if (url) {
      try {
        new URL(url)
        setImagePreview(url)
        setFormError(null)
      } catch {
        setImagePreview(null)
        if (url.length > 10) { // Solo mostrar error si ya escribió algo
          setFormError('Por favor ingresa una URL válida (debe comenzar con http:// o https://)')
        }
      }
    } else {
      setImagePreview(null)
      setFormError(null)
    }
  }

  const clearImage = () => {
    setImagePreview(null)
    setImageUrl('')
  }

  // Reset form when productToEdit changes or modal closes
  useEffect(() => {
    if (open) {
      setFechaElaboracion(
        productToEdit ? new Date(productToEdit.fechaElaboracion) : undefined
      )
      setFechaVencimiento(
        productToEdit ? new Date(productToEdit.fechaVencimiento) : undefined
      )
      // Reset image states
      if (productToEdit?.imageUrl) {
        setImageUrl(productToEdit.imageUrl)
        setImagePreview(productToEdit.imageUrl)
        setImageMode('url')
      } else {
        setImageUrl('')
        setImagePreview(null)
        setImageMode('upload')
      }
      setFormError(null)
      clearError()
    }
  }, [productToEdit, open, clearError])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormError(null)

    const formData = new FormData(e.currentTarget)
    const nombre = formData.get('nombre') as string
    const descripcion = formData.get('descripcion') as string
    const precio = parseFloat(formData.get('precio') as string)

    // Validations
    if (!nombre || !descripcion || !precio || !fechaElaboracion || !fechaVencimiento) {
      setFormError('Por favor completa todos los campos requeridos')
      return
    }

    if (fechaVencimiento <= fechaElaboracion) {
      setFormError('La fecha de vencimiento debe ser posterior a la fecha de elaboración')
      return
    }

    const productData = {
      nombre,
      descripcion,
      precio,
      fechaElaboracion: fechaElaboracion.toISOString(),
      fechaVencimiento: fechaVencimiento.toISOString(),
      imageUrl: imageMode === 'upload' ? imagePreview || undefined : imageUrl || undefined,
    }

    let success = false
    if (isEditing) {
      const result = await updateProduct(productToEdit.id, productData)
      success = result !== null
    } else {
      const result = await createProduct(productData)
      success = result !== null
    }

    if (success) {
      onSuccess?.()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
          <DialogDescription className="text-base">{description}</DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-180px)]">
          <form id="product-form" className="space-y-6 px-6 py-6" onSubmit={handleSubmit}>
          {/* Información Básica */}
          <div className="space-y-4 rounded-lg border bg-card p-5">
            <div className="flex items-center gap-2 text-base font-semibold">
              <div className="p-2 rounded-lg bg-primary/10">
                <Package className="w-5 h-5 text-primary" />
              </div>
              <span>Información Básica</span>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="nombre" className="text-sm font-medium">
                Nombre del Medicamento *
              </Label>
              <Input 
                id="nombre" 
                name="nombre"
                placeholder="Ej: Omeprazol 20mg, Amoxicilina 500mg" 
                defaultValue={productToEdit?.nombre} 
                required 
                disabled={loading}
                className="h-11"
              />
              <p className="text-xs text-muted-foreground">Incluye nombre comercial y presentación</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="descripcion" className="text-sm font-medium">
                Descripción *
              </Label>
              <Textarea
                id="descripcion"
                name="descripcion"
                placeholder="Ejemplo: Inhibidor de la bomba de protones para el tratamiento de úlceras y reflujo gastroesofágico"
                rows={3}
                defaultValue={productToEdit?.descripcion}
                required
                disabled={loading}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">Indica uso, composición y presentación</p>
            </div>
          </div>

          {/* Imagen del Producto */}
          <div className="space-y-4 rounded-lg border bg-card p-5">
            <div className="flex items-center gap-2 text-base font-semibold">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <ImageIcon className="w-5 h-5 text-purple-600" />
              </div>
              <span>Imagen del Producto</span>
              <span className="text-xs text-muted-foreground font-normal ml-auto">(Opcional)</span>
            </div>

            {/* Toggle entre Upload y URL */}
            <div className="flex gap-2 p-1 bg-muted rounded-lg w-fit">
              <button
                type="button"
                onClick={() => {
                  setImageMode('upload')
                  setImageUrl('')
                }}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  imageMode === 'upload'
                    ? 'bg-background shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                disabled={loading}
              >
                <Upload className="w-4 h-4 inline mr-2" />
                Subir Archivo
              </button>
              <button
                type="button"
                onClick={() => {
                  setImageMode('url')
                }}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  imageMode === 'url'
                    ? 'bg-background shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                disabled={loading}
              >
                <Link2 className="w-4 h-4 inline mr-2" />
                URL
              </button>
            </div>

            {imageMode === 'upload' ? (
              <div className="space-y-3">
                <Label htmlFor="image-upload" className="text-sm font-medium">
                  Subir Imagen del Producto
                </Label>
                
                {!imagePreview ? (
                  <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={loading}
                    />
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer flex flex-col items-center gap-2"
                    >
                      <div className="p-4 rounded-full bg-primary/10">
                        <Upload className="w-8 h-8 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Click para subir imagen</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          PNG, JPG, WEBP hasta 5MB
                        </p>
                      </div>
                    </label>
                  </div>
                ) : (
                  <Card className="relative p-4">
                    <button
                      type="button"
                      onClick={clearImage}
                      className="absolute top-2 right-2 p-1 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      disabled={loading}
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-48 object-contain rounded-lg"
                    />
                    <p className="text-xs text-muted-foreground mt-2 text-center">
                      ✓ Imagen optimizada
                    </p>
                  </Card>
                )}
                <p className="text-xs text-muted-foreground">
                  La imagen será optimizada automáticamente para web
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <Label htmlFor="image-url" className="text-sm font-medium">
                  URL de la Imagen
                </Label>
                <Input
                  id="image-url"
                  type="url"
                  placeholder="https://ejemplo.com/imagen.jpg"
                  value={imageUrl}
                  onChange={(e) => handleImageUrlChange(e.target.value)}
                  disabled={loading}
                  className="h-11"
                />
                {imageUrl && (
                  <Card className="relative p-4">
                    <button
                      type="button"
                      onClick={clearImage}
                      className="absolute top-2 right-2 p-1 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 z-10"
                      disabled={loading}
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <img
                      src={imageUrl}
                      alt="Preview"
                      className="w-full h-48 object-contain rounded-lg"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none'
                        setFormError('URL de imagen no válida')
                      }}
                    />
                  </Card>
                )}
                <p className="text-xs text-muted-foreground">
                  💡 Ingresa la URL completa (ej: https://ejemplo.com/imagen.jpg)
                  <br />
                  Puedes usar servicios como Cloudinary, Imgur, o cualquier URL pública
                </p>
              </div>
            )}
          </div>

          {/* Información Comercial */}
          <div className="space-y-4 rounded-lg border bg-card p-5">
            <div className="flex items-center gap-2 text-base font-semibold">
              <div className="p-2 rounded-lg bg-green-500/10">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <span>Información Comercial</span>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="precio" className="text-sm font-medium">
                Precio de Venta (USD) *
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">$</span>
                <Input
                  id="precio"
                  name="precio"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  defaultValue={productToEdit?.precio}
                  required
                  disabled={loading}
                  className="pl-8 h-11 text-lg font-semibold"
                />
              </div>
              <p className="text-xs text-muted-foreground">Precio unitario de venta al público</p>
            </div>
          </div>

          {/* Fechas de Control */}
          <div className="space-y-4 rounded-lg border bg-card p-5">
            <div className="flex items-center gap-2 text-base font-semibold">
              <div className="p-2 rounded-lg bg-orange-500/10">
                <CalendarClock className="w-5 h-5 text-orange-600" />
              </div>
              <span>Fechas de Control</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Fecha de Elaboración *
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      disabled={loading}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !fechaElaboracion && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {fechaElaboracion ? (
                        format(fechaElaboracion, "dd MMM yyyy", { locale: es })
                      ) : (
                        <span>Seleccionar</span>
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
                      disabled={(date) => date > new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Fecha de Vencimiento *
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      disabled={loading}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !fechaVencimiento && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {fechaVencimiento ? (
                        format(fechaVencimiento, "dd MMM yyyy", { locale: es })
                      ) : (
                        <span>Seleccionar</span>
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
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Días hasta vencimiento */}
            {fechaElaboracion && fechaVencimiento && (
              <div className="p-3 rounded-lg bg-muted/50 border border-border">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Vida útil del producto:</span>
                  <span className="font-semibold">
                    {Math.ceil((fechaVencimiento.getTime() - fechaElaboracion.getTime()) / (1000 * 60 * 60 * 24))} días
                  </span>
                </div>
                {fechaVencimiento <= new Date() ? (
                  <p className="text-xs text-destructive mt-1">⚠️ Este producto está vencido</p>
                ) : fechaVencimiento <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) ? (
                  <p className="text-xs text-orange-600 mt-1">⚠️ Este producto vence pronto</p>
                ) : (
                  <p className="text-xs text-green-600 mt-1">✓ Producto con vigencia válida</p>
                )}
              </div>
            )}
          </div>

          {/* Error Message */}
          {(formError || error) && (
            <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/50">
              <p className="text-sm text-destructive font-medium">
                {formError || error}
              </p>
            </div>
          )}
        </form>
        </ScrollArea>

        <div className="px-6 py-4 border-t bg-muted/30 flex gap-3">
          <Button
            type="button"
            variant="outline"
            className="flex-1 h-11"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            form="product-form"
            className="flex-1 h-11 bg-primary hover:bg-primary/90 font-semibold" 
            disabled={loading}
            onClick={(e) => {
              const form = document.getElementById('product-form') as HTMLFormElement
              if (form) {
                e.preventDefault()
                form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))
              }
            }}
          >
            {loading 
              ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  {isEditing ? "Guardando..." : "Agregando..."}
                </>
              ) 
              : (
                <>
                  <Package className="mr-2 h-5 w-5" />
                  {isEditing ? "Guardar Cambios" : "Agregar Medicamento"}
                </>
              )
            }
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
