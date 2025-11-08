

import HeroPage from "../components/hero/HeroPage"
import Features from "../components/Features/Features"
import CtaSection from "../components/calltoaccion/CtaSection"

export default function HomePage() {
  return (
      <>
        {/* Hero Section */}
        <HeroPage />

        {/* Features Section */}
        <Features />

        {/* CTA Section */}
        <CtaSection />
      </>
  )
}
