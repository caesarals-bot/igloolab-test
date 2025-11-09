# 🔍 Guía Completa de SEO - igloolab

**Fecha:** 11/9/2025  
**Autor:** Equipo igloolab

---

## 📋 Resumen

Este documento detalla la implementación completa de SEO (Search Engine Optimization) en el proyecto igloolab, incluyendo meta tags, structured data, sitemap, y componentes dinámicos.

---

## 🎯 Objetivos de SEO

| Objetivo | Estado | Impacto |
|----------|--------|---------|
| **Meta Tags Completos** | ✅ | Alto |
| **Open Graph** | ✅ | Alto |
| **Twitter Cards** | ✅ | Medio |
| **Structured Data (JSON-LD)** | ✅ | Alto |
| **Sitemap XML** | ✅ | Alto |
| **Robots.txt** | ✅ | Medio |
| **Canonical URLs** | ✅ | Alto |
| **SEO Dinámico por Página** | ✅ | Alto |

---

## 🏗️ Arquitectura SEO

### **1. SEO Estático (index.html)**

```html
<!-- index.html -->
<html lang="es">
<head>
  <!-- Primary Meta Tags -->
  <title>igloolab - Plataforma Digital para la Industria Farmacéutica</title>
  <meta name="description" content="..." />
  <meta name="keywords" content="..." />
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://igloolab.co/" />
  <meta property="og:title" content="..." />
  
  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  
  <!-- Structured Data -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "igloolab"
  }
  </script>
</head>
```

**Beneficios:**
- ✅ SEO base para toda la aplicación
- ✅ Funciona incluso si JS falla
- ✅ Meta tags correctos para crawlers

---

### **2. Componente SEO Dinámico**

```typescript
// src/components/seo/SEO.tsx
import { SEO } from "@/components/seo/SEO"

<SEO
  title="Mi Página"
  description="Descripción de mi página"
  keywords="palabras, clave, seo"
  url="https://igloolab.co/mi-pagina"
  image="https://igloolab.co/og-image.jpg"
  type="website"
  canonical="https://igloolab.co/mi-pagina"
  noindex={false}
  structuredData={{
    "@context": "https://schema.org",
    "@type": "Product"
  }}
/>
```

**Características:**
- ✅ Compatible con React 19 (sin dependencias)
- ✅ Actualiza meta tags dinámicamente
- ✅ Maneja title, description, OG, Twitter
- ✅ Canonical URLs
- ✅ Structured Data (JSON-LD)
- ✅ Control de indexación (noindex)

---

### **3. Hook useSEO**

Para usar SEO de forma imperativa:

```typescript
// src/hooks/useSEO.ts
import { useSEO } from "@/hooks/useSEO"

function MyComponent() {
  useSEO({
    title: "Mi Componente",
    description: "Descripción"
  })
  
  return <div>...</div>
}
```

**Uso recomendado:**
- ✅ Cuando no quieres renderizar un componente
- ✅ Para componentes que no son páginas
- ✅ Para efectos secundarios de SEO

---

## 📄 Implementación por Página

### **HomePage**
```typescript
<SEO
  title="Inicio - Gestión Inteligente de Medicamentos"
  description="Plataforma digital para la gestión de medicamentos..."
  keywords="gestión medicamentos, farmacia online, ..."
  url="https://igloolab.co"
  type="website"
  structuredData={{
    "@context": "https://schema.org",
    "@type": "WebSite",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://igloolab.co/productos?q={search_term_string}"
    }
  }}
/>
```

**Schema.org:** WebSite con SearchAction

---

### **ProductsPage**
```typescript
<SEO
  title="Productos Farmacéuticos - Catálogo Completo"
  description="Explora nuestro catálogo completo..."
  url="https://igloolab.co/productos"
  structuredData={{
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": products.map((product, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Product",
        "name": product.nombre,
        "offers": {
          "@type": "Offer",
          "price": product.precio
        }
      }
    }))
  }}
/>
```

**Schema.org:** ItemList con Product items

---

