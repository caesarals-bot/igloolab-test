# 🔧 Cambios Necesarios en el Backend

## Problema Resuelto

El frontend ahora usa `imageUrl` consistentemente. El backend debe aceptar y devolver `imageUrl` (no `imagen`).

---

## 📝 Cambios en el Backend

### 1. Modelo de Product (Sequelize)

```javascript
// models/Product.js
module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    fechaElaboracion: {
      type: DataTypes.DATE,
      allowNull: false
    },
    fechaVencimiento: {
      type: DataTypes.DATE,
      allowNull: false
    },
    imageUrl: {  // ⬅️ CAMBIAR DE "imagen" A "imageUrl"
      type: DataTypes.TEXT,  // TEXT para soportar Base64 largo
      allowNull: true
    }
  }, {
    tableName: 'products',
    timestamps: true
  })

  return Product
}
```

### 2. Migración de Base de Datos

```javascript
// migrations/XXXXXX-rename-imagen-to-imageUrl.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Renombrar columna si ya existe
    await queryInterface.renameColumn('products', 'imagen', 'imageUrl');
  },

  async down(queryInterface, Sequelize) {
    // Revertir si es necesario
    await queryInterface.renameColumn('products', 'imageUrl', 'imagen');
  }
};
```

**Ejecutar:**
```bash
npx sequelize-cli db:migrate
```

### 3. Controlador de Products

```javascript
// controllers/products.controller.js

// CREATE
exports.create = async (req, res) => {
  try {
    const { nombre, precio, descripcion, fechaElaboracion, fechaVencimiento, imageUrl } = req.body
    //                                                                          ^^^^^^^^
    
    // Validaciones
    if (!nombre || !precio || !descripcion || !fechaElaboracion || !fechaVencimiento) {
      return res.status(400).json({ 
        message: 'Faltan campos requeridos' 
      })
    }

    // Crear producto
    const product = await Product.create({
      nombre,
      precio,
      descripcion,
      fechaElaboracion,
      fechaVencimiento,
      imageUrl  // ⬅️ CAMBIAR DE "imagen" A "imageUrl"
    })

    res.status(201).json({ 
      product: product.toJSON() 
    })
  } catch (error) {
    console.error('Error creating product:', error)
    res.status(500).json({ 
      message: 'Error al crear producto',
      error: error.message 
    })
  }
}

// UPDATE
exports.update = async (req, res) => {
  try {
    const { id } = req.params
    const { nombre, precio, descripcion, fechaElaboracion, fechaVencimiento, imageUrl } = req.body
    //                                                                          ^^^^^^^^

    const product = await Product.findByPk(id)
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' })
    }

    // Actualizar
    await product.update({
      nombre: nombre || product.nombre,
      precio: precio || product.precio,
      descripcion: descripcion || product.descripcion,
      fechaElaboracion: fechaElaboracion || product.fechaElaboracion,
      fechaVencimiento: fechaVencimiento || product.fechaVencimiento,
      imageUrl: imageUrl !== undefined ? imageUrl : product.imageUrl
      // ^^^^^^^ CAMBIAR DE "imagen" A "imageUrl"
    })

    res.json({ 
      product: product.toJSON() 
    })
  } catch (error) {
    console.error('Error updating product:', error)
    res.status(500).json({ 
      message: 'Error al actualizar producto',
      error: error.message 
    })
  }
}

// GET ALL
exports.getAll = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, sortBy = 'createdAt', order = 'desc' } = req.query

    const offset = (page - 1) * limit
    const whereClause = search ? {
      [Op.or]: [
        { nombre: { [Op.iLike]: `%${search}%` } },
        { descripcion: { [Op.iLike]: `%${search}%` } }
      ]
    } : {}

    const { count, rows } = await Product.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[sortBy, order.toUpperCase()]],
      attributes: ['id', 'nombre', 'descripcion', 'precio', 
                   'fechaElaboracion', 'fechaVencimiento', 
                   'imageUrl', 'createdAt', 'updatedAt']
      //           ^^^^^^^^ Asegurar que se incluya
    })

    res.json({
      products: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    res.status(500).json({ 
      message: 'Error al obtener productos',
      error: error.message 
    })
  }
}
```

### 4. Validación (Opcional pero Recomendado)

