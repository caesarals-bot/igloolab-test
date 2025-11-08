import { Outlet, Link, useLocation } from "react-router"
import { Pill, LayoutDashboard, Package, Settings, LogOut, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { mockUser } from "@/data/mockData"
import { useState } from "react"

const AdminLayout = () => {
    const location = useLocation()
    const [sidebarOpen, setSidebarOpen] = useState(false)

    const navigation = [
        { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
        { name: "Medicamentos", href: "/admin/medications", icon: Package },
        { name: "Configuración", href: "/admin/settings", icon: Settings },
    ]

    const isActive = (path: string) => location.pathname === path

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

                    {/* User Info */}
                    <div className="p-4 border-b border-border">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-sm font-medium text-primary">
                                    {mockUser.nombre.charAt(0)}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground truncate">{mockUser.nombre}</p>
                                <p className="text-xs text-muted-foreground truncate">{mockUser.email}</p>
                            </div>
                        </div>
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

                    {/* Logout Button */}
                    <div className="p-4 border-t border-border">
                        <Button
                            variant="ghost"
                            className="w-full justify-start gap-3 text-base"
                            onClick={() => {
                                // Handle logout
                                console.log("Logout")
                            }}
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
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default AdminLayout
