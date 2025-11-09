# 📸 Guía de Manejo de Imágenes

## Descripción General

El sistema de productos soporta dos métodos para agregar imágenes:

1. **Subir Archivo** - Optimización automática en el cliente
2. **URL Externa** - Usar imágenes alojadas en servicios externos

---

## 🔄 Métodos de Carga

### 1. Subir Archivo (Recomendado)

**Características:**
- ✅ Optimización automática (resize + compresión)
- ✅ Conversión a JPEG con 85% calidad
- ✅ Tamaño máximo: 800x800px
- ✅ Límite: 5MB
- ✅ Base64 embebido en el payload

**Proceso:**
```
1. Usuario selecciona archivo
2. Validación de tipo (image/*)
3. Validación de tamaño (<5MB)
4. Optimización automática:
   - Resize proporcional a 800x800px max
   - Conversión a JPEG
   - Compresión al 85%
5. Conversión a Base64
6. Preview instantáneo
7. Envío al backend en campo "imagen"
```

**Código Relevante:**
```typescript
// ProductForm.tsx - Líneas 46-89
const optimizeImage = (file: File): Promise<string> => {
  // Redimensiona y comprime la imagen
  // Retorna Base64 optimizado
}
```

### 2. URL Externa

**Características:**
- ✅ Sin límite de tamaño
- ✅ Sin procesamiento en el cliente
- ✅ Carga diferida (lazy loading)
- ⚠️ Requiere URL pública accesible
- ⚠️ Dependiente de servicio externo

**Proceso:**
```
1. Usuario pega URL
2. Validación de formato (http:// o https://)
3. Preview con detección de error
4. Envío al backend en campo "imagen"
```

**Servicios Compatibles:**
- Cloudinary
- Imgur
- AWS S3 (bucket público)
- Google Drive (link público)
- Cualquier URL pública directa

---

## 🔧 Implementación Técnica

### Campo en Base de Datos

El backend espera el campo `imagen` (no `imageUrl`):

```typescript
// CreateProductDTO
{
  nombre: string
  precio: number
  descripcion: string
  fechaElaboracion: string
  fechaVencimiento: string
  imagen?: string  // ⚠️ Importante: "imagen" no "imageUrl"
}
```

### Formato del Campo `imagen`

Puede contener:
1. **Base64:** `data:image/jpeg;base64,/9j/4AAQSkZJRg...`
2. **URL:** `https://res.cloudinary.com/demo/image/upload/sample.jpg`

### Almacenamiento

**Opción 1: Base64 en PostgreSQL**
```sql
-- Columna TEXT en la tabla
ALTER TABLE products ADD COLUMN imagen TEXT;
```

**Opción 2: URL en PostgreSQL**
```sql
-- Solo almacenar la URL
ALTER TABLE products ADD COLUMN imagen VARCHAR(500);
```

---

## 📋 Validaciones

### Cliente (ProductForm.tsx)

```typescript
// Archivo subido
if (!file.type.startsWith('image/')) {
  error('Tipo inválido')
}
if (file.size > 5 * 1024 * 1024) {
  error('Tamaño máximo 5MB')
}

// URL externa
try {
  new URL(imageUrl) // Valida formato
} catch {
  error('URL inválida')
}
```

### Backend (Recomendado)

```javascript
// Validar que la imagen existe
if (data.imagen) {
  // Si es URL, verificar que sea accesible
  if (data.imagen.startsWith('http')) {
    // Opcional: fetch para verificar
  }
  // Si es Base64, verificar formato
  if (data.imagen.startsWith('data:')) {
    // Validar formato base64
  }
}
```

---

## 🎯 Flujo Completo

### Crear Producto con Imagen

```
[USUARIO]
    ↓
[ProductForm]
    ├─ Modo Upload → optimizeImage() → Base64
    └─ Modo URL → Validación → URL String
    ↓
{
  nombre: "Paracetamol",
  precio: 85.00,
  ...
  imagen: "data:image/jpeg;base64,..." | "https://..."
}
    ↓
[ProductsContext.createProduct()]
    ↓
[productsService.create()] - POST /api/products
    ↓
[BACKEND]
    ├─ Validar datos
    ├─ Procesar imagen (opcional: subir a Cloudinary)
    └─ Guardar en PostgreSQL
    ↓
[RESPONSE]
{
  product: {
    id: "uuid",
    nombre: "Paracetamol",
    imageUrl: "https://cloudinary.../optimized.jpg"
  }
}
    ↓
[ProductsContext] actualiza estado
    ↓
[UI] muestra producto con imagen
```

---

## 🐛 Solución de Problemas

### ❌ Error: "TypeError: product.precio.toFixed is not a function"

**Causa:** Campo `precio` como string

**Solución:** Usar `Number(product.precio)`

```typescript
// ❌ Antes
${product.precio.toFixed(2)}

// ✅ Ahora
${Number(product.precio).toFixed(2)}
```

### ❌ Error: Imagen no se guarda

