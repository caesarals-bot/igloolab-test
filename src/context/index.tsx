import React from 'react'
import type { ReactNode } from 'react'
import { AuthProvider } from './AuthContext'
import { ProductsProvider } from './ProductsContext'
import { DashboardProvider } from './DashboardContext'

// Combinar todos los providers en uno solo
export const AppProviders: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <AuthProvider>
      <ProductsProvider>
        <DashboardProvider>
          {children}
        </DashboardProvider>
      </ProductsProvider>
    </AuthProvider>
  )
}

// Re-export contexts y hooks
export { useAuthContext } from './AuthContext'
export { useProductsContext } from './ProductsContext'
export { useDashboardContext } from './DashboardContext'
