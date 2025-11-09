import { useEffect } from "react"

/**
 * Hook para precargar componentes lazy de forma inteligente
 * Precarga componentes cuando el usuario pasa el mouse sobre un enlace/botón
 */
export function usePreload() {
  /**
   * Precarga un componente lazy cuando se hace hover
   * @param lazyComponent Componente lazy () => import('./Component')
   */
  const preloadOnHover = (lazyComponent: () => Promise<any>) => {
    return {
      onMouseEnter: () => {
        lazyComponent()
      },
      onTouchStart: () => {
        lazyComponent()
      },
    }
  }

  /**
   * Precarga componentes críticos después de que se carga la página inicial
   * @param components Array de componentes lazy para precargar
   * @param delay Tiempo en ms antes de precargar (default: 2000ms)
   */
  const preloadCritical = (
    components: Array<() => Promise<any>>,
    delay: number = 2000
  ) => {
    useEffect(() => {
      const timer = setTimeout(() => {
        components.forEach((component) => {
          component()
        })
      }, delay)

      return () => clearTimeout(timer)
    }, [components, delay])
  }

  /**
   * Precarga componentes cuando el navegador está en idle
   * Usa requestIdleCallback si está disponible
   */
  const preloadOnIdle = (components: Array<() => Promise<any>>) => {
    useEffect(() => {
      if ('requestIdleCallback' in window) {
        const id = requestIdleCallback(() => {
          components.forEach((component) => {
            component()
          })
        })
        return () => cancelIdleCallback(id)
      } else {
        // Fallback para navegadores que no soportan requestIdleCallback
        const timer = setTimeout(() => {
          components.forEach((component) => {
            component()
          })
        }, 1000)
        return () => clearTimeout(timer)
      }
    }, [components])
  }

  return {
    preloadOnHover,
    preloadCritical,
    preloadOnIdle,
  }
}
