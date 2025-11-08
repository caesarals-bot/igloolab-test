import { Pill } from "lucide-react"


const HeroProducts = () => {
    return (
        <section className="border-b border-border bg-linear-to-b from-muted/50 to-background">
            <div className="container mx-auto px-4 py-12 md:py-16">
                <div className="max-w-3xl mx-auto text-center space-y-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-4">
                        <Pill className="w-8 h-8" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-foreground text-balance">Catálogo de Productos</h1>
                    <p className="text-lg text-muted-foreground text-pretty">
                        Explore nuestra selección de medicamentos de alta calidad. Haga clic en cualquier producto para ver
                        información detallada.
                    </p>
                </div>
            </div>
        </section>
    )
}

export default HeroProducts
