<div align="center">
  <img src="src/assets/logo.svg" alt="igloolab Logo" width="100" height="100">
  
  # 💊 igloolab
  
  ### Plataforma Digital para la Industria Farmacéutica
  
  **Gestión Inteligente de Medicamentos para Laboratorios y Profesionales de la Salud**
  
  [![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=white)](https://react.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
  [![TailwindCSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
  
  [Demo](https://igloolab.co) • [Documentación](./docs) • [Changelog](./CHANGELOG.md)
  
</div>

---

## 🌟 Características Principales

- **🔒 Seguro y Confiable** - Gestión profesional con los más altos estándares de seguridad
- **⚡ Rápido y Moderno** - Interface intuitiva optimizada para flujo de trabajo diario
- **📊 Control Completo** - Gestión precisa de fechas de vencimiento, precios y stock
- **🎨 UI/UX Excepcional** - Diseño moderno con TailwindCSS y shadcn/ui
- **📱 Responsive Design** - Optimizado para todos los dispositivos
- **🌐 React Router v7** - Navegación moderna y eficiente

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+ 
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
│   ├── app/
│   │   ├── components/      # Componentes reutilizables
│   │   │   ├── navbar/
│   │   │   ├── footer/
│   │   │   ├── hero/
│   │   │   └── Features/
│   │   ├── home/            # Página principal
│   │   └── layout/          # Layout principal
│   ├── auth/                # Autenticación
│   ├── data/                # Datos mock y configuración
│   ├── types/               # Definiciones de TypeScript
│   │   ├── user.types.ts
│   │   ├── product.types.ts
│   │   └── index.ts
│   ├── router/              # Configuración de rutas
│   ├── components/          # shadcn/ui components
│   └── assets/              # Imágenes y recursos
├── AGENT.md                 # Guía de desarrollo
├── CHANGELOG.md             # Registro de cambios
└── README.md                # Este archivo
```

## 🛠️ Stack Tecnológico

### Frontend
- **React 19.1.1** - Biblioteca UI
- **TypeScript 5.9.3** - Tipado estático
- **React Router v7.9.5** - Enrutamiento
- **Vite 7.1.7** - Build tool y dev server

### Estilos
- **TailwindCSS 4.1.17** - Framework CSS utility-first
- **shadcn/ui** - Componentes UI accesibles
- **Lucide React** - Iconos modernos

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
