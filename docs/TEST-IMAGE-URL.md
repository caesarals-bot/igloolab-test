# 🧪 Test de Imagen URL

## Verificar Paso a Paso

### 1. Verificar que el Backend Esté Corriendo

```bash
# En el terminal del backend, debe mostrar:
Server running on port 3000
Database connected
```

### 2. Verificar la Migración en PostgreSQL

```bash
# Conectarse a PostgreSQL
psql -U postgres -d igloolab

# Verificar la tabla
\d products

# Debes ver algo como:
# imageUrl | text | nullable: YES
```

Si ves `imagen` en lugar de `imageUrl`, ejecuta:
```bash
npm run migration:run
```

### 3. Probar con cURL (Sin Frontend)

```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Test Imagen",
    "precio": 100,
    "descripcion": "Test de imagen con URL",
    "fechaElaboracion": "2024-01-01T00:00:00.000Z",
    "fechaVencimiento": "2025-01-01T00:00:00.000Z",
    "imageUrl": "https://picsum.photos/200/300"
  }'
```

**Resultado esperado:**
```json
{
  "product": {
    "id": "uuid...",
    "nombre": "Test Imagen",
    "imageUrl": "https://picsum.photos/200/300",
    ...
  }
}
```

**Si sale error 400:**
```json
{
  "message": "Errores de validación",
  "errors": [...]
}
```

### 4. Verificar Validador del Backend

El validador debe aceptar URLs que empiecen con `http://` o `https://`:

```typescript
// src/validators/product.validator.ts
body('imageUrl')
  .optional()
  .custom((value) => {
    if (!value) return true;
    
    // Aceptar URLs
    if (value.startsWith('http://') || value.startsWith('https://')) {
      return true;
    }
    
    // Aceptar Base64
    if (value.startsWith('data:image/')) {
      return true;
    }
    
    throw new Error('La imagen debe ser una URL válida o Base64');
  })
```

### 5. Verificar Consola del Navegador

Abre DevTools (F12) y ve a la pestaña **Network**.

Cuando intentes guardar el producto, busca la llamada `POST /api/products`.

**Request Payload debe ser:**
```json
{
  "nombre": "Paracetamol 1g",
  "precio": 85.00,
  "descripcion": "Analgésico",
  "fechaElaboracion": "2024-11-09T13:00:00.000Z",
  "fechaVencimiento": "2025-11-09T13:00:00.000Z",
  "imageUrl": "https://www.shutterstock.com/es/search/paracetamol"
}
```

**Response debe ser:**
- Status: 201 Created
- Body: `{ "product": { ... } }`

**Si sale error:**
- Status: 400 o 500
- Body: `{ "message": "...", "errors": [...] }`

### 6. URLs de Prueba Válidas

Usa estas URLs para probar:

```
https://picsum.photos/200/300
https://via.placeholder.com/300
https://images.unsplash.com/photo-1584308666744-24d5c474f2ae
https://res.cloudinary.com/demo/image/upload/sample.jpg
```

### 7. Verificar CORS (Si Backend en Otro Puerto)

Si el backend está en `http://localhost:3000` y frontend en `http://localhost:5174`:

```typescript
// Backend - src/index.ts
import cors from 'cors';

app.use(cors({
  origin: 'http://localhost:5174',
  credentials: true
}));
```

---

## 🐛 Errores Comunes

### Error: "imageUrl must be a valid URL"

**Causa:** El validador no acepta el formato.

**Solución:**
```typescript
// Validador más permisivo
.custom((value) => {
  if (!value) return true;
  
  // Validar URL
  if (value.startsWith('http')) {
    try {
      new URL(value);
      return true;
    } catch {
      throw new Error('URL inválida');
    }
  }
  
  // Validar Base64
  if (value.startsWith('data:image/')) {
    return true;
  }
  
  throw new Error('Formato no válido');
})
```

### Error: "Column 'imageUrl' does not exist"

**Causa:** La migración no se ejecutó.

**Solución:**
```bash
npm run migration:run
```

### Error: Network Failed / CORS

**Causa:** CORS bloqueado.

**Solución:** Verificar que el backend tenga CORS habilitado.

### Error: 413 Payload Too Large

**Causa:** Base64 muy grande.

**Solución:** Ya está configurado 10MB, pero verifica:
```typescript
app.use(express.json({ limit: '10mb' }));
```

---

## ✅ Checklist de Diagnóstico

Marca lo que ya verificaste:

- [ ] Backend corriendo en `http://localhost:3000`
- [ ] Base de datos conectada
- [ ] Migración ejecutada (`imageUrl` existe en tabla)
- [ ] Validador acepta URLs con `http://` o `https://`
- [ ] CORS habilitado
- [ ] Payload limit configurado
- [ ] Frontend envía `imageUrl` (no `imagen`)
- [ ] Probado con cURL directamente
- [ ] Consola del navegador sin errores

---

## 💡 Test Rápido

**Intenta guardar este producto desde el frontend:**

```
Nombre: Test URL
Precio: 100
Descripción: Producto de prueba
Fecha Elaboración: Hoy
Fecha Vencimiento: +1 año
URL Imagen: https://picsum.photos/200/300
```

**Abre F12 → Network → Busca la llamada POST**

- ¿Qué status code sale? (200, 400, 500?)
- ¿Qué dice el Response?
- ¿Qué dice el Request Payload?

**Copia y pega el error completo aquí** y te ayudo a solucionarlo.
