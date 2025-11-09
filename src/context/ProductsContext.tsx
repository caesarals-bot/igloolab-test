import React, { createContext, useContext, useState, useCallback } from 'react'
import type { ReactNode } from 'react'
import { productsService, type CreateProductDTO, type UpdateProductDTO } from '@/lib/api'
import type { Product } from '@/types'

interface ProductsContextType {
  // State
  products: Product[]
  selectedProduct: Product | null
  loading: boolean
  error: string | null
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
  
  // Actions
  fetchProducts: (params?: {
    page?: number
    limit?: number
    search?: string
    sortBy?: 'nombre' | 'precio' | 'fechaElaboracion' | 'fechaVencimiento' | 'createdAt'
    order?: 'asc' | 'desc'
  }) => Promise<void>
  fetchProductById: (id: string) => Promise<void>
  createProduct: (data: CreateProductDTO) => Promise<Product | null>
  updateProduct: (id: string, data: UpdateProductDTO) => Promise<Product | null>
  deleteProduct: (id: string) => Promise<boolean>
  setSelectedProduct: (product: Product | null) => void
  clearError: () => void
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined)

export const ProductsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  })

  // Fetch products with filters
  const fetchProducts = useCallback(async (params?: {
    page?: number
    limit?: number
    search?: string
    sortBy?: 'nombre' | 'precio' | 'fechaElaboracion' | 'fechaVencimiento' | 'createdAt'
    order?: 'asc' | 'desc'
  }) => {
    try {
      setLoading(true)
      setError(null)
      const data = await productsService.getAll(params)
      setProducts(data.products)
      setPagination(data.pagination)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar productos')
      console.error('Error fetching products:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch single product by ID
  const fetchProductById = useCallback(async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      const product = await productsService.getById(id)
      setSelectedProduct(product)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar producto')
      console.error('Error fetching product:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Create product
  const createProduct = useCallback(async (data: CreateProductDTO): Promise<Product | null> => {
    try {
      setLoading(true)
      setError(null)
      const product = await productsService.create(data)
      
      // Add to products list
      setProducts(prev => [product, ...prev])
      
      return product
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al crear producto')
      console.error('Error creating product:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  // Update product
  const updateProduct = useCallback(async (id: string, data: UpdateProductDTO): Promise<Product | null> => {
    try {
      setLoading(true)
      setError(null)
      const updatedProduct = await productsService.update(id, data)
      
      // Update in products list
      setProducts(prev => 
        prev.map(p => p.id === id ? updatedProduct : p)
      )
      
      // Update selected if it's the same
      if (selectedProduct?.id === id) {
        setSelectedProduct(updatedProduct)
      }
      
      return updatedProduct
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al actualizar producto')
      console.error('Error updating product:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [selectedProduct])

  // Delete product
  const deleteProduct = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      await productsService.delete(id)
      
      // Remove from products list
      setProducts(prev => prev.filter(p => p.id !== id))
      
      // Clear selected if it's the same
      if (selectedProduct?.id === id) {
        setSelectedProduct(null)
      }
      
      return true
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al eliminar producto')
      console.error('Error deleting product:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [selectedProduct])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const value: ProductsContextType = {
    products,
    selectedProduct,
    loading,
    error,
    pagination,
    fetchProducts,
    fetchProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    setSelectedProduct,
    clearError,
  }

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  )
}

// Custom hook para usar el contexto
export const useProductsContext = () => {
  const context = useContext(ProductsContext)
  if (!context) {
    throw new Error('useProductsContext must be used within a ProductsProvider')
  }
  return context
}