```javascript
// middleware/validators/product.validator.js
const { body } = require('express-validator')

exports.createProductValidator = [
  body('nombre')
    .notEmpty().withMessage('Nombre es requerido')
    .isString().withMessage('Nombre debe ser texto'),
  
  body('precio')
    .notEmpty().withMessage('Precio es requerido')
    .isFloat({ min: 0 }).withMessage('Precio debe ser un número positivo'),
  
  body('descripcion')
    .notEmpty().withMessage('Descripción es requerida')
    .isString().withMessage('Descripción debe ser texto'),
  
  body('fechaElaboracion')
    .notEmpty().withMessage('Fecha de elaboración es requerida')
    .isISO8601().withMessage('Fecha de elaboración inválida'),
  
  body('fechaVencimiento')
    .notEmpty().withMessage('Fecha de vencimiento es requerida')
    .isISO8601().withMessage('Fecha de vencimiento inválida'),
  
  body('imageUrl')
    .optional()
    .custom((value) => {
      // Validar que sea Base64 o URL
      if (value.startsWith('data:image/')) {
        // Es Base64
        return true
      } else if (value.startsWith('http://') || value.startsWith('https://')) {
        // Es URL
        try {
          new URL(value)
          return true
        } catch {
          throw new Error('URL inválida')
        }
      } else {
        throw new Error('imageUrl debe ser Base64 o URL válida')
      }
    })
]

exports.updateProductValidator = [
  body('nombre').optional().isString(),
  body('precio').optional().isFloat({ min: 0 }),
  body('descripcion').optional().isString(),
  body('fechaElaboracion').optional().isISO8601(),
  body('fechaVencimiento').optional().isISO8601(),
  body('imageUrl').optional().custom((value) => {
    if (value.startsWith('data:image/') || 
        value.startsWith('http://') || 
        value.startsWith('https://')) {
      return true
    }
    throw new Error('imageUrl inválida')
  })
]
```

### 5. Rutas

```javascript
// routes/products.routes.js
const express = require('express')
const router = express.Router()
const productsController = require('../controllers/products.controller')
const { createProductValidator, updateProductValidator } = require('../middleware/validators/product.validator')
const { validationResult } = require('express-validator')

// Middleware para manejar errores de validación
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      message: 'Errores de validación',
      errors: errors.array() 
    })
  }
  next()
}

// Rutas
router.get('/', productsController.getAll)
router.get('/:id', productsController.getById)
router.post('/', createProductValidator, handleValidationErrors, productsController.create)
router.put('/:id', updateProductValidator, handleValidationErrors, productsController.update)
router.delete('/:id', productsController.delete)

module.exports = router
```

---

## 🧪 Testing

### Probar con Postman/Thunder Client

#### POST /api/products (Con URL)

```json
{
  "nombre": "Paracetamol 1g",
  "precio": 85.00,
  "descripcion": "Analgésico y antipirético",
  "fechaElaboracion": "2023-05-15T00:00:00.000Z",
  "fechaVencimiento": "2024-11-30T00:00:00.000Z",
  "imageUrl": "https://res.cloudinary.com/demo/image/upload/sample.jpg"
}
```

#### POST /api/products (Con Base64)

```json
{
  "nombre": "Ibuprofeno 400mg",
  "precio": 95.50,
  "descripcion": "Antiinflamatorio",
  "fechaElaboracion": "2023-03-22T00:00:00.000Z",
  "fechaVencimiento": "2025-08-15T00:00:00.000Z",
  "imageUrl": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEA..."
}
```

#### Respuesta Esperada

```json
{
  "product": {
    "id": "uuid-here",
    "nombre": "Paracetamol 1g",
    "precio": 85.00,
    "descripcion": "Analgésico y antipirético",
    "fechaElaboracion": "2023-05-15T00:00:00.000Z",
    "fechaVencimiento": "2024-11-30T00:00:00.000Z",
    "imageUrl": "https://res.cloudinary.com/demo/image/upload/sample.jpg",
    "createdAt": "2024-01-09T12:00:00.000Z",
    "updatedAt": "2024-01-09T12:00:00.000Z"
  }
}
```

---

## 📊 Resumen de Cambios

| Archivo | Cambio |
|---------|--------|
| `models/Product.js` | `imagen` → `imageUrl` |
| `migrations/XXXXX.js` | Renombrar columna |
| `controllers/products.controller.js` | Usar `imageUrl` en req.body |
| `validators/product.validator.js` | Validar `imageUrl` |
| `routes/products.routes.js` | Aplicar validaciones |

---

## ⚠️ Importante

1. **Backup de la base de datos** antes de la migración
2. **Probar en desarrollo** primero
3. **Actualizar seeders** si los tienes
4. **Verificar payload size limit** para Base64:

```javascript
// server.js o app.js
app.use(express.json({ limit: '10mb' }))  // Para imágenes Base64
app.use(express.urlencoded({ limit: '10mb', extended: true }))
```

---

## ✅ Checklist

- [ ] Actualizar modelo Product
- [ ] Crear y ejecutar migración
- [ ] Actualizar controlador (create/update)
- [ ] Agregar validaciones
- [ ] Aumentar límite de payload
- [ ] Probar con Postman
- [ ] Verificar en el frontend
- [ ] Commit y deploy

---

## 🆘 Troubleshooting

### Error: "column 'imagen' does not exist"
**Solución:** Ejecutar la migración para renombrar la columna

### Error: 413 Payload Too Large
**Solución:** Aumentar límite en Express
```javascript
app.use(express.json({ limit: '10mb' }))
```

### Error: ValidationError
**Solución:** Verificar que `imageUrl` sea opcional y válida (Base64 o URL)
