import { useState } from 'react'
import { productsService, type CreateProductDTO, type UpdateProductDTO } from '@/lib/api'
import type { Product } from '@/types'

export const useProductMutations = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createProduct = async (data: CreateProductDTO): Promise<Product | null> => {
    try {
      setLoading(true)
      setError(null)
      const product = await productsService.create(data)
      return product
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al crear producto')
      console.error('Error creating product:', err)
      return null
    } finally {
      setLoading(false)
    }
  }

  const updateProduct = async (id: string, data: UpdateProductDTO): Promise<Product | null> => {
    try {
      setLoading(true)
      setError(null)
      const product = await productsService.update(id, data)
      return product
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al actualizar producto')
      console.error('Error updating product:', err)
      return null
    } finally {
      setLoading(false)
    }
  }

  const deleteProduct = async (id: string): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      await productsService.delete(id)
      return true
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al eliminar producto')
      console.error('Error deleting product:', err)
      return false
    } finally {
      setLoading(false)
    }
  }

  return {
    createProduct,
    updateProduct,
    deleteProduct,
    loading,
    error,
  }
}
