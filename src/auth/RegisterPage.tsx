import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link, useNavigate } from "react-router"
import { ArrowLeft } from "lucide-react"

export default function RegisterPage() {
  const navigate = useNavigate()

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    // Simular registro y redirigir al admin
    navigate("/admin/dashboard")
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header con botón volver */}
      <div className="p-4">
        <Link to="/">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio
          </Button>
        </Link>
      </div>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-2xl font-bold">Crear Cuenta</CardTitle>
            <CardDescription>Regístrate para comenzar a gestionar tu inventario</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre Completo</Label>
                  <Input id="name" type="text" placeholder="Dr. Juan Pérez" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <Input id="email" type="email" placeholder="tu@email.com" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <Input id="password" type="password" placeholder="••••••••" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmar Contraseña</Label>
                  <Input id="confirm-password" type="password" placeholder="••••••••" required />
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg">
                Crear Cuenta
              </Button>
            </form>

            <div className="text-center text-sm text-muted-foreground">
              ¿Ya tienes una cuenta?{" "}
              <Link to="/login" className="text-primary font-medium hover:underline">
                Inicia sesión
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
