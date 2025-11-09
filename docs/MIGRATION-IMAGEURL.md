# 🔄 Migración: imagen → imageUrl

Guía completa para migrar el campo `imagen` a `imageUrl` con soporte para Base64.

---

## ✅ Cambios Implementados

### 1. **Entidad Product** (`src/entities/Product.entity.ts`)
```typescript
// ANTES
@Column({ type: 'varchar', length: 500, nullable: true })
imagen?: string;

// DESPUÉS
@Column({ type: 'text', nullable: true })
imageUrl?: string;
```

### 2. **Validadores** (`src/validators/product.validator.ts`)
- ✅ Renombrado `imagen` → `imageUrl`
- ✅ Soporte para URLs normales (`http://`, `https://`)
- ✅ Soporte para Base64 (`data:image/...`)
- ✅ Validación de formato

### 3. **Service** (`src/services/product.service.ts`)
- ✅ Actualizado tipo `imagen` → `imageUrl` en interfaces

### 4. **Express Server** (`src/index.ts`)
- ✅ Límite de payload aumentado a 10MB para Base64
```typescript
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
```

### 5. **Migración TypeORM**
- ✅ Creada: `src/migrations/1731166800000-RenameImagenToImageUrl.ts`
- Renombra columna `imagen` → `imageUrl`
- Cambia tipo `VARCHAR(500)` → `TEXT` para soportar Base64

---

## 🚀 Cómo Ejecutar la Migración

### Opción 1: Con Synchronize (Desarrollo - Pérdida de Datos)

Si estás en desarrollo y no te importa perder los datos actuales:

```bash
# Simplemente reinicia el servidor
npm run dev
```

TypeORM creará automáticamente la nueva columna `imageUrl` y eliminará `imagen`.

⚠️ **ADVERTENCIA:** Perderás todos los datos de la columna `imagen`.

---

### Opción 2: Con Migración Manual (Recomendado - Preserva Datos)

Para preservar los datos existentes:

#### Paso 1: Desactivar Synchronize Temporalmente

Edita `src/config/database.ts`:

```typescript
// CAMBIAR TEMPORALMENTE
synchronize: false,  // Era: env.NODE_ENV === 'development'
```

#### Paso 2: Ejecutar la Migración

```bash
npm run migration:run
```

Salida esperada:
```
✅ Column "imagen" renamed to "imageUrl" and type changed to TEXT
Migration RenameImagenToImageUrl1731166800000 has been executed successfully.
```

#### Paso 3: Reactivar Synchronize (opcional)

Vuelve a cambiar `src/config/database.ts`:

```typescript
synchronize: env.NODE_ENV === 'development',
```

#### Paso 4: Verificar en la Base de Datos

```sql
-- Conectarse a PostgreSQL
psql -U postgres -d igloolab

-- Verificar estructura de la tabla
\d products

-- Deberías ver:
-- imageUrl | text | nullable
```

---

## 🧪 Testing

### 1. Probar con URL Normal

```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Paracetamol 500mg",
    "precio": 15000,
    "descripcion": "Analgésico y antipirético de venta libre",
    "fechaElaboracion": "2024-01-15T00:00:00.000Z",
    "fechaVencimiento": "2026-01-15T00:00:00.000Z",
    "imageUrl": "https://example.com/paracetamol.jpg"
  }'
```

### 2. Probar con Base64

```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Ibuprofeno 400mg",
    "precio": 20000,
    "descripcion": "Antiinflamatorio no esteroideo para dolor moderado",
    "fechaElaboracion": "2024-02-01T00:00:00.000Z",
    "fechaVencimiento": "2026-02-01T00:00:00.000Z",
    "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
  }'
```

### 3. Probar Validación de Error

```bash
# URL inválida (debe fallar)
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Test",
    "precio": 100,
    "descripcion": "Test product",
    "fechaElaboracion": "2024-01-01T00:00:00.000Z",
    "fechaVencimiento": "2025-01-01T00:00:00.000Z",
    "imageUrl": "invalid-url"
  }'
```

