
import { Shield, Zap, Database } from "lucide-react"

const Features = () => {
    return (
        <section className="container mx-auto px-4 py-16 md:py-24">
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                <div className="relative flex flex-col items-center text-center space-y-4 p-8 rounded-2xl bg-linear-to-br from-card to-card/50 hover:shadow-2xl hover:scale-105 transition-all duration-300 before:absolute before:inset-0 before:rounded-2xl before:p-[2px] before:bg-linear-to-br before:from-primary/60 before:via-primary/30 before:to-transparent before:-z-10">
                    <div className="relative z-10 w-16 h-16 rounded-xl bg-linear-to-br from-primary/20 to-primary/5 flex items-center justify-center shadow-lg">
                        <Shield className="w-8 h-8 text-primary drop-shadow-sm" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground">Seguro y Confiable</h3>
                    <p className="text-foreground/80 text-base leading-relaxed">
                        Gestión profesional con los más altos estándares de seguridad para datos sensibles.
                    </p>
                </div>

                <div className="relative flex flex-col items-center text-center space-y-4 p-8 rounded-2xl bg-linear-to-br from-card to-card/50 hover:shadow-2xl hover:scale-105 transition-all duration-300 before:absolute before:inset-0 before:rounded-2xl before:p-[2px] before:bg-linear-to-br before:from-primary/60 before:via-primary/30 before:to-transparent before:-z-10">
                    <div className="relative z-10 w-16 h-16 rounded-xl bg-linear-to-br from-primary/20 to-primary/5 flex items-center justify-center shadow-lg">
                        <Zap className="w-8 h-8 text-primary drop-shadow-sm" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground">Rápido y Moderno</h3>
                    <p className="text-foreground/80 text-base leading-relaxed">
                        Interface intuitiva diseñada por expertos para optimizar tu flujo de trabajo diario.
                    </p>
                </div>

                <div className="relative flex flex-col items-center text-center space-y-4 p-8 rounded-2xl bg-linear-to-br from-card to-card/50 hover:shadow-2xl hover:scale-105 transition-all duration-300 before:absolute before:inset-0 before:rounded-2xl before:p-[2px] before:bg-linear-to-br before:from-primary/60 before:via-primary/30 before:to-transparent before:-z-10">
                    <div className="relative z-10 w-16 h-16 rounded-xl bg-linear-to-br from-primary/20 to-primary/5 flex items-center justify-center shadow-lg">
                        <Database className="w-8 h-8 text-primary drop-shadow-sm" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground">Control Completo</h3>
                    <p className="text-foreground/80 text-base leading-relaxed">
                        Gestiona fechas de vencimiento, precios y stock con precisión milimétrica.
                    </p>
                </div>
            </div>
        </section>
    )
}

export default Features