### **DashboardPage** (Área Privada)
```typescript
<SEO
  title="Dashboard - Panel de Administración"
  description="Panel de control administrativo"
  noindex={true}  // ← Importante!
/>
```

**Nota:** Siempre usar `noindex={true}` en áreas privadas

---

## 🗺️ Sitemap y Robots

### **Sitemap.xml**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://igloolab.co/</loc>
    <lastmod>2025-11-09</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://igloolab.co/productos</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>
```

**Ubicación:** `public/sitemap.xml`

**Actualización:**
1. Manual: Editar XML cuando agregues páginas
2. Automática: Usar script de generación (futuro)

---

### **Robots.txt**

```txt
User-agent: *
Allow: /
Allow: /productos
Disallow: /admin/
Disallow: /login
Disallow: /register

Sitemap: https://igloolab.co/sitemap.xml
```

**Ubicación:** `public/robots.txt`

**Reglas:**
- ✅ Permitir páginas públicas
- ❌ Bloquear áreas privadas (/admin)
- ❌ Bloquear páginas de auth
- ✅ Incluir sitemap

---

## 📊 Structured Data (Schema.org)

### **Tipos Implementados**

#### **1. WebApplication** (Global)
```json
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "igloolab",
  "url": "https://igloolab.co",
  "applicationCategory": "BusinessApplication",
  "offers": {
    "@type": "Offer",
    "price": "0"
  }
}
```

#### **2. WebSite** (HomePage)
```json
{
  "@type": "WebSite",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://igloolab.co/productos?q={search_term_string}"
  }
}
```

#### **3. ItemList + Product** (ProductsPage)
```json
{
  "@type": "ItemList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "item": {
        "@type": "Product",
        "name": "...",
        "offers": {...}
      }
    }
  ]
}
```

---

## 🔧 Configuración de Build

### **Vite Config**

Asegurar que archivos SEO se copien:

```javascript
// vite.config.ts
export default defineConfig({
  publicDir: 'public', // robots.txt, sitemap.xml
  build: {
    rollupOptions: {
      output: {
        // Mantener nombres de archivos
        assetFileNames: 'assets/[name].[hash].[ext]'
      }
    }
  }
})
```

---

## ✅ Checklist de Implementación

### **Meta Tags**
- [x] Title dinámico por página
- [x] Meta description
- [x] Meta keywords
- [x] Open Graph completo
- [x] Twitter Cards
- [x] Canonical URLs
- [x] Robots meta (index/noindex)
- [x] Theme color (#0095FF)
- [x] Lang="es"

### **Structured Data**
- [x] JSON-LD en index.html
- [x] JSON-LD dinámico por página
- [x] Schema.org WebApplication
- [x] Schema.org WebSite
- [x] Schema.org ItemList
- [x] Schema.org Product

### **Archivos**
- [x] sitemap.xml
- [x] robots.txt
- [x] favicon configurado

### **Componentes**
- [x] Componente SEO
- [x] Hook useSEO
- [x] SEO en HomePage
- [x] SEO en ProductsPage
- [x] SEO en DashboardPage

---

## 📈 Herramientas de Testing

### **1. Google Search Console**
```
URL: https://search.google.com/search-console
```
- Verificar indexación
- Revisar sitemap
- Ver errores de rastreo
- Analizar performance

### **2. Google Rich Results Test**
```
URL: https://search.google.com/test/rich-results
```
- Validar structured data
- Ver preview de resultados
- Detectar errores de schema

### **3. Facebook Sharing Debugger**
```
URL: https://developers.facebook.com/tools/debug/
```
- Verificar Open Graph tags
- Ver preview de compartir
- Limpiar caché de FB

### **4. Twitter Card Validator**
```
URL: https://cards-dev.twitter.com/validator
```
- Verificar Twitter Cards
- Ver preview en Twitter

### **5. Lighthouse (Chrome DevTools)**
```
Chrome DevTools > Lighthouse > SEO
```
- Auditoría automática
- Sugerencias de mejora
- Score SEO

---

## 🚀 Mejores Prácticas

### **1. Títulos**
```typescript
✅ Correcto:
"Productos Farmacéuticos | igloolab"

