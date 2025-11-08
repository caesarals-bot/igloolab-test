export type Product = {
  id: string
  nombre: string
  descripcion: string
  precio: number
  fechaVencimiento: string // Formato "YYYY-MM-DD"
  fechaElaboracion: string // Formato "YYYY-MM-DD"
  imageUrl?: string // URL de la imagen del producto
}
