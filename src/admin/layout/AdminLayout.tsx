import { Suspense, useState, useEffect } from "react"
import { Outlet, Link, useLocation, useNavigate } from "react-router"
import { Pill, LayoutDashboard, Package, Settings, LogOut, Menu, X, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DashboardSkeleton } from "@/components/common/PageSkeleton"
import { ErrorBoundary } from "@/components/common/ErrorBoundary"
import { useAuthContext } from "@/context"

const AdminLayout = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const { user, logout, loading, isAuthenticated } = useAuthContext()
    const [sidebarOpen, setSidebarOpen] = useState(false)

    // Protección de ruta
    useEffect(() => {
        if (!loading && !isAuthenticated) {
            navigate("/login", { replace: true })
        }
    }, [loading, isAuthenticated, navigate])

    const handleLogout = () => {
        logout()
        navigate("/login")
    }

    const navigation = [
        { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
        { name: "Medicamentos", href: "/admin/medications", icon: Package },
        { name: "Configuración", href: "/admin/settings", icon: Settings },
    ]

    const isActive = (path: string) => location.pathname === path

    // Mostrar loader mientras verifica autenticación
    if (loading) {
        return <DashboardSkeleton />
    }

    // Si no está autenticado, no renderizar nada (useEffect redirige)
    if (!isAuthenticated) {
        return null
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 z-40 h-screen w-64 bg-card border-r border-border transition-transform lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Logo & Close Button */}
                    <div className="flex items-center justify-between p-4 border-b border-border">
                        <Link to="/" className="flex items-center gap-2 font-semibold text-lg hover:opacity-80 transition-opacity">
                            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-primary-foreground">
                                <Pill className="w-6 h-6" />
                            </div>
                            <span className="text-foreground">igloolab</span>
                        </Link>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden"
                            onClick={() => setSidebarOpen(false)}
                        >
                            <X className="w-5 h-5" />
                        </Button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-2">
                        {navigation.map((item) => {
                            const Icon = item.icon
                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-base font-medium transition-colors ${isActive(item.href)
                                            ? "bg-primary text-primary-foreground"
                                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                        }`}
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <Icon className="w-5 h-5" />
                                    {item.name}
                                </Link>
                            )
                        })}
                    </nav>

                    {/* User Info & Logout */}
                    <div className="p-4 border-t border-border space-y-3">
                        {user && (
                            <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-muted">
                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground">
                                    <User className="w-4 h-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-foreground truncate">{user.nombre}</p>
                                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                                </div>
                            </div>
                        )}
                        <Button
                            variant="ghost"
                            className="w-full justify-start gap-3 text-base"
                            onClick={handleLogout}
                        >
                            <LogOut className="w-5 h-5" />
                            Cerrar Sesión
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="lg:pl-64">
                {/* Top Header with Mobile Menu */}
                <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
                    <div className="flex items-center justify-between px-4 py-3">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <Menu className="w-5 h-5" />
                        </Button>
                        <div className="flex-1 lg:hidden" />
                        <div className="text-sm text-muted-foreground">
                            Panel de Administración
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-4 md:p-8">
                    <ErrorBoundary>
                        <Suspense fallback={<DashboardSkeleton />}>
                            <Outlet />
                        </Suspense>
                    </ErrorBoundary>
                </main>
            </div>
        </div>
    )
}

export default AdminLayout
