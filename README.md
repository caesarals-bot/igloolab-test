<div align="center">
  <img src="src/assets/logo.svg" alt="igloolab Logo" width="100" height="100">
  
  # 💊 igloolab
  
  ### Plataforma Digital para la Industria Farmacéutica
  
  **Gestión Inteligente de Medicamentos para Laboratorios y Profesionales de la Salud**
  
  [![React](https://img.shields.io/badge/React-19.1.1-1DAFB?logo=react&logoColor=white)](https://react.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Vite](https://img.shields.io/badge/Vite-7.1.7-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
  [![TailwindCSS](https://img.shields.io/badge/Tailwind-4.1.17-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
  
  [Demo](https://igloolab.co) • [Documentación](./docs) • [Changelog](./CHANGELOG.md)
  
</div>

---

## 🌟 Características Principales

### Público
- **🏠 Landing Page** - Hero atractivo con animaciones y CTA
- **💊 Catálogo de Productos** - Grid responsive con modal de detalles
- **🖼️ Imágenes Optimizadas** - Assets con optimización automática de Vite

### Administración
- **📊 Dashboard Completo** - Estadísticas en tiempo real y acciones rápidas
- **📦 Gestión de Medicamentos** - CRUD completo con API REST integrada
- **🖼️ Gestión de Imágenes** - Upload con optimización automática (Cloudinary ready)
- **🎛️ Panel de Configuración** - Ajustes de perfil y sistema
- **🗂️ Sidebar Navegable** - Menú lateral colapsable con estados activos

### Técnico
- **🔒 Seguridad Documentada** - Guía completa de implementación (AUTHENTICATION.md)
- **🔗 Backend Integrado** - Context API + Axios + PostgreSQL
- **🖼️ Cloudinary Ready** - Sistema de imágenes escalable (ver docs/CLOUDINARY-SETUP.md)
- **⚡ Rápido y Moderno** - React 19, TypeScript, Vite 7
- **🎨 UI/UX Excepcional** - TailwindCSS 4 con componentes shadcn/ui
- **📱 100% Responsive** - Desktop, tablet y mobile
- **🌐 React Router v7** - Navegación SPA con rutas protegidas preparadas

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 22.16.0 
- npm o pnpm

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
├── src/
│   ├── admin/               # Módulo de administración
│   │   ├── components/      # ProductTable, ProductForm
│   │   ├── layout/          # AdminLayout (sidebar)
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
│   ├── auth/                # Login y Register pages
│   ├── context/             # Context API (ProductsContext, DashboardContext)
│   ├── services/            # API services (axios)
│   ├── data/                # mockData (productos, usuarios)
│   ├── types/               # Definiciones TypeScript
│   │   ├── user.types.ts
│   │   ├── product.types.ts
│   │   └── index.ts
│   ├── router/              # AppRouter (8 rutas)
│   ├── components/          # shadcn/ui components
│   ├── assets/              # Imágenes (.webp)
│   └── lib/                 # Utilidades
├── docs/                    # Documentación adicional
│   ├── CLOUDINARY-SETUP.md  # Guía de configuración de Cloudinary
│   └── CONTEXT-API-GUIDE.md # Guía de Context API
├── AGENT.md                 # Guía de desarrollo
├── AUTHENTICATION.md        # Guía de seguridad
├── CHANGELOG.md             # Registro de cambios
└── README.md                # Este archivo
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

# Endpoints disponibles:
GET    /api/products       # Listar productos
POST   /api/products       # Crear producto
PUT    /api/products/:id   # Actualizar producto
DELETE /api/products/:id   # Eliminar producto
GET    /api/dashboard      # Estadísticas
```

### Context API

Gestión de estado global con Context API:

- **ProductsContext** - CRUD de productos
- **DashboardContext** - Estadísticas y métricas

Ver [CONTEXT-API-GUIDE.md](./docs/CONTEXT-API-GUIDE.md) para más detalles.

### Gestión de Imágenes

Soporte para dos métodos de imágenes:

1. **Base64** (actual) - Para desarrollo y MVP
2. **Cloudinary** (recomendado) - Para producción escalable

Ver [CLOUDINARY-SETUP.md](./docs/CLOUDINARY-SETUP.md) para configuración.

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

Ver [CHANGELOG.md](./CHANGELOG.md) para registro de avances.

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más información.

## 👥 Equipo

**igloolab** - Agencia digital para la industria farmacéutica

- Website: [igloolab.co](https://igloolab.co)
- Email: contacto@igloolab.co

### Desarrollo

- **Cesar Londoño** - Developer

## 🙏 Agradecimientos

- [shadcn/ui](https://ui.shadcn.com/) por los componentes UI
- [Lucide](https://lucide.dev/) por los iconos
- [TailwindCSS](https://tailwindcss.com/) por el framework CSS

---

<div align="center">
  
  **Hecho con ❤️ por el equipo de igloolab**
  
  © 2025 igloolab. Todos los derechos reservados.
  
</div>
