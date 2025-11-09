import React, { createContext, useContext, useState, useCallback } from 'react'
import type { ReactNode } from 'react'
import { dashboardService, type DashboardStats, type ExpiryStatus } from '@/lib/api'

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
      const data = await dashboardService.getStats()
      setStats(data)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar estadísticas')
      console.error('Error fetching dashboard stats:', err)
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
