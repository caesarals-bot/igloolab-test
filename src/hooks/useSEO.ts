import { useEffect } from "react"
import type { SEOProps } from "@/components/seo/SEO"

/**
 * Hook personalizado para manejar SEO de forma imperativa
 * Útil cuando no quieres renderizar un componente SEO
 */
export function useSEO(seoConfig: SEOProps) {
  useEffect(() => {
    const {
      title,
      description,
      keywords,
      image,
      url,
      type = "website",
      canonical,
      noindex = false,
      structuredData,
    } = seoConfig

    const defaultTitle = "igloolab - Plataforma Digital para la Industria Farmacéutica"
    const seoTitle = title ? `${title} | igloolab` : defaultTitle
    
    // Update document title
    document.title = seoTitle

    // Update meta tags
    const updateMetaTag = (name: string, content: string, isProperty = false) => {
      if (!content) return
      
      const attribute = isProperty ? 'property' : 'name'
      let element = document.querySelector(`meta[${attribute}="${name}"]`)
      
      if (!element) {
        element = document.createElement('meta')
        element.setAttribute(attribute, name)
        document.head.appendChild(element)
      }
      
      element.setAttribute('content', content)
    }

    if (description) {
      updateMetaTag('description', description)
      updateMetaTag('og:description', description, true)
      updateMetaTag('twitter:description', description)
    }

    if (keywords) {
      updateMetaTag('keywords', keywords)
    }

    if (image) {
      updateMetaTag('og:image', image, true)
      updateMetaTag('twitter:image', image)
    }

    if (url) {
      updateMetaTag('og:url', url, true)
      updateMetaTag('twitter:url', url)
    }

    updateMetaTag('og:type', type, true)
    updateMetaTag('og:title', seoTitle, true)
    updateMetaTag('twitter:title', seoTitle)

    // Robots
    if (noindex) {
      updateMetaTag('robots', 'noindex, nofollow')
    }

    // Canonical
    if (canonical || url) {
      let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement
      if (!canonicalLink) {
        canonicalLink = document.createElement('link')
        canonicalLink.rel = 'canonical'
        document.head.appendChild(canonicalLink)
      }
      canonicalLink.href = canonical || url || ''
    }

    // Structured Data
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

    return () => {
      // Cleanup if needed
      document.title = defaultTitle
    }
  }, [seoConfig])
}
