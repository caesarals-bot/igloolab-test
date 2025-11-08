import { Link } from "react-router"

const Footer = () => {
    return (
        <footer className="border-t border-border bg-muted/30">
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-base text-muted-foreground">
                        © 2025 igloolab. Agencia digital para la industria farmacéutica.
                    </p>
                    <div className="flex items-center gap-6">
                        <Link to="#" className="text-base text-muted-foreground hover:text-foreground transition-colors">
                            Términos
                        </Link>
                        <Link to="#" className="text-base text-muted-foreground hover:text-foreground transition-colors">
                            Privacidad
                        </Link>
                        <Link to="#" className="text-base text-muted-foreground hover:text-foreground transition-colors">
                            Contacto
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
