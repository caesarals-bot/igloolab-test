
import { Link } from "react-router"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const CtaSection = () => {
    return (
        <section className="container mx-auto px-4 py-20 md:py-32">
            <div className="max-w-4xl mx-auto text-center space-y-8 p-12 md:p-16 rounded-3xl bg-linear-to-br from-primary via-primary to-primary/80 text-primary-foreground shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-tr from-transparent via-white/5 to-white/10"></div>
                <div className="relative z-10">
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-balance leading-tight">
                        ¿Listo para modernizar tu gestión farmacéutica?
                    </h2>
                    <p className="text-xl md:text-2xl text-primary-foreground/95 text-pretty max-w-2xl mx-auto">
                        Únete a los profesionales de la salud que confían en igloolab.
                    </p>
                    <Button size="lg" variant="secondary" className="gap-2 text-lg px-8 py-6 mt-4 hover:scale-105 transition-transform" asChild>
                        <Link to="/register">
                            Comenzar Ahora
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    )
}

export default CtaSection
