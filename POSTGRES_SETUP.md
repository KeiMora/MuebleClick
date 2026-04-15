# Configuración de PostgreSQL para MuebleClick

## Requisitos

- PostgreSQL 14 o superior
- Extensión PDO pgsql para PHP

## Instalación de PostgreSQL (macOS)

```bash
# Usando Homebrew
brew install postgresql

# Iniciar el servicio
brew services start postgresql

# Verificar instalación
psql --version
```

## Instalación de PostgreSQL (Ubuntu/Debian)

```bash
# Actualizar repositorios
sudo apt update

# Instalar PostgreSQL
sudo apt install postgresql postgresql-contrib

# Iniciar el servicio
sudo service postgresql start

# Verificar estado
sudo service postgresql status
```

## Configuración de la Base de Datos

### 1. Crear la base de datos

```bash
# Cambiar al usuario postgres
sudo -u postgres psql

# Dentro de psql, crear la base de datos
CREATE DATABASE muebles;

# Salir
\q
```

O usando el comando createdb:

```bash
sudo -u postgres createdb muebles
```

### 2. Importar el esquema

```bash
# Desde el directorio del proyecto
psql -U postgres -d muebles -f database/postgres_schema.sql
```

### 3. Verificar tablas creadas

```bash
psql -U postgres -d muebles -c "\dt"
```

## Instalación de PDO PostgreSQL para PHP

### macOS (con Homebrew PHP)

```bash
# Buscar la extensión
brew search pdo_pgsql

# Instalar (ejemplo con PHP 8.2)
brew install php@8.2-pdo-pgsql

# O instalar la extensión manualmente
pecl install pdo_pgsql
```

### Ubuntu/Debian

```bash
sudo apt install php-pgsql

# Reiniciar Apache/Nginx si es necesario
sudo service apache2 restart
# o
sudo service nginx restart
```

## Verificar la Instalación

### 1. Verificar extensión PDO pgsql

Crea un archivo `info.php`:

```php
<?php
phpinfo();
?>
```

Abre en navegador: `http://localhost:8000/info.php`

Busca la sección "PDO" y verifica que pgsql esté listado en "PDO drivers".

### 2. Probar conexión con el script incluido

```bash
# Desde el directorio del proyecto
php test_postgres.php
```

Deberías ver mensajes de éxito y la lista de tablas.

## Configuración de Conexión

Los archivos de configuración ya están actualizados:

- `/Users/keiramorales/Documents/MuebleClick/database/config.php` - Para server.php
- `/Users/keiramorales/Documents/MuebleClick/database/conexion_config.php` - Configuración alternativa
- `/Users/keiramorales/Documents/MuebleClick/config/database.php` - Configuración con funciones helper

Si necesitas cambiar las credenciales:

```php
define('DB_HOST', 'localhost');
define('DB_PORT', '5432');
define('DB_NAME', 'muebles');
define('DB_USER', 'postgres');
define('DB_PASS', '1234');
```

## Diferencias MySQL → PostgreSQL

| MySQL | PostgreSQL |
|-------|------------|
| `AUTO_INCREMENT` | `SERIAL` |
| `INT` | `INTEGER` |
| `DECIMAL` | `NUMERIC` |
| `TIMESTAMP` | `TIMESTAMP` |
| `JSON` | `JSONB` (recomendado) |
| `ENUM` | `CREATE TYPE ... AS ENUM` |
| `mysql:host` | `pgsql:host` |
| `` `backticks` `` | `"double quotes"` (opcional) |
| `LIMIT n` | `LIMIT n` (igual) |
| `NOW()` | `CURRENT_TIMESTAMP` o `NOW()` |
| `IFNULL()` | `COALESCE()` |

## Solución de Problemas

### Error: "could not find driver"

La extensión PDO pgsql no está instalada. Instálala según las instrucciones arriba.

### Error: "connection refused"

Verifica que PostgreSQL esté corriendo:

```bash
# macOS
brew services list

# Linux
sudo service postgresql status
```

### Error: "database "muebles" does not exist"

Crea la base de datos:

```bash
sudo -u postgres createdb muebles
```

### Error: "permission denied"

Asegúrate de que el usuario tenga permisos:

```bash
sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD '1234';"
```

## Estructura de Tablas

La base de datos incluye las siguientes tablas principales:

1. **Roles** - Tipos de usuario (admin, propietario, empleado, vendedor, cliente)
2. **Usuarios** - Credenciales y datos de usuarios
3. **Propietario** - Datos fiscales de propietarios
4. **Estados** - Catálogo de estados de México
5. **Municipios** - Municipios por estado
6. **Mueblerias** - Empresas de muebles
7. **Sucursales** - Puntos de venta
8. **Cliente** - Extensión de usuarios clientes
9. **Empleado** - Extensión de usuarios empleados
10. **Productos** - Catálogo de productos
11. **Proveedores** - Lista de proveedores
12. **Materias_Primas** - Materiales de fabricación
13. **Inventario** - Stock de productos por sucursal
14. **Inventario_MP** - Stock de materias primas
15. **Pedidos** - Órdenes de clientes
16. **Venta** - Transacciones de venta
17. **Metodo_Pago** - Métodos de pago disponibles
18. **Cupones** - Códigos de descuento
19. **Lista_Deseos** - Wishlist de clientes
20. **Carrito_Compras** - Carrito temporal

## Datos Iniciales

El esquema incluye datos de ejemplo:

- 5 roles de usuario
- 32 estados de México
- 25+ municipios principales
- 5 métodos de pago
- 3 cupones de descuento
- 1 usuario administrador
- 3 propietarios de mueblerías
- 3 mueblerías con 2 sucursales cada una

## Comandos Útiles

```bash
# Acceder a PostgreSQL
psql -U postgres -d muebles

# Ver tablas
\dt

# Ver estructura de tabla
\d nombre_tabla

# Salir
\q

# Backup de la base de datos
pg_dump -U postgres muebles > backup.sql

# Restaurar base de datos
psql -U postgres -d muebles < backup.sql
```
