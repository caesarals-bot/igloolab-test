import { mockProducts } from "@/data/mockData"
import { Package, DollarSign, AlertTriangle, TrendingUp } from "lucide-react"
import { Link } from "react-router"
import { Button } from "@/components/ui/button"

export default function DashboardPage() {
  const totalProducts = mockProducts.length
  const totalValue = mockProducts.reduce((sum, p) => sum + p.precio, 0)
  const expiringSoon = mockProducts.filter((p) => {
    const expiryDate = new Date(p.fechaVencimiento)
    const today = new Date()
    const diffTime = expiryDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 30 && diffDays > 0
  }).length

  const stats = [
    {
      name: "Total Medicamentos",
      value: totalProducts,
      icon: Package,
      color: "text-blue-600 bg-blue-100",
    },
    {
      name: "Valor Inventario",
      value: `$${totalValue.toFixed(2)}`,
      icon: DollarSign,
      color: "text-green-600 bg-green-100",
    },
    {
      name: "Por Vencer (30 días)",
      value: expiringSoon,
      icon: AlertTriangle,
      color: "text-orange-600 bg-orange-100",
    },
    {
      name: "Precio Promedio",
      value: `$${(totalValue / totalProducts).toFixed(2)}`,
      icon: TrendingUp,
      color: "text-purple-600 bg-purple-100",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Bienvenido al panel de administración de igloolab
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
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
              <p className="font-medium">Inventario actualizado</p>
              <p className="text-sm text-muted-foreground">Se agregaron 5 nuevos productos</p>
            </div>
            <span className="text-sm text-muted-foreground">Hoy</span>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
            <div className="space-y-1">
              <p className="font-medium">Reporte generado</p>
              <p className="text-sm text-muted-foreground">Reporte mensual de ventas</p>
            </div>
            <span className="text-sm text-muted-foreground">Ayer</span>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
            <div className="space-y-1">
              <p className="font-medium">Alerta de vencimiento</p>
              <p className="text-sm text-muted-foreground">{expiringSoon} productos próximos a vencer</p>
            </div>
            <span className="text-sm text-muted-foreground">Hace 2 días</span>
          </div>
        </div>
      </div>
    </div>
  )
}
