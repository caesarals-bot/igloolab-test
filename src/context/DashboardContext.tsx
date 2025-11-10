import React, { createContext, useContext, useState, useCallback } from 'react'
import type { ReactNode } from 'react'
import { dashboardService, type DashboardStats, type ExpiryStatus } from '@/lib/api'
import { mockProducts } from '@/data/mockData'

interface DashboardContextType {
  // State
  stats: DashboardStats | null
  expiryStatus: ExpiryStatus | null
  loading: boolean
  error: string | null
  
  // Actions
  fetchStats: () => Promise<void>
  fetchExpiryStatus: () => Promise<void>
  refreshDashboard: () => Promise<void>
  clearError: () => void
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined)

export const DashboardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [expiryStatus, setExpiryStatus] = useState<ExpiryStatus | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch dashboard stats
  const fetchStats = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Obtener stats del backend
      const data = await dashboardService.getStats()
      
      // Obtener expiry status (productos vencidos) del backend
      const expiryStatus = await dashboardService.getExpiryStatus()
      
      // Combinar datos de ambos endpoints
      // El backend ya calcula todo, solo necesitamos obtener la lista de vencidos
      if (expiryStatus.expired > 0) {
        
        // Obtener lista de productos vencidos
        try {
          const { productsService } = await import('@/lib/api')
          const response = await productsService.getAll({ limit: 1000 })
          const products = response.products || []
          
          const now = new Date()
          
          // Filtrar productos vencidos
          const expiredProducts = products.filter((p: any) => {
            const expiryDate = new Date(p.fechaVencimiento)
            return expiryDate < now
          })
          
          const expiredProductsList = expiredProducts.map((p: any) => {
            const expiryDate = new Date(p.fechaVencimiento)
            const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
            return {
              id: p.id,
              nombre: p.nombre,
              fechaVencimiento: p.fechaVencimiento,
              daysUntilExpiry
            }
          })
          
          data.expiredProducts = expiryStatus.expired
          data.expiredProductsList = expiredProductsList
        } catch (err) {
          data.expiredProducts = expiryStatus.expired
          data.expiredProductsList = []
        }
      } else {
        data.expiredProducts = 0
        data.expiredProductsList = []
      }
      
      setStats(data)
    } catch (err: any) {
      
      // Calcular stats desde mockProducts
      const totalProducts = mockProducts.length
      const totalInventoryValue = mockProducts.reduce((sum, p) => sum + Number(p.precio), 0)
      const averagePrice = totalInventoryValue / totalProducts
      
      // Calcular productos vencidos y por vencer
      const now = new Date()
      const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
      
      // Productos VENCIDOS (fecha < hoy)
      const expiredProducts = mockProducts.filter(p => {
        const expiryDate = new Date(p.fechaVencimiento)
        return expiryDate < now
      }).length
      
      const expiredProductsList = mockProducts
        .filter(p => {
          const expiryDate = new Date(p.fechaVencimiento)
          return expiryDate < now
        })
        .map(p => {
          const expiryDate = new Date(p.fechaVencimiento)
          const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
          return {
            id: p.id,
            nombre: p.nombre,
            fechaVencimiento: p.fechaVencimiento,
            daysUntilExpiry
          }
        })
      
      // Productos POR VENCER (próximos 30 días, pero NO vencidos)
      const expiringProducts = mockProducts.filter(p => {
        const expiryDate = new Date(p.fechaVencimiento)
        return expiryDate <= thirtyDaysFromNow && expiryDate >= now
      }).length
      
      const expiringProductsList = mockProducts
        .filter(p => {
          const expiryDate = new Date(p.fechaVencimiento)
          return expiryDate <= thirtyDaysFromNow && expiryDate >= now
        })
        .map(p => {
          const expiryDate = new Date(p.fechaVencimiento)
          const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
          return {
            id: p.id,
            nombre: p.nombre,
            fechaVencimiento: p.fechaVencimiento,
            daysUntilExpiry
          }
        })
      
      const mockStats: DashboardStats = {
        totalProducts,
        totalInventoryValue,
        averagePrice,
        expiredProducts,
        expiredProductsList,
        expiringProducts,
        expiringProductsList
      }
      
      setStats(mockStats)
      setError('⚠️ Usando datos de demostración (backend no conectado)')
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch expiry status
  const fetchExpiryStatus = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await dashboardService.getExpiryStatus()
      setExpiryStatus(data)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar estado de vencimientos')
      console.error('Error fetching expiry status:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Refresh all dashboard data
  const refreshDashboard = useCallback(async () => {
    await Promise.all([
      fetchStats(),
      fetchExpiryStatus()
    ])
  }, [fetchStats, fetchExpiryStatus])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const value: DashboardContextType = {
    stats,
    expiryStatus,
    loading,
    error,
    fetchStats,
    fetchExpiryStatus,
    refreshDashboard,
    clearError,
  }

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  )
}

// Custom hook para usar el contexto
export const useDashboardContext = () => {
  const context = useContext(DashboardContext)
  if (!context) {
    throw new Error('useDashboardContext must be used within a DashboardProvider')
  }
  return context
}
