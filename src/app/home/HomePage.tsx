import HeroPage from "../components/hero/HeroPage"
import Features from "../components/Features/Features"
import CtaSection from "../components/calltoaccion/CtaSection"
import { SEO } from "@/components/seo/SEO"

export default function HomePage() {
  return (
      <>
        <SEO
          title="Inicio - Gestión Inteligente de Medicamentos"
          description="Plataforma digital para la gestión de medicamentos en laboratorios y farmacias. Control de inventario, fechas de vencimiento y productos farmacéuticos."
          keywords="gestión medicamentos, farmacia online, laboratorios, control de inventario, productos farmacéuticos"
          url="https://igloolab.co"
          type="website"
          structuredData={{
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "igloolab",
            "url": "https://igloolab.co",
            "description": "Plataforma Digital para la Industria Farmacéutica",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://igloolab.co/productos?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          }}
        />
        
        {/* Hero Section */}
        <HeroPage />

        {/* Features Section */}
        <Features />

        {/* CTA Section */}
        <CtaSection />
      </>
  )
}
