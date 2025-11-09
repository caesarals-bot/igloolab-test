# 🖼️ Configuración de Cloudinary para Gestión de Imágenes

**Fecha:** 11/8/2025  
**Hora:** 21:46  
**Autor:** Equipo igloolab

---

## 📋 Resumen

Este documento detalla los pasos para implementar Cloudinary como servicio de almacenamiento y optimización de imágenes para el proyecto igloolab.

### ¿Por qué Cloudinary?

- ✅ **CDN Global:** Carga rápida desde cualquier ubicación
- ✅ **Plan Gratuito Generoso:** 25GB almacenamiento, 25K transformaciones/mes
- ✅ **Optimización Automática:** Redimensionamiento, WebP, lazy loading
- ✅ **Backup Automático:** No perderás las imágenes
- ✅ **Escalable:** De 10 a 10,000 productos sin cambios

---

## 🚀 Pasos de Implementación

### **1. Crear Cuenta en Cloudinary**

1. Ir a [cloudinary.com](https://cloudinary.com)
2. Registrarse con email (plan gratis)
3. Verificar email
4. Acceder al dashboard

### **2. Obtener Credenciales**

En el dashboard de Cloudinary:

```
Dashboard > Settings > Upload

Necesitas estos 3 valores:
- Cloud Name: tu-cloud-name
- API Key: 123456789012345
- Upload Preset: nombre-del-preset (crear uno)
```

### **3. Crear Upload Preset**

```
Settings > Upload > Add upload preset

Configuración recomendada:
- Signing Mode: Unsigned (para frontend)
- Folder: products (organiza las imágenes)
- Allowed formats: jpg, png, webp
- Transformations: 
  - Resize: 800x800 (max)
  - Quality: auto
  - Format: auto (WebP si el navegador soporta)

Guardar y copiar el nombre del preset
```

---

## 🔧 Configuración en el Proyecto

### **1. Instalar Dependencias**

```bash
npm install cloudinary
```

### **2. Variables de Entorno**

Crear/actualizar `.env`:

```env
# Cloudinary Configuration
VITE_CLOUDINARY_CLOUD_NAME=tu-cloud-name
VITE_CLOUDINARY_UPLOAD_PRESET=tu-upload-preset
```

⚠️ **Importante:** Agregar `.env` a `.gitignore`

### **3. Crear Servicio de Upload**

Crear archivo: `src/services/cloudinary.service.ts`

```typescript
// Servicio para subir imágenes a Cloudinary
export const uploadImageToCloudinary = async (file: File): Promise<string> => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary no está configurado')
  }

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', uploadPreset)
  formData.append('folder', 'products')

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    )

    if (!response.ok) {
      throw new Error('Error al subir imagen')
    }

    const data = await response.json()
    return data.secure_url
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error)
    throw error
  }
}

// Función para generar URLs con transformaciones
export const getOptimizedImageUrl = (
  publicId: string,
  options = { width: 800, quality: 'auto', format: 'auto' }
): string => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
  const { width, quality, format } = options
  
  return `https://res.cloudinary.com/${cloudName}/image/upload/w_${width},q_${quality},f_${format}/${publicId}`
}
```

### **4. Actualizar ProductForm**

Modificar `src/admin/components/ProductForm.tsx`:

```typescript
import { uploadImageToCloudinary } from '@/services/cloudinary.service'

// En handleImageUpload, reemplazar optimizeImage por:
const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0]
  if (!file) return

  // Validaciones
  if (!file.type.startsWith('image/')) {
    setFormError('Por favor selecciona un archivo de imagen válido')
    return
  }

  if (file.size > 5 * 1024 * 1024) {
    setFormError('La imagen no debe superar 5MB')
    return
  }

  try {
    setImageFile(file)
    setFormError(null)
    
    // Subir a Cloudinary
    const cloudinaryUrl = await uploadImageToCloudinary(file)
    setImagePreview(cloudinaryUrl)
    setImageUrl(cloudinaryUrl)
  } catch (error) {
    setFormError('Error al subir la imagen. Intenta nuevamente.')
  }
}
```

---

## 🧪 Testing

### **Probar Upload:**

1. Ir a `/admin/medications`
2. Click "Agregar Producto"
3. Subir una imagen
4. Verificar:
   - Preview se muestra
   - URL comienza con `https://res.cloudinary.com/...`
   - Imagen se guarda en Cloudinary dashboard

