import apiClient from './client'
import type { Product } from '@/types'

// Response types para products
export type ProductsResponse = {
  products: Product[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export type ProductResponse = {
  product: Product
}

// DTO types
export type CreateProductDTO = {
  nombre: string
  precio: number
  descripcion: string
  fechaElaboracion: string
  fechaVencimiento: string
  imageUrl?: string
}

export type UpdateProductDTO = {
  nombre?: string
  precio?: number
  descripcion?: string
  fechaElaboracion?: string
  fechaVencimiento?: string
  imageUrl?: string
}

export const productsService = {
  // Listar productos con paginación y filtros
  getAll: async (params?: {
    page?: number
    limit?: number
    search?: string
    sortBy?: 'nombre' | 'precio' | 'fechaElaboracion' | 'fechaVencimiento' | 'createdAt'
    order?: 'asc' | 'desc'
  }): Promise<ProductsResponse> => {
    const response = await apiClient.get<ProductsResponse>('/products', { params })
    return response.data
  },

  // Obtener producto por ID
  getById: async (id: string): Promise<Product> => {
    const response = await apiClient.get<ProductResponse>(`/products/${id}`)
    return response.data.product
  },

  // Crear producto
  create: async (data: CreateProductDTO): Promise<Product> => {
    const response = await apiClient.post<ProductResponse>('/products', data)
    return response.data.product
  },

  // Actualizar producto
  update: async (id: string, data: UpdateProductDTO): Promise<Product> => {
    const response = await apiClient.put<ProductResponse>(`/products/${id}`, data)
    return response.data.product
  },

  // Eliminar producto
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/products/${id}`)
  },
}
