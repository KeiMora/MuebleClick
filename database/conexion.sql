-- ========================================
-- ARCHIVO DE PRUEBA DE CONEXIÓN A BASE DE DATOS
-- ========================================
-- Este archivo SQL se usa para verificar que la conexión
-- a la base de datos 'muebleclick' funciona correctamente

-- 1. Verificar que estamos en la base de datos correcta
SELECT DATABASE() AS base_de_datos_actual;

-- 2. Mostrar todas las tablas creadas
SHOW TABLES;

-- 3. Verificar estructura de tablas principales
DESCRIBE Mueblerias;
DESCRIBE Productos;
DESCRIBE Usuarios;
DESCRIBE Sucursales;

-- 4. Contar registros en cada tabla principal
SELECT 
    'Mueblerias' AS tabla, 
    COUNT(*) AS total_registros
FROM Mueblerias
UNION ALL
SELECT 
    'Productos' AS tabla, 
    COUNT(*) AS total_registros
FROM Productos
UNION ALL
SELECT 
    'Usuarios' AS tabla, 
    COUNT(*) AS total_registros
FROM Usuarios
UNION ALL
SELECT 
    'Sucursales' AS tabla, 
    COUNT(*) AS total_registros
FROM Sucursales;

-- 5. Verificar datos de mueblerías
SELECT 
    id_muebleria,
    nombre_negocio,
    razon_social,
    telefono,
    direccion_principal
FROM Mueblerias
ORDER BY id_muebleria;

-- 6. Verificar productos de la primera mueblería
SELECT 
    p.id_producto,
    p.sku,
    p.nombre,
    p.categoria,
    p.precio_venta,
    p.imagen_url,
    i.stock_actual
FROM Productos p
LEFT JOIN Inventario i ON p.id_producto = i.id_producto
WHERE p.id_muebleria = 1
ORDER BY p.nombre;

-- 7. Verificar usuarios creados
SELECT 
    id_usuario,
    nombre,
    email,
    rol,
    activo
FROM Usuarios
ORDER BY id_usuario;

-- 8. Verificar sucursales
SELECT 
    s.id_sucursal,
    s.nombre_sucursal,
    s.direccion,
    m.nombre_negocio AS muebleria
FROM Sucursales s
JOIN Mueblerias m ON s.id_muebleria = m.id_muebleria
ORDER BY s.id_muebleria, s.id_sucursal;

-- 9. Prueba de JOIN complejo (mueblerías con productos e inventario)
SELECT 
    m.nombre_negocio,
    COUNT(p.id_producto) AS total_productos,
    SUM(i.stock_actual) AS stock_total,
    AVG(p.precio_venta) AS precio_promedio
FROM Mueblerias m
LEFT JOIN Productos p ON m.id_muebleria = p.id_muebleria
LEFT JOIN Inventario i ON p.id_producto = i.id_producto
GROUP BY m.id_muebleria, m.nombre_negocio
ORDER BY m.nombre_negocio;

-- 10. Verificar categorías de productos disponibles
SELECT DISTINCT 
    categoria,
    COUNT(*) AS cantidad_productos
FROM Productos
WHERE categoria IS NOT NULL AND categoria != ''
GROUP BY categoria
ORDER BY cantidad_productos DESC;

-- ========================================
-- RESUMEN DE VERIFICACIÓN
-- ========================================

-- Si todo está correcto, deberías ver:
-- 1. Base de datos: 'muebleclick'
-- 2. Tablas: Mueblerias, Productos, Usuarios, Sucursales, etc.
-- 3. Registros en Mueblerias: 3
-- 4. Registros en Usuarios: 5+
-- 5. Productos en mueblería 1: 3
-- 6. Categorías: Sofás, Sillas, Mesas

-- Para ejecutar este archivo:
-- mysql -u root -p muebleclick < database/conexion.sql

-- O desde MySQL:
-- USE muebleclick;
-- SOURCE database/conexion.sql;