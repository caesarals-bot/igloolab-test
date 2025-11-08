
import { Link } from "react-router"
import { Button } from "@/components/ui/button"
import { LogOut, Pill } from "lucide-react"
import type { User } from "@/types"

interface NavbarProps {
  user: User | null
}

export function Navbar({ user }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-semibold text-xl">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-primary-foreground">
            <Pill className="w-6 h-6" />
          </div>
          <span className="text-foreground">igloolab</span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-6">
          {user ? (
            // Estado privado (usuario autenticado)
            <>
              <Link
                to="/dashboard"
                className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Dashboard
              </Link>
              <div className="flex items-center gap-3">
                <span className="text-base text-muted-foreground hidden sm:inline-block">
                  Bienvenido, <span className="font-medium text-foreground">{user.nombre}</span>
                </span>
                <Button variant="ghost" size="sm" className="gap-2 text-base">
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline-block">Cerrar Sesión</span>
                </Button>
              </div>
            </>
          ) : (
            // Estado público (usuario no autenticado)
            <>
              <Link
                to="/"
                className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Home
              </Link>
              <Link
                to="/productos"
                className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Productos
              </Link>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="text-base" asChild>
                  <Link to="/login">Iniciar Sesión</Link>
                </Button>
                <Button size="sm" className="text-base" asChild>
                  <Link to="/register">Registrarse</Link>
                </Button>
              </div>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
