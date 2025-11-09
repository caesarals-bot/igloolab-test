import apiClient from './client'

// Dashboard types
export type DashboardStats = {
  totalProducts: number
  totalInventoryValue: number
  averagePrice: number
  expiredProducts: number
  expiredProductsList: ExpiringProduct[]
  expiringProducts: number
  expiringProductsList: ExpiringProduct[]
}

export type ExpiringProduct = {
  id: string
  nombre: string
  fechaVencimiento: string
  daysUntilExpiry: number
}

export type ExpiryStatus = {
  expired: number
  expiringSoon: number
  valid: number
}

export type DashboardStatsResponse = {
  stats: DashboardStats
}

export type ExpiryStatusResponse = {
  expiryStatus: ExpiryStatus
}

export const dashboardService = {
  // Obtener estadísticas del dashboard
  getStats: async (): Promise<DashboardStats> => {
    const response = await apiClient.get<DashboardStatsResponse>('/dashboard/stats')
    return response.data.stats
  },

  // Obtener estado de vencimientos
  getExpiryStatus: async (): Promise<ExpiryStatus> => {
    const response = await apiClient.get<ExpiryStatusResponse>('/dashboard/expiry-status')
    return response.data.expiryStatus
  },
}
