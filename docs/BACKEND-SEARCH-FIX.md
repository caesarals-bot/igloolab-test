# 🔧 Fix: Búsqueda Case-Insensitive en Backend

## ❌ Problema

Cuando buscas "ome" no encuentra "**Ome**prazol" porque el backend usa `LIKE` (case-sensitive).

---

## ✅ Solución: Cambiar a ILIKE (PostgreSQL)

### Opción 1: Usar ILIKE (Recomendado)

```typescript
// Backend - src/controllers/products.controller.ts
import { Op } from 'sequelize'

export const getAll = async (req, res) => {
  const { search } = req.query

  let whereClause = {}
  
  if (search) {
    whereClause = {
      [Op.or]: [
        { nombre: { [Op.iLike]: `%${search}%` } },      // ← ILIKE (case-insensitive)
        { descripcion: { [Op.iLike]: `%${search}%` } }  // ← ILIKE (case-insensitive)
      ]
    }
  }

  const products = await Product.findAll({ where: whereClause })
  res.json({ products })
}
```

### Opción 2: Usar LOWER() en ambos lados

```typescript
// Backend alternativo
import { Sequelize, Op } from 'sequelize'

export const getAll = async (req, res) => {
  const { search } = req.query

  if (search) {
    const searchLower = search.toLowerCase()
    
    whereClause = {
      [Op.or]: [
        Sequelize.where(
          Sequelize.fn('LOWER', Sequelize.col('nombre')),
          { [Op.like]: `%${searchLower}%` }
        ),
        Sequelize.where(
          Sequelize.fn('LOWER', Sequelize.col('descripcion')),
          { [Op.like]: `%${searchLower}%` }
        )
      ]
    }
  }

  const products = await Product.findAll({ where: whereClause })
  res.json({ products })
}
```

---

## 🧪 Testing

### Antes (❌ Case-Sensitive)

```bash
# Búsqueda: "ome"
GET /api/products?search=ome

# Resultado: []  (NO encuentra nada)
# Porque "Omeprazol" != "ome" (case-sensitive)
```

### Después (✅ Case-Insensitive)

```bash
# Búsqueda: "ome"
GET /api/products?search=ome

# Resultado:
[
  {
    "id": "med-005",
    "nombre": "Omeprazol 20mg",  // ← Encontrado!
    "descripcion": "Inhibidor de bomba de protones..."
  }
]
```

---

## 📊 Comparación

| Búsqueda | LIKE (❌) | ILIKE (✅) |
|----------|-----------|------------|
| `"ome"` | No encuentra | Encuentra **Ome**prazol |
| `"OME"` | No encuentra | Encuentra **Ome**prazol |
| `"Ome"` | Encuentra | Encuentra **Ome**prazol |
| `"amox"` | No encuentra | Encuentra **Amox**icilina |
| `"PARA"` | No encuentra | Encuentra **Para**cetamol |

---

## 🚀 Performance

Para mejor rendimiento con `ILIKE`, crear índices:

```sql
-- PostgreSQL
CREATE INDEX idx_products_nombre_gin ON products USING gin (nombre gin_trgm_ops);
CREATE INDEX idx_products_descripcion_gin ON products USING gin (descripcion gin_trgm_ops);

-- Requiere extensión pg_trgm
CREATE EXTENSION IF NOT EXISTS pg_trgm;
```

---

## ✅ Cambios Necesarios

### Archivo: `backend/src/controllers/products.controller.ts`

```typescript
// ANTES
whereClause = {
  [Op.or]: [
    { nombre: { [Op.like]: `%${search}%` } },      // ❌ Case-sensitive
    { descripcion: { [Op.like]: `%${search}%` } }
  ]
}

// DESPUÉS
whereClause = {
  [Op.or]: [
    { nombre: { [Op.iLike]: `%${search}%` } },      // ✅ Case-insensitive
    { descripcion: { [Op.iLike]: `%${search}%` } }
  ]
}
```

---

## 🧪 Cómo Probar

1. **Reiniciar backend** después del cambio
2. **Ir a** `http://localhost:5173/productos`
3. **Buscar** "ome" (minúscula)
4. **Verificar** que encuentra "**Ome**prazol"
5. **Buscar** "PARA" (mayúscula)
6. **Verificar** que encuentra "**Para**cetamol"

---

**⚠️ IMPORTANTE: Este cambio solo afecta al backend. El frontend ya está preparado para búsqueda case-insensitive en modo demo.**
