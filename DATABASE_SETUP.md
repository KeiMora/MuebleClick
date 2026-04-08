# 🗄️ Configuración de Base de Datos - MuebleClick

## 📋 Requisitos Previos

1. **MySQL** instalado y corriendo
2. **PHP** instalado (versión 7.4+)
3. **Node.js** y **npm** instalados

## 🚀 Configuración Rápida

### Paso 1: Configurar Base de Datos

```bash
# Ejecutar el script de configuración
./setup_database.sh
```

O manualmente:

```bash
# 1. Crear la base de datos
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS muebleclick;"

# 2. Importar estructura
mysql -u root -p muebleclick < database/crear_base_datos.sql

# 3. Insertar datos de prueba
mysql -u root -p muebleclick < database/cargar_datos_prueba.sql
```

### Paso 2: Iniciar Servidor Backend

```bash
# Iniciar servidor PHP en el puerto 8000
php -S localhost:8000 server.php
```

### Paso 3: Iniciar Frontend React

```bash
# En otra terminal, iniciar React
npm start
```

## 🔍 Verificación

### Verificar Base de Datos:

```sql
mysql -u root -p muebleclick
SHOW TABLES;
```

Deberías ver las tablas:
- Usuarios
- Mueblerias
- Productos
- Sucursales
- Inventario
- Pedidos
- etc.

### Verificar API:

```bash
# Probar endpoint de mueblerías
curl http://localhost:8000/api/mueblerias

# Probar productos de mueblería 1
curl http://localhost:8000/api/productos/muebleria/1
```

### Verificar Frontend:

Visita `http://localhost:3000` y deberías ver:
- ✅ El nuevo diseño moderno
- ✅ Las 3 mueblerías cargando desde la base de datos
- ✅ Las imágenes de la primera mueblería

## 🔧 Configuración de Archivos

### database/config.php
```php
private $host = 'localhost';
private $db_name = 'muebleclick';
private $username = 'root';
private $password = ''; // Cambia si tienes contraseña
```

### package.json
```json
{
  "proxy": "http://localhost:8000"
}
```

## 📊 Estructura de Datos

### Mueblerías de Prueba:
1. **Muebles Modernos SA de CV** (ID: 1) - Con 3 productos
2. **Muebles Clásicos y Tradicionales** (ID: 2)
3. **Muebles Rústicos del Bajío** (ID: 3)

### Productos de Prueba:
- Sofá Moderno de 3 Plazas - $8,999
- Silla de Comedor Moderna - $1,299
- Mesa de Centro Cristal - $3,499

## 🚨 Solución de Problemas

### Error de Conexión:
```bash
# Verificar que MySQL esté corriendo
brew services start mysql  # macOS
sudo systemctl start mysql  # Linux
```

### Error de Puerto:
```bash
# Matar procesos en puertos 3000 y 8000
lsof -ti:3000 | xargs kill -9
lsof -ti:8000 | xargs kill -9
```

### Permisos MySQL:
```sql
GRANT ALL PRIVILEGES ON muebleclick.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
```

## 🎯 Endpoints Disponibles

### Mueblerías:
- `GET /api/mueblerias` - Todas las mueblerías
- `GET /api/mueblerias/{id}` - Detalle de mueblería

### Productos:
- `GET /api/productos` - Todos los productos
- `GET /api/productos/muebleria/{id}` - Productos por mueblería
- `GET /api/productos/muebleria/{id}?categoria=Sofás` - Filtrar por categoría
- `GET /api/productos/muebleria/{id}?ordenar=precio_asc` - Ordenar por precio

## 📱 Flujo Completo

1. **Usuario visita** `http://localhost:3000`
2. **React carga** datos desde `http://localhost:8000/api/mueblerias`
3. **PHP consulta** la base de datos MySQL
4. **MySQL devuelve** los datos de mueblerías
5. **PHP responde** con JSON
6. **React renderiza** las tarjetas con datos reales
7. **Usuario hace clic** en una mueblería
8. **React carga** productos desde `/api/productos/muebleria/{id}`
9. **Se muestra** el catálogo con imágenes reales

## ✅ Checklist Final

- [ ] MySQL corriendo
- [ ] Base de datos 'muebleclick' creada
- [ ] Tablas importadas
- [ ] Datos de prueba insertados
- [ ] Servidor PHP corriendo en puerto 8000
- [ ] Frontend React corriendo en puerto 3000
- [ ] API funcionando (probar con curl)
- [ ] Imágenes cargando correctamente
- [ ] Diseño moderno visible

¡Listo para usar! 🎉
