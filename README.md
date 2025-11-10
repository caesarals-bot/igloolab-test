<div align="center">
  <img src="src/assets/logo.svg" alt="igloolab Logo" width="100" height="100">
  
  # 💊 igloolab
  
  ### Plataforma Digital para la Industria Farmacéutica
  
  **Gestión Inteligente de Medicamentos para Laboratorios y Profesionales de la Salud**
  
  [![React](https://img.shields.io/badge/React-19.1.1-1DAFB?logo=react&logoColor=white)](https://react.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Vite](https://img.shields.io/badge/Vite-7.1.7-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
  [![TailwindCSS](https://img.shields.io/badge/Tailwind-4.1.17-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  
  ![Lighthouse](https://img.shields.io/badge/Lighthouse-94%2F100-success?logo=lighthouse)
  ![SEO](https://img.shields.io/badge/SEO-100%2F100-success)
  ![Performance](https://img.shields.io/badge/Bundle-360KB-blue)
  [![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
  
  [Documentación Técnica](./TECHNICAL.md)
  
  **⚡ Bundle Optimizado • 🔐 Auth JWT • 📊 Dashboard Completo • 📱 100% Responsive**
  
</div>

---

## 🌟 Características Principales

### Público
- **🏠 Landing Page** - Hero atractivo con animaciones y CTA
- **💊 Catálogo de Productos** - Grid responsive con cards animados
- **📄 Modal de Detalles** - Información completa con formato de precio COP
- **🖼️ Imágenes Optimizadas** - Assets .webp con lazy loading
- **💰 Formato de Precios** - Intl.NumberFormat con pesos colombianos

### Administración
- **🔐 Autenticación JWT** - Login, registro y refresh automático de tokens
- **👤 Gestión de Usuarios** - Roles (admin/user) y perfil en sidebar
- **📊 Dashboard Completo** - Estadísticas en tiempo real y acciones rápidas
- **📦 Gestión de Medicamentos** - CRUD completo con API REST integrada
- **🖼️ Gestión de Imágenes** - Upload con optimización automática + URL externa
- **🎛️ Panel de Configuración** - Ajustes de perfil y sistema
- **🗂️ Sidebar Navegable** - Menú lateral colapsable con estados activos
- **🛡️ Rutas Protegidas** - ProtectedRoute con verificación de roles
- **🔄 Modo Demostración** - Fallback inteligente a mock data si backend offline

### Técnico
- **🔐 Autenticación JWT** - Access tokens (24h) + Refresh tokens (7d) con renovación automática
- **🔒 Axios Interceptors** - Auto-refresh de tokens y manejo de errores
- **🔗 Backend Integrado** - Context API + Axios + PostgreSQL
- **🖼️ Cloudinary Ready** - Sistema de imágenes escalable con optimización automática
- **⚡ Optimización Extrema** - Lazy loading + Suspense + Code splitting (-61% bundle)
- **🔍 SEO Completo** - Meta tags, Open Graph, Twitter Cards, JSON-LD, Sitemap
- **🎨 UI/UX Excepcional** - TailwindCSS 4 con componentes shadcn/ui + Loading skeletons
- **📱 100% Responsive** - Desktop, tablet y mobile
- **🌐 React Router v7** - Navegación SPA con rutas protegidas por roles
- **🚀 Performance** - Lighthouse 94, FCP 0.9s, LCP 1.4s

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18.0.0 o superior
- npm o pnpm
- Backend API corriendo en http://localhost:3000 (opcional)

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/igloolab/front-end.git
cd igloolab-project

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Abrir en el navegador
http://localhost:5173
```

## 📂 Estructura del Proyecto

```
igloolab-project/
├── public/                  # Assets públicos
│   ├── robots.txt
│   └── sitemap.xml
├── src/
│   ├── admin/               # Módulo de administración
│   │   ├── components/      # ProductTable, ProductForm
│   │   ├── layout/          # AdminLayout (sidebar + user info)
│   │   └── page/            # Dashboard, Medications, Settings
│   ├── app/
│   │   ├── components/      # Componentes públicos
│   │   │   ├── navbar/      # Navbar responsive
│   │   │   ├── footer/      # Footer
│   │   │   ├── hero/        # HeroPage
│   │   │   ├── Features/    # Tarjetas de características
│   │   │   └── calltoaccion/# CTA Section
│   │   ├── home/            # HomePage
│   │   ├── products/        # ProductsPage, ProductCard, Modal
│   │   └── layout/          # LayoutPage principal
│   ├── auth/                # LoginPage y RegisterPage
│   ├── context/             # Context API
│   │   ├── AuthContext.tsx      # Autenticación global
│   │   ├── ProductsContext.tsx  # Productos global
│   │   ├── DashboardContext.tsx # Dashboard stats
│   │   └── index.tsx            # Exports
│   ├── lib/
│   │   └── api/             # Servicios API
│   │       ├── client.ts        # Axios con interceptors JWT
│   │       ├── auth.service.ts  # Auth endpoints
│   │       ├── products.service.ts
│   │       └── dashboard.service.ts
│   ├── components/          # Componentes compartidos
│   │   ├── ui/              # shadcn/ui components
│   │   ├── common/          # PageLoader, PageSkeleton, ErrorBoundary, ProtectedRoute
│   │   └── seo/             # Componente SEO
│   ├── types/               # Definiciones TypeScript
│   │   ├── user.types.ts    # User, Auth types
│   │   ├── product.types.ts
│   │   └── index.ts
│   ├── router/              # React Router
│   │   └── AppRouter.tsx    # Definición de rutas (con ProtectedRoute)
│   ├── hooks/               # Custom hooks
│   │   ├── useSEO.ts
│   │   └── usePreload.ts
│   ├── data/                # Mock data para modo demo
│   └── assets/              # Imágenes (.webp)
├── docs/                    # Documentación técnica
└── README.md                # Documentación principal
```

## 🛠️ Stack Tecnológico

### Frontend
- **React 19.1.1** - Biblioteca UI
- **TypeScript 5.9.3** - Tipado estático
- **React Router v7.9.5** - Enrutamiento
- **Vite 7.1.7** - Build tool y dev server

### Estado & Data
- **Context API** - Gestión de estado global
- **Axios** - Cliente HTTP para API REST
- **date-fns** - Manipulación de fechas

### Estilos
- **TailwindCSS 4.1.17** - Framework CSS utility-first
- **shadcn/ui** - Componentes UI accesibles
- **Lucide React** - Iconos modernos

### Backend Integration
- **PostgreSQL** - Base de datos
- **REST API** - Endpoints para CRUD de productos
- **Cloudinary** - Almacenamiento y optimización de imágenes (opcional)

### Desarrollo
- **ESLint** - Linting de código
- **TypeScript ESLint** - Reglas específicas para TS

## 💻 Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Inicia servidor de desarrollo

# Build
npm run build           # Compila para producción
npm run preview         # Preview del build de producción

# Linting
npm run lint            # Ejecuta ESLint
```

## 🎨 Diseño y UX

### Paleta de Colores

- **Primary**: `#0095FF` - Azul igloolab
- **Background**: `oklch(1 0 0)` - Blanco
- **Foreground**: `oklch(0.145 0 0)` - Negro suave

### Tipografía

- Títulos: text-5xl → text-8xl
- Body: text-xl → text-2xl
- Animaciones suaves con `fade-in-up`

## 🔗 Backend Integration

### API REST

El frontend está integrado con un backend REST API:

```bash
# Backend debe estar corriendo en:
http://localhost:3000

# Endpoints de Autenticación:
POST   /api/auth/register       # Registro de usuarios
POST   /api/auth/login          # Inicio de sesión
POST   /api/auth/refresh        # Renovar token
GET    /api/auth/me             # Usuario actual

# Endpoints de Productos:
GET    /api/products            # Listar productos (paginado, búsqueda, ordenamiento)
POST   /api/products            # Crear producto
GET    /api/products/:id        # Obtener producto por ID
PUT    /api/products/:id        # Actualizar producto
DELETE /api/products/:id        # Eliminar producto

# Endpoints de Dashboard:
GET    /api/dashboard/stats         # Estadísticas generales
GET    /api/dashboard/expiry-status # Estado de vencimientos
```

### Context API

Gestión de estado global con Context API:

- **AuthContext** - Autenticación y gestión de usuarios
- **ProductsContext** - CRUD de productos con fallback a mock data
- **DashboardContext** - Estadísticas y métricas calculadas en tiempo real

### 🔐 Autenticación JWT

Sistema completo de autenticación con JSON Web Tokens integrado con el backend:

#### **Características**

- ✅ **Registro de usuarios** con validación de contraseñas
- ✅ **Login** con credenciales (email + password)
- ✅ **Access Token** (24h) + **Refresh Token** (7d)
- ✅ **Auto-refresh** transparente cuando expira el token
- ✅ **Persistencia de sesión** con localStorage
- ✅ **Rutas protegidas** con verificación de roles
- ✅ **Logout** con limpieza de tokens

#### **Endpoints de Autenticación**

```bash
POST   /api/auth/register    # Crear cuenta
POST   /api/auth/login       # Iniciar sesión
POST   /api/auth/refresh     # Renovar token
GET    /api/auth/me          # Usuario actual
POST   /api/auth/logout      # Cerrar sesión
```

#### **Flujo de Autenticación**

```typescript
// 1. Usuario hace login
const { user, login } = useAuthContext()
await login({ email, password })

// 2. Token se agrega automáticamente a todos los requests
// (Axios interceptor)

// 3. Si token expira, se renueva automáticamente
// (Transparente para el usuario)

// 4. Rutas protegidas verifican autenticación
<ProtectedRoute allowedRoles={['admin', 'user']}>
  <AdminLayout />
</ProtectedRoute>
```

#### **Componentes de Auth**

- **LoginPage** - Formulario de inicio de sesión
- **RegisterPage** - Formulario de registro con validaciones
- **ProtectedRoute** - HOC para proteger rutas privadas
- **AuthContext** - Estado global de autenticación
- **Axios Interceptors** - Auto-agregar token y auto-refresh

#### **Seguridad**

- 🔒 Passwords hasheados con bcrypt (backend)
- 🔐 JWT firmados con secretos seguros
- ⏱️ Tokens con expiración configurable
- 🔄 Renovación automática de tokens
- 🛡️ Validación de roles (admin/user)
- 🚪 Logout seguro con limpieza completa

### 🔄 Modo Demostración (Sin Backend)

El frontend funciona completamente sin backend gracias a un sistema de fallback inteligente:

#### **Características del Modo Demo**

- ✅ **5 productos de ejemplo** con imágenes reales
- ✅ **Stats calculados dinámicamente** desde mock data
- ✅ **CRUD funcional** (cambios solo en memoria)
- ✅ **Búsqueda y ordenamiento** operativos
- ✅ **Paginación funcional**
- ⚠️ **Banner informativo** que indica modo demostración
- 💡 **Instrucciones claras** para conectar backend

#### **Cómo Funciona**

```typescript
// ProductsContext intenta conectar al backend
try {
  const data = await productsService.getAll(params)
  setProducts(data.products)
} catch (error) {
  // Si falla, usa mock data automáticamente
  console.warn('Backend no disponible, usando mock data')
  setProducts(mockProducts)
  setError('⚠️ Usando datos de demostración')
}
```

#### **Beneficios**

- 🚀 **Deploy inmediato** sin necesidad de backend
- 🎨 **Testing de UI** sin configuración
- 📱 **Demos rápidos** para stakeholders
- 🔧 **Desarrollo frontend** independiente

### Gestión de Imágenes

Sistema completo de gestión de imágenes con soporte dual:

#### 🖼️ **Métodos Soportados**

1. **📤 Subir Archivo (Recomendado)**
   - Optimización automática (resize a 800x800px)
   - Compresión JPEG 85% calidad
   - Conversión a Base64
   - Límite: 5MB
   - Preview instantáneo

2. **🔗 URL Externa**
   - Soporte para CDN (Cloudinary, Imgur, etc.)
   - Sin límite de tamaño
   - Validación de formato
   - Lazy loading automático

#### ⚙️ **Características Técnicas**

- Campo unificado: `imageUrl` (soporta URL o Base64)
- Payload limit: 10MB para Base64
- Validación automática de formato
- Fallback a placeholder si falla
- Error handling con mensajes claros

### ⚡ Performance y Optimización

El proyecto implementa técnicas avanzadas de optimización:

### Lazy Loading y Code Splitting

- **Rutas Lazy**: Todas las páginas se cargan bajo demanda
- **Componentes Lazy**: Componentes pesados (ProductForm ~21KB) solo cuando se necesitan
- **Chunks Inteligentes**: vendor, ui, y rutas separadas

### Suspense Boundaries

- **Loading Skeletons**: UX mejorada sin pantallas blancas
- **Error Boundaries**: Manejo robusto de errores de carga
- **Fallbacks Contextuales**: Diferentes loaders según la sección

### Métricas de Performance

| Métrica | Valor |
|---------|-------|
| **Bundle Inicial** | 363KB gzip: 119KB |
| **Componentes Lazy** | ProductForm: 107KB (carga bajo demanda) |
| **Assets Optimizados** | ~500KB total en .webp |
| **Lighthouse Score** | 94/100 |
| **First Contentful Paint** | 0.9s |
| **Largest Contentful Paint** | 1.4s |
| **SEO Score** | 100/100 |

Ver [TECHNICAL.md](./TECHNICAL.md) para detalles completos de arquitectura.

## 🔍 SEO y Optimización para Motores de Búsqueda

Implementación completa de SEO con componentes nativos para React 19, sin dependencias externas.

### 🎯 Características SEO

#### **Meta Tags Completos**
```html
✅ Title dinámico por página
✅ Meta description (150-160 caracteres)
✅ Meta keywords
✅ Open Graph (Facebook, LinkedIn)
✅ Twitter Cards (summary_large_image)
✅ Canonical URLs
✅ Robots meta (index/noindex)
✅ Theme color (#0095FF)
✅ Lang="es"
```

#### **Structured Data (Schema.org)**
```json
{
  "WebApplication": "Aplicación global",
  "WebSite": "Con SearchAction",
  "ItemList": "Catálogo de productos",
  "Product": "Productos individuales"
}
```

#### **Archivos de Configuración**
```
public/
├── robots.txt    # Control de crawlers (Allow/Disallow)
├── sitemap.xml   # Mapa del sitio (4 URLs públicas)
└── index.html    # Meta tags base + JSON-LD
```

### 💡 Componente SEO (React 19 Compatible)

```typescript
import { SEO } from "@/components/seo/SEO"

// Ejemplo: HomePage
<SEO
  title="Inicio - Gestión Inteligente de Medicamentos"
  description="Plataforma digital para la gestión de medicamentos..."
  keywords="gestión medicamentos, farmacia, laboratorios"
  url="https://igloolab.co"
  type="website"
  structuredData={{
    "@context": "https://schema.org",
    "@type": "WebSite",
    "potentialAction": {
      "@type": "SearchAction"
    }
  }}
/>

// Ejemplo: Área privada (Admin)
<SEO
  title="Dashboard"
  noindex={true}  // ← Bloquea indexación
/>
```

### 📊 Beneficios SEO

| Característica | Impacto | Estado |
|----------------|---------|--------|
| **Meta Tags Completos** | Alto | ✅ |
| **Open Graph** | Alto | ✅ |
| **Twitter Cards** | Medio | ✅ |
| **Structured Data** | Alto | ✅ |
| **Sitemap XML** | Alto | ✅ |
| **Robots.txt** | Medio | ✅ |
| **Canonical URLs** | Alto | ✅ |
| **Mobile-Friendly** | Alto | ✅ |

### 🔧 Herramientas de Testing

- **Google Rich Results Test**: Validar structured data
- **Facebook Sharing Debugger**: Preview de Open Graph
- **Twitter Card Validator**: Preview de Twitter Cards
- **Lighthouse SEO**: Auditoría automática (Score actual: 100/100)

### 📚 Documentación Completa

Para más información sobre SEO, consulta el componente `SEO.tsx` en `src/components/seo/`.

## 🔐 Autenticación

Sistema de autenticación con tipos seguros:

```typescript
type User = {
  nombre: string
  email: string
}
```

Actualmente usa datos mock, preparado para integración con backend.


## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add: AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 🔧 Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_API_URL=http://localhost:3000/api
```

## 📄 Documentación

- **[TECHNICAL.md](./TECHNICAL.md)** - Documentación técnica detallada
  - Arquitectura del proyecto
  - Patrones de diseño implementados
  - Estructura de Context API
  - Sistema de autenticación JWT
  - Interceptores de Axios
  - Gestión de estados

## 👥 Desarrollo

**Proyecto desarrollado para prueba técnica**

- **Cesar Londoño** - Full Stack Developer

## 🙏 Agradecimientos

- [shadcn/ui](https://ui.shadcn.com/) por los componentes UI
- [Lucide](https://lucide.dev/) por los iconos
- [TailwindCSS](https://tailwindcss.com/) por el framework CSS

---

<div align="center">
  
  **Hecho con ❤️ por el equipo de igloolab**
  
  © 2025 igloolab. Todos los derechos reservados.
  
</div>