❌ Incorrecto:
"productos" // Sin capitalización
"PRODUCTOS FARMACÉUTICOS" // Todo mayúsculas
```

**Reglas:**
- 50-60 caracteres
- Incluir keyword principal
- Incluir marca (igloolab)
- Único por página

### **2. Descripciones**
```typescript
✅ Correcto:
"Explora nuestro catálogo completo de productos farmacéuticos. 
Medicamentos, tratamientos y soluciones para profesionales."

❌ Incorrecto:
"Productos" // Muy corto
```

**Reglas:**
- 150-160 caracteres
- Incluir keywords naturalmente
- Call to action
- Única por página

### **3. Keywords**
```typescript
✅ Correcto:
"gestión medicamentos, farmacia online, laboratorios"

❌ Incorrecto:
"medicamentos,medicamentos,medicamentos" // Keyword stuffing
```

**Reglas:**
- 5-10 keywords relevantes
- Sin repetición
- Natural, no forzado

### **4. Structured Data**
```typescript
✅ Correcto:
Usar @type adecuado para cada página
Incluir propiedades requeridas
Validar con Rich Results Test

❌ Incorrecto:
Copiar/pegar sin personalizar
Omitir propiedades requeridas
```

---

## 🐛 Troubleshooting

### **Problema: Meta tags no se actualizan**
```typescript
// Solución: Verificar que SEO se renderiza
<SEO title="Mi Página" /> // ✅

// Verificar en DevTools > Elements > <head>
```

### **Problema: Sitemap no accesible**
```typescript
// Verificar ubicación
public/sitemap.xml // ✅
src/sitemap.xml   // ❌

// Probar URL
https://localhost:5173/sitemap.xml
```

### **Problema: Robots.txt no funciona**
```typescript
// Verificar formato
User-agent: *    // ✅
User-Agent: *    // ❌ (case sensitive)

// Probar URL
https://localhost:5173/robots.txt
```

### **Problema: Structured Data con errores**
```typescript
// Usar validador
https://search.google.com/test/rich-results

// Errores comunes:
- Falta @context
- @type incorrecto
- Propiedades requeridas faltantes
```

---

## 📊 Métricas de Éxito

### **Antes de SEO**
```
Google Search Console:
- Impresiones: 0
- Clicks: 0
- CTR: 0%
- Posición: N/A
```

### **Después de SEO (esperado)**
```
1-2 meses:
- Impresiones: 1,000+
- Clicks: 50+
- CTR: 5%+
- Posición: Top 10

3-6 meses:
- Impresiones: 10,000+
- Clicks: 500+
- CTR: 8%+
- Posición: Top 5
```

---

## 🔮 Mejoras Futuras

1. **Dynamic Sitemap Generation**
   ```typescript
   // Script para generar sitemap desde rutas
   // Ejecutar en build time
   ```

2. **Breadcrumbs Schema**
   ```json
   {
     "@type": "BreadcrumbList",
     "itemListElement": [...]
   }
   ```

3. **FAQ Schema**
   ```json
   {
     "@type": "FAQPage",
     "mainEntity": [...]
   }
   ```

4. **Article Schema** (Blog futuro)
   ```json
   {
     "@type": "Article",
     "headline": "...",
     "author": {...}
   }
   ```

5. **Review/Rating Schema** (Productos)
   ```json
   {
     "@type": "Product",
     "aggregateRating": {...}
   }
   ```

---

## 📚 Recursos

- [Google SEO Starter Guide](https://developers.google.com/search/docs/beginner/seo-starter-guide)
- [Schema.org Documentation](https://schema.org/)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Cards Guide](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
- [Google Rich Results](https://developers.google.com/search/docs/advanced/structured-data/intro-structured-data)

---

## 📞 Soporte

**Equipo igloolab**  
Email: soporte@igloolab.co  
Documentación: `/docs`

---

*Última actualización: 11/9/2025 12:40*
