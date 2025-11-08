import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppIgloobal from './AppIgloobal.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppIgloobal />
  </StrictMode>,
)
