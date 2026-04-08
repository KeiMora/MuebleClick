# Guía de Importación de Imágenes y Datos para MuebleClick

Este directorio contiene los archivos necesarios para importar las imágenes y datos de las mueblerías y sus productos.

## Estructura de Directorios

```
importar/
├── README.md                 # Este archivo
├── importar_mueblerias.php   # Script para importar datos de mueblerías
├── importar_productos.php    # Script para importar datos de productos
├── imagenes/                 # Directorio para las imágenes
│   ├── muebleria_1/         # Imágenes de la primera mueblería
│   │   ├── logo.jpg         # Logo de la mueblería
│   │   └── productos/       # Directorio de productos
│   │       ├── 1.jpg        # Producto ID 1
│   │       ├── 2.jpg        # Producto ID 2
│   │       └── ...
│   ├── muebleria_2/         # Imágenes de la segunda mueblería
│   └── muebleria_3/         # Imágenes de la tercera mueblería
└── datos/                    # Archivos de datos
    ├── muebleria_1.json     # Datos de la primera mueblería
    ├── muebleria_2.json     # Datos de la segunda mueblería
    └── muebleria_3.json     # Datos de la tercera mueblería
```

## Instrucciones de Uso

### 1. Preparar las Imágenes

1. **Logo de la Mueblería**: 
   - Nombre: `logo.jpg`
   - Formato: JPG o PNG
   - Tamaño recomendado: 300x300 píxeles
   - Ubicación: `imagenes/muebleria_X/logo.jpg`

2. **Imágenes de Productos**:
   - Nombre: `{id_producto}.jpg` (ej: 1.jpg, 2.jpg, etc.)
   - Formato: JPG o PNG
   - Tamaño recomendado: 800x600 píxeles
   - Ubicación: `imagenes/muebleria_X/productos/`

### 2. Preparar los Datos

Crea un archivo JSON para cada mueblería con la siguiente estructura:

#### Archivo: `datos/muebleria_X.json`

```json
{
  "muebleria": {
    "id_muebleria": 1,
    "nombre_negocio": "Muebles Modernos SA de CV",
    "descripcion": "Especialistas en muebles de diseño contemporáneo",
    "telefono": "55-1234-5678",
    "email": "contacto@mueblesmodernos.com",
    "whatsapp": "55-9876-5432",
    "facebook": "https://facebook.com/mueblesmodernos",
    "instagram": "https://instagram.com/mueblesmodernos"
  },
  "productos": [
    {
      "sku": "MM-SOF-001",
      "nombre": "Sofá Moderno de 3 Plazas",
      "descripcion": "Elegante sofá de diseño contemporáneo con tapizado de alta calidad",
      "categoria": "Salas",
      "color": "Gris Oscuro",
      "material": "Tela Premium",
      "medidas": "2.20m x 0.90m x 0.85m",
      "precio_venta": 8999.00,
      "peso_kg": 45.5,
      "volumen_m3": 1.68,
      "stock_inicial": 15,
      "caracteristicas": [
        "Estructura de madera maciza",
        "Cojines rellenos de espuma de alta densidad",
        "Apoyabrazos acolchados",
        "Patas de metal cromado"
      ]
    },
    {
      "sku": "MM-MES-002",
      "nombre": "Mesa de Centro Cristal",
      "descripcion": "Moderna mesa de centro con superficie de cristal templado",
      "categoria": "Mesas",
      "color": "Transparente/Cromo",
      "material": "Cristal Templado y Metal",
      "medidas": "1.20m x 0.60m x 0.45m",
      "precio_venta": 3499.00,
      "peso_kg": 25.0,
      "volumen_m3": 0.32,
      "stock_inicial": 8,
      "caracteristicas": [
        "Cristal templado de 10mm",
        "Base de metal cromado",
        "Borde pulido",
        "Fácil limpieza"
      ]
    }
  ]
}
```

### 3. Ejecutar la Importación

1. **Importar Mueblerías**:
   ```bash
   php importar_mueblerias.php
   ```

2. **Importar Productos**:
   ```bash
   php importar_productos.php
   ```

### 4. Verificar la Importación

Después de ejecutar los scripts, verifica en la base de datos que:
- Los datos de las mueblerías se hayan actualizado correctamente
- Los productos se hayan creado con las especificaciones correctas
- Las imágenes estén en las rutas correctas

## Formatos Específicos

### Colores
- Usa nombres estándar de colores
- Ejemplos: "Blanco", "Negro", "Gris Oscuro", "Madera Natural", "Beige", "Azul Marino"

### Materiales
- Sé específico con los materiales
- Ejemplos: "Madera de Roble", "Cuero Genuino", "Tela Premium", "Acero Inoxidable", "Cristal Templado"

### Medidas
- Formato: "ancho x largo x alto"
- Unidades: metros (m) o centímetros (cm)
- Ejemplos: "2.20m x 0.90m x 0.85m", "120cm x 60cm x 45cm"

### Categorías Sugeridas
- Salas
- Recámaras
- Comedores
- Mesas
- Sillas
- Almacenamiento
- Decoración
- Oficina
- Exterior

## Consideraciones Técnicas

1. **Tamaño de Imágenes**:
   - Logo: Máximo 500KB
   - Productos: Máximo 2MB
   - Formatos aceptados: JPG, PNG, WebP

2. **Nombres de Archivos**:
   - Sin espacios ni caracteres especiales
   - Usar guiones bajos o guiones
   - Ejemplo: "sofa_moderno_3_plazas.jpg"

3. **Base de Datos**:
   - Asegúrate de tener una copia de seguridad antes de la importación
   - Los scripts actualizarán registros existentes y crearán nuevos

4. **Permisos**:
   - Asegúrate que los directorios tengan los permisos correctos de escritura
   - chmod 755 para directorios
   - chmod 644 para archivos

## Solución de Problemas

### Problemas Comunes

1. **Imágenes no se muestran**:
   - Verifica las rutas en la base de datos
   - Confirma que los archivos existan en los directorios correctos
   - Revisa los permisos de los archivos

2. **Error de conexión a la base de datos**:
   - Verifica las credenciales en `config/database.php`
   - Confirma que la base de datos exista

3. **JSON inválido**:
   - Usa un validador de JSON online
   - Verifica comas y corchetes
   - Confirma que no haya caracteres especiales no escapados

### Contacto de Soporte

Si encuentras algún problema durante la importación, contacta al equipo técnico:
- Email: soporte@muebleclick.com
- Teléfono: +52 123 456 7890

## Actualizaciones Futuras

Este sistema de importación se actualizará para incluir:
- Importación masiva desde archivos CSV
- Sincronización automática con sistemas externos
- Validación avanzada de datos
- Generación automática de miniaturas
