import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { Link } from "react-router"

const HeroPage = () => {
    return (
        <section className="container mx-auto px-4 py-20 md:py-32">
            <div className="max-w-4xl mx-auto text-center space-y-8">
                <div className="inline-block px-5 py-2 rounded-full bg-primary/10 border-2 border-primary/30 text-primary text-base font-semibold mb-4">
                    Plataforma Digital para la Industria Farmacéutica
                </div>

                <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-balance leading-tight animate-fade-in-up">
                    Gestión Inteligente de <span className="text-primary">Medicamentos</span>
                </h1>

                <p className="text-xl md:text-2xl text-foreground/70 text-pretty max-w-2xl mx-auto leading-relaxed">
                    La solución profesional diseñada para laboratorios y profesionales de la salud. Control preciso, confiable
                    y moderno de tu inventario farmacéutico.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                    <Button size="lg" className="gap-2 text-base" asChild>
                        <Link to="/dashboard">
                            Acceder a la Plataforma
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </Button>
                    <Button size="lg" variant="outline" className="text-base bg-transparent" asChild>
                        <Link to="/register">Crear Cuenta</Link>
                    </Button>
                </div>
            </div>
        </section>
    )
}

export default HeroPage

