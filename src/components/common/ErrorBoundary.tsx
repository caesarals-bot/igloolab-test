import { Component, type ReactNode } from "react"
import { AlertTriangle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <div className="max-w-md w-full space-y-6 text-center">
            <div className="flex justify-center">
              <div className="p-4 bg-destructive/10 rounded-full">
                <AlertTriangle className="w-12 h-12 text-destructive" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h1 className="text-2xl font-bold">¡Algo salió mal!</h1>
              <p className="text-muted-foreground">
                Lo sentimos, ocurrió un error inesperado. Por favor, intenta recargar la página.
              </p>
            </div>

            {this.state.error && (
              <details className="text-left p-4 bg-muted rounded-lg text-sm">
                <summary className="cursor-pointer font-medium mb-2">
                  Detalles técnicos
                </summary>
                <pre className="overflow-auto text-xs">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}

            <div className="flex gap-3 justify-center">
              <Button
                onClick={this.handleReset}
                variant="outline"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Intentar de nuevo
              </Button>
              <Button
                onClick={() => window.location.href = "/"}
              >
                Volver al inicio
              </Button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Error Fallback más compacto para componentes
export function ComponentErrorFallback({ error, reset }: { error?: Error; reset?: () => void }) {
  return (
    <div className="p-6 border border-destructive/50 rounded-lg bg-destructive/5">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-destructive mt-0.5" />
        <div className="flex-1 space-y-2">
          <h3 className="font-semibold text-destructive">Error al cargar componente</h3>
          <p className="text-sm text-muted-foreground">
            No se pudo cargar este componente. Por favor, intenta nuevamente.
          </p>
          {error && (
            <p className="text-xs font-mono bg-muted p-2 rounded">
              {error.message}
            </p>
          )}
          {reset && (
            <Button size="sm" variant="outline" onClick={reset}>
              <RefreshCw className="w-3 h-3 mr-2" />
              Reintentar
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