**Causa:** Mismatch de nombres de campos

**Problema:**
```typescript
// Frontend enviaba
{ imageUrl: "..." }

// Backend esperaba
{ imagen: "..." }
```

**Solución:** ✅ Ya arreglado en commit actual

### ❌ Error: URL de imagen no válida

**Causas posibles:**
1. URL sin protocolo (falta `https://`)
2. Imagen requiere autenticación
3. CORS bloqueado
4. URL mal formada

**Solución:**
```typescript
// ✅ URL válida
"https://res.cloudinary.com/demo/sample.jpg"

// ❌ URL inválida
"www.ejemplo.com/imagen.jpg"  // Falta protocolo
"C:/usuarios/imagenes/foto.jpg"  // Ruta local
"https://ejemplo.com/privada.jpg"  // Requiere auth
```

### ❌ Error 413: Payload Too Large

**Causa:** Imagen Base64 muy grande

**Solución:**
1. Aumentar límite en backend:
```javascript
// Express
app.use(express.json({ limit: '10mb' }))
```

2. O usar URL externa en lugar de Base64

---

## 💡 Mejores Prácticas

### 1. Usar CDN para Producción

```typescript
// Recomendado: Cloudinary, ImgIx, etc.
const cloudinaryUrl = 
  "https://res.cloudinary.com/tuproyecto/image/upload/v123/producto.jpg"
```

**Beneficios:**
- Optimización automática
- Diferentes tamaños (responsive)
- Cache global
- Transformaciones on-the-fly

### 2. Validación de Imagen Real

```typescript
// En el input de URL
<img 
  src={imageUrl}
  onLoad={() => setImageValid(true)}
  onError={() => setFormError('URL no accesible')}
/>
```

### 3. Lazy Loading en Cards

```typescript
<img 
  src={product.imageUrl}
  loading="lazy"
  alt={product.nombre}
/>
```

### 4. Placeholder mientras carga

```typescript
src={product.imageUrl || "/placeholder.svg?height=300&width=300"}
```

---

## 🔐 Seguridad

### Validar en Backend

```javascript
// products.controller.js
const validateImageUrl = (url) => {
  // 1. Verificar protocolo HTTPS
  if (!url.startsWith('https://')) {
    throw new Error('Solo HTTPS permitido')
  }
  
  // 2. Blacklist de dominios peligrosos
  const blacklist = ['localhost', '127.0.0.1', '192.168']
  if (blacklist.some(host => url.includes(host))) {
    throw new Error('Dominio no permitido')
  }
  
  // 3. Whitelist de CDNs confiables (opcional)
  const whitelist = ['cloudinary.com', 'imgur.com']
  // ...
}
```

### Content Security Policy

```html
<!-- index.html -->
<meta 
  http-equiv="Content-Security-Policy" 
  content="img-src 'self' https://res.cloudinary.com https://i.imgur.com data:"
/>
```

---

## 📊 Métricas de Performance

### Base64 vs URL

| Aspecto | Base64 | URL Externa |
|---------|--------|-------------|
| **Tamaño Payload** | ~133% original | ~100 bytes |
| **Requests HTTP** | 0 extra | 1 por imagen |
| **Cache** | No cacheable | Cacheable |
| **Performance** | Lento si >100KB | Rápido con CDN |
| **Recomendado** | Solo miniaturas | Producción |

### Optimización de Imágenes

```typescript
// Configuración actual
MAX_WIDTH: 800px
MAX_HEIGHT: 800px
QUALITY: 85%
FORMAT: JPEG

// Resultado típico
Original: 2.5MB (3000x2000 PNG)
Optimizado: ~150KB (800x533 JPEG)
Reducción: ~94%
```

---

## 🚀 Próximos Pasos

### Mejoras Futuras

1. **Integración con Cloudinary**
   - Upload directo desde el cliente
   - Transformaciones automáticas
   - URLs optimizadas

2. **Multiple Images**
   - Galería de imágenes por producto
   - Orden de imágenes
   - Imagen principal + alternativas

3. **Crop & Resize**
   - Editor de imágenes en el cliente
   - Recorte manual
   - Filtros

4. **Progressive Loading**
   - Blur-up placeholder
   - LQIP (Low Quality Image Placeholder)
   - Lazy loading avanzado

---

## 📚 Referencias

- [Cloudinary Upload Widget](https://cloudinary.com/documentation/upload_widget)
- [Image Optimization Best Practices](https://web.dev/fast/#optimize-your-images)
- [Base64 Encoding](https://developer.mozilla.org/en-US/docs/Glossary/Base64)
- [File API](https://developer.mozilla.org/en-US/docs/Web/API/File)

---

## 🆘 Soporte

Si tienes problemas:

1. Verificar consola del navegador (F12)
2. Revisar Network tab para errores 400/500
3. Validar formato del campo `imagen`
4. Verificar que la URL sea pública y accesible
5. Comprobar límites de tamaño en el backend

**Error común resuelto:** Campo `imageUrl` → `imagen` ✅
