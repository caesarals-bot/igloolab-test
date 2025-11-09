import React from 'react'
import type { ReactNode } from 'react'
import { ProductsProvider } from './ProductsContext'
import { DashboardProvider } from './DashboardContext'

// Combinar todos los providers en uno solo
export const AppProviders: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ProductsProvider>
      <DashboardProvider>
        {children}
      </DashboardProvider>
    </ProductsProvider>
  )
}

// Re-export contexts y hooks
export { useProductsContext } from './ProductsContext'
export { useDashboardContext } from './DashboardContext'
