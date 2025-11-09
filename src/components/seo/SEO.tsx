import { useEffect } from "react"

export interface SEOProps {
  title?: string
  description?: string
  keywords?: string
  image?: string
  url?: string
  type?: string
  canonical?: string
  noindex?: boolean
  structuredData?: Record<string, any>
}

const DEFAULT_SEO: Required<Omit<SEOProps, 'structuredData'>> = {
  title: "igloolab - Plataforma Digital para la Industria Farmacéutica",
  description: "Gestión inteligente de medicamentos para laboratorios y profesionales de la salud. Sistema completo de CRUD, inventario y control de fechas de vencimiento.",
  keywords: "gestión medicamentos, farmacia, laboratorios, control de inventario, productos farmacéuticos, igloolab",
  image: "https://igloolab.co/og-image.jpg",
  url: "https://igloolab.co",
  type: "website",
  canonical: "https://igloolab.co",
  noindex: false,
}

/**
 * Componente SEO para gestionar meta tags dinámicamente
 * Compatible con React 19 sin dependencias externas
 */
export function SEO({
  title,
  description,
  keywords,
  image,
  url,
  type = "website",
  canonical,
  noindex = false,
  structuredData,
}: SEOProps) {
  const seoTitle = title ? `${title} | igloolab` : DEFAULT_SEO.title
  const seoDescription = description || DEFAULT_SEO.description
  const seoKeywords = keywords || DEFAULT_SEO.keywords
  const seoImage = image || DEFAULT_SEO.image
  const seoUrl = url || DEFAULT_SEO.url
  const seoCanonical = canonical || url || DEFAULT_SEO.canonical

  useEffect(() => {
    // Update document title
    document.title = seoTitle

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name'
      let element = document.querySelector(`meta[${attribute}="${name}"]`)
      
      if (!element) {
        element = document.createElement('meta')
        element.setAttribute(attribute, name)
        document.head.appendChild(element)
      }
      
      element.setAttribute('content', content)
    }

    // Primary meta tags
    updateMetaTag('title', seoTitle)
    updateMetaTag('description', seoDescription)
    updateMetaTag('keywords', seoKeywords)
    
    // Open Graph tags
    updateMetaTag('og:title', seoTitle, true)
    updateMetaTag('og:description', seoDescription, true)
    updateMetaTag('og:image', seoImage, true)
    updateMetaTag('og:url', seoUrl, true)
    updateMetaTag('og:type', type, true)
    
    // Twitter tags
    updateMetaTag('twitter:title', seoTitle)
    updateMetaTag('twitter:description', seoDescription)
    updateMetaTag('twitter:image', seoImage)
    updateMetaTag('twitter:url', seoUrl)
    
    // Robots
    if (noindex) {
      updateMetaTag('robots', 'noindex, nofollow')
    } else {
      updateMetaTag('robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1')
    }

    // Update canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement
    if (!canonicalLink) {
      canonicalLink = document.createElement('link')
      canonicalLink.rel = 'canonical'
      document.head.appendChild(canonicalLink)
    }
    canonicalLink.href = seoCanonical

    // Structured Data (JSON-LD)
    if (structuredData) {
      let scriptTag = document.querySelector('script[type="application/ld+json"][data-dynamic]')
      if (!scriptTag) {
        scriptTag = document.createElement('script')
        scriptTag.setAttribute('type', 'application/ld+json')
        scriptTag.setAttribute('data-dynamic', 'true')
        document.head.appendChild(scriptTag)
      }
      scriptTag.textContent = JSON.stringify(structuredData)
    }

    // Cleanup function
    return () => {
      // Reset to default on unmount
      document.title = DEFAULT_SEO.title
    }
  }, [seoTitle, seoDescription, seoKeywords, seoImage, seoUrl, seoCanonical, type, noindex, structuredData])

  // This component doesn't render anything
  return null
}