### **Verificar en Cloudinary:**

```
Dashboard > Media Library > products/
```

Deberías ver la imagen subida.

---

## 📊 Monitoreo

### **Ver Uso del Plan Gratuito:**

```
Dashboard > Usage
```

Límites del plan gratuito:
- **Storage:** 25 GB
- **Bandwidth:** 25 GB/mes
- **Transformaciones:** 25,000/mes
- **Requests:** 25,000/mes

### **Optimización Recomendada:**

```typescript
// Para listado de productos (thumbnail)
getOptimizedImageUrl(publicId, { width: 200, quality: 'auto' })

// Para vista detallada
getOptimizedImageUrl(publicId, { width: 800, quality: 'auto' })

// Para zoom
getOptimizedImageUrl(publicId, { width: 1200, quality: '90' })
```

---

## 🔐 Seguridad

### **Upload Preset Unsigned:**
- ✅ Permite upload desde frontend
- ✅ Sin exponer API Secret
- ⚠️ Cualquiera con el preset puede subir
- 💡 Configurar límites en Cloudinary dashboard

### **Mejoras Futuras:**
1. **Signed Upload:** Backend firma las peticiones
2. **Moderación:** Revisar imágenes antes de mostrar
3. **Límites:** Rate limiting por usuario

---

## 🐛 Troubleshooting

### Error: "Upload preset not found"
```
Solución: Verifica que el preset existe y es "unsigned"
```

### Error: "Invalid cloud name"
```
Solución: Verifica VITE_CLOUDINARY_CLOUD_NAME en .env
```

### Imagen no se muestra
```
Solución: Verifica CORS en Cloudinary settings
Settings > Security > Allowed fetch domains: *
```

### Upload muy lento
```
Solución: 
1. Reducir tamaño de imagen antes de subir
2. Usar compresión en frontend
3. Verificar conexión
```

---

## 📈 Métricas de Performance

### Comparación Base64 vs Cloudinary:

| Métrica | Base64 | Cloudinary |
|---------|--------|------------|
| **Tamaño en DB** | 150KB/imagen | 100 bytes (URL) |
| **Tiempo de carga** | 2-3s | 0.3-0.5s (CDN) |
| **Primera carga** | Slow | Fast |
| **Cache** | No | Sí (CDN) |
| **Bandwidth** | Alto | Bajo |

---

## ✅ Checklist de Implementación

- [ ] Crear cuenta en Cloudinary
- [ ] Configurar upload preset (unsigned)
- [ ] Copiar Cloud Name y Upload Preset
- [ ] Agregar variables a `.env`
- [ ] Instalar dependencias
- [ ] Crear servicio de Cloudinary
- [ ] Actualizar ProductForm
- [ ] Probar upload de imagen
- [ ] Verificar en Cloudinary dashboard
- [ ] Actualizar documentación
- [ ] Deploy con nuevas variables de entorno

---

## 🔗 Referencias

- [Cloudinary Docs](https://cloudinary.com/documentation)
- [Upload Widget](https://cloudinary.com/documentation/upload_widget)
- [Image Transformations](https://cloudinary.com/documentation/image_transformations)
- [React Integration](https://cloudinary.com/documentation/react_integration)

---

## 📞 Soporte

**Equipo igloolab**  
Email: soporte@igloolab.co  
Documentación: `/docs`

---

*Última actualización: 11/8/2025 21:46*