Respuesta esperada:
```json
{
  "message": "Errores de validación",
  "errors": [
    {
      "msg": "La imagen debe ser una URL válida o Base64 (data:image/...)"
    }
  ]
}
```

---

## 📊 Comparación Antes/Después

### Request Body - ANTES
```json
{
  "nombre": "Producto X",
  "precio": 100,
  "descripcion": "...",
  "fechaElaboracion": "2024-01-01",
  "fechaVencimiento": "2025-01-01",
  "imagen": "https://example.com/image.jpg"  // ❌ Campo antiguo
}
```

### Request Body - DESPUÉS
```json
{
  "nombre": "Producto X",
  "precio": 100,
  "descripcion": "...",
  "fechaElaboracion": "2024-01-01",
  "fechaVencimiento": "2025-01-01",
  "imageUrl": "https://example.com/image.jpg"  // ✅ Campo nuevo
}
```

### Response - DESPUÉS
```json
{
  "product": {
    "id": "uuid",
    "nombre": "Producto X",
    "precio": 100,
    "descripcion": "...",
    "fechaElaboracion": "2024-01-01T00:00:00.000Z",
    "fechaVencimiento": "2025-01-01T00:00:00.000Z",
    "imageUrl": "https://example.com/image.jpg",  // ✅ Nuevo campo
    "createdAt": "2024-11-09T12:00:00.000Z",
    "updatedAt": "2024-11-09T12:00:00.000Z"
  }
}
```

---

## 🔄 Revertir Migración (si es necesario)

Si algo sale mal, puedes revertir:

```bash
npm run migration:revert
```

Esto ejecutará el método `down()` de la migración, que:
1. Cambia tipo `TEXT` → `VARCHAR(500)`
2. Renombra `imageUrl` → `imagen`

---

## ✅ Checklist Final

Antes de pasar a producción:

- [ ] ✅ Migración ejecutada exitosamente
- [ ] ✅ Columna `imageUrl` existe en la tabla `products`
- [ ] ✅ Tipo de columna es `TEXT`
- [ ] ✅ Probado crear producto con URL
- [ ] ✅ Probado crear producto con Base64
- [ ] ✅ Validaciones funcionando correctamente
- [ ] ✅ Frontend actualizado para usar `imageUrl`
- [ ] ✅ Datos existentes migrados (si aplica)
- [ ] ✅ Documentación actualizada

---

## 📝 Notas Importantes

### Tamaño de Base64
- Una imagen de 100KB → ~133KB en Base64
- Una imagen de 500KB → ~667KB en Base64
- Límite actual: 10MB en payload

### Recomendaciones
1. **Para producción:** Usar servicio de almacenamiento (Cloudinary, S3)
2. **Base64:** Solo para imágenes pequeñas o previews
3. **Optimización:** Comprimir imágenes antes de enviar

### Compatibilidad con Frontend
El frontend debe enviar:
```javascript
{
  imageUrl: "https://..." // o "data:image/..."
}
```

---

## 🆘 Troubleshooting

### Error: "column 'imagen' does not exist"
**Causa:** La migración ya se ejecutó o synchronize creó la tabla nueva.  
**Solución:** Verificar con `\d products` en PostgreSQL.

### Error: 413 Payload Too Large
**Causa:** Imagen Base64 muy grande.  
**Solución:** Ya está configurado 10MB, comprimir imagen o usar URL.

### Error: ValidationError en imageUrl
**Causa:** Formato incorrecto.  
**Solución:** Debe empezar con `http://`, `https://` o `data:image/`.

### Error: Migration already exists
**Causa:** La migración ya se ejecutó.  
**Solución:** Verificar tabla `migrations` en DB:
```sql
SELECT * FROM migrations;
```

---

## 📚 Recursos

- [TypeORM Migrations](https://typeorm.io/migrations)
- [Express Body Parser](https://expressjs.com/en/api.html#express.json)
- [Base64 Images](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs)

---

**✅ Migración completada con éxito!**

Ahora tu backend acepta `imageUrl` con soporte para URLs y Base64.
