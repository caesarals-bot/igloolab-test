import { useState, useEffect } from 'react'
import { productsService } from '@/lib/api'
import type { Product } from '@/types'

interface UseProductsOptions {
  page?: number
  limit?: number
  search?: string
  sortBy?: 'nombre' | 'precio' | 'fechaElaboracion' | 'fechaVencimiento' | 'createdAt'
  order?: 'asc' | 'desc'
  autoFetch?: boolean
}

export const useProducts = (options: UseProductsOptions = {}) => {
  const {
    page = 1,
    limit = 10,
    search = '',
    sortBy = 'nombre',
    order = 'asc',
    autoFetch = true,
  } = options

  const [products, setProducts] = useState<Product[]>([])
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await productsService.getAll({ page, limit, search, sortBy, order })
      setProducts(data.products)
      setPagination(data.pagination)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar productos')
      console.error('Error fetching products:', err)
    } finally {
      setLoading(false)
    }
  }

  const refetch = () => {
    fetchProducts()
  }

  useEffect(() => {
    if (autoFetch) {
      fetchProducts()
    }
  }, [page, limit, search, sortBy, order])

  return {
    products,
    pagination,
    loading,
    error,
    refetch,
  }
}
