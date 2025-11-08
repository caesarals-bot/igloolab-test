import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { mockUser } from "@/data/mockData"

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configuración</h1>
        <p className="text-muted-foreground mt-1">
          Gestiona la configuración de tu cuenta y preferencias
        </p>
      </div>

      {/* Profile Settings */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-xl font-semibold mb-6">Información del Perfil</h2>
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre Completo</Label>
              <Input id="name" defaultValue={mockUser.nombre} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input id="email" type="email" defaultValue={mockUser.email} />
            </div>
          </div>
          <div className="flex justify-end">
            <Button>Guardar Cambios</Button>
          </div>
        </form>
      </div>

      {/* System Settings */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-xl font-semibold mb-6">Configuración del Sistema</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-border">
            <div className="space-y-1">
              <p className="font-medium">Notificaciones de Vencimiento</p>
              <p className="text-sm text-muted-foreground">
                Recibe alertas cuando los productos estén próximos a vencer
              </p>
            </div>
            <Button variant="outline" size="sm">Activar</Button>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-border">
            <div className="space-y-1">
              <p className="font-medium">Reportes Automáticos</p>
              <p className="text-sm text-muted-foreground">
                Genera reportes mensuales automáticamente
              </p>
            </div>
            <Button variant="outline" size="sm">Configurar</Button>
          </div>
          <div className="flex items-center justify-between py-3">
            <div className="space-y-1">
              <p className="font-medium">Respaldo de Datos</p>
              <p className="text-sm text-muted-foreground">
                Exporta una copia de seguridad de tus datos
              </p>
            </div>
            <Button variant="outline" size="sm">Descargar</Button>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded-lg border border-destructive bg-card p-6">
        <h2 className="text-xl font-semibold text-destructive mb-4">Zona de Peligro</h2>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Las siguientes acciones son irreversibles. Procede con precaución.
          </p>
          <Button variant="destructive" size="sm">
            Eliminar Cuenta
          </Button>
        </div>
      </div>
    </div>
  )
}
