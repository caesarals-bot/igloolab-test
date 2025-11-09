import { useEffect } from "react"
import { useDashboardContext } from "@/context"
import { Package, DollarSign, AlertTriangle, TrendingUp, RefreshCw } from "lucide-react"
import { Link } from "react-router"
import { Button } from "@/components/ui/button"
import { SEO } from "@/components/seo/SEO"

export default function DashboardPage() {
  const { stats, loading, error, fetchStats, refreshDashboard } = useDashboardContext()

  // Fetch stats on mount
  useEffect(() => {
    fetchStats()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Skeleton loader
  if (loading && !stats) {
    return (
      <>
        <SEO
          title="Dashboard - Panel de Administración"
          description="Panel de control administrativo de igloolab"
          noindex={true}
        />
        <div className="space-y-8">
          <div>
            <div className="h-9 w-48 bg-muted animate-pulse rounded"></div>
            <div className="h-5 w-96 bg-muted animate-pulse rounded mt-2"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-lg border border-border bg-card p-6">
                <div className="h-20 bg-muted animate-pulse rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </>
    )
  }

  // Error state
  if (error && !stats) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        </div>
        <div className="text-center py-12">
          <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg max-w-md mx-auto">
            <p className="font-medium">Error al cargar estadísticas</p>
            <p className="text-sm mt-1">{error}</p>
            <Button 
              onClick={() => fetchStats()}
              variant="outline"
              className="mt-3"
            >
              Intentar de nuevo
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Data loaded
  const statsCards = stats ? [
    {
      name: "Total Medicamentos",
      value: stats.totalProducts,
      icon: Package,
      color: "text-blue-600 bg-blue-100",
    },
    {
      name: "Valor Inventario",
      value: `$${stats.totalInventoryValue.toLocaleString('es-CO', { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: "text-green-600 bg-green-100",
    },
    {
      name: "Por Vencer (30 días)",
      value: stats.expiringProducts,
      icon: AlertTriangle,
      color: "text-orange-600 bg-orange-100",
    },
    {
      name: "Precio Promedio",
      value: `$${stats.averagePrice.toLocaleString('es-CO', { minimumFractionDigits: 2 })}`,
      icon: TrendingUp,
      color: "text-purple-600 bg-purple-100",
    },
  ] : []

  return (
    <>
      <SEO
        title="Dashboard - Panel de Administración"
        description="Panel de control administrativo de igloolab"
        noindex={true}
      />
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Bienvenido al panel de administración de igloolab
            </p>
          </div>
        <Button
          onClick={() => refreshDashboard()}
          variant="outline"
          size="sm"
          disabled={loading}
          className="gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Actualizar
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.name}
              className="rounded-lg border border-border bg-card p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">{stat.name}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Expiring Products List */}
      {stats && stats.expiringProductsList.length > 0 && (
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="text-xl font-semibold mb-4">Productos Próximos a Vencer</h2>
          <div className="space-y-3">
            {stats.expiringProductsList.map((product) => (
              <div 
                key={product.id}
                className="flex items-center justify-between py-3 border-b border-border last:border-0"
              >
                <div className="space-y-1">
                  <p className="font-medium">{product.nombre}</p>
                  <p className="text-sm text-muted-foreground">
                    Vence: {new Date(product.fechaVencimiento).toLocaleDateString('es-CO')}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  product.daysUntilExpiry <= 7 
                    ? 'bg-red-100 text-red-700'
                    : product.daysUntilExpiry <= 15
                    ? 'bg-orange-100 text-orange-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {product.daysUntilExpiry} días
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-xl font-semibold mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link to="/admin/medications">
            <Button variant="outline" className="w-full h-24 flex-col gap-2 bg-transparent">
              <Package className="w-8 h-8" />
              <span>Ver Medicamentos</span>
            </Button>
          </Link>
          <Link to="/admin/medications">
            <Button variant="outline" className="w-full h-24 flex-col gap-2 bg-transparent">
              <AlertTriangle className="w-8 h-8" />
              <span>Productos por Vencer</span>
            </Button>
          </Link>
          <Link to="/admin/settings">
            <Button variant="outline" className="w-full h-24 flex-col gap-2 bg-transparent">
              <TrendingUp className="w-8 h-8" />
              <span>Reportes</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-xl font-semibold mb-4">Actividad Reciente</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
            <div className="space-y-1">
              <p className="font-medium">Inventario sincronizado</p>
              <p className="text-sm text-muted-foreground">
                {stats ? `${stats.totalProducts} productos en sistema` : 'Cargando...'}
              </p>
            </div>
            <span className="text-sm text-muted-foreground">Hoy</span>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
            <div className="space-y-1">
              <p className="font-medium">Dashboard actualizado</p>
              <p className="text-sm text-muted-foreground">Estadísticas generales</p>
            </div>
            <span className="text-sm text-muted-foreground">Hace unos momentos</span>
          </div>
          {stats && stats.expiringProducts > 0 && (
            <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
              <div className="space-y-1">
                <p className="font-medium">Alerta de vencimiento</p>
                <p className="text-sm text-muted-foreground">
                  {stats.expiringProducts} producto{stats.expiringProducts !== 1 ? 's' : ''} próximo{stats.expiringProducts !== 1 ? 's' : ''} a vencer
                </p>
              </div>
              <span className="text-sm text-muted-foreground">Activo</span>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  )
}
