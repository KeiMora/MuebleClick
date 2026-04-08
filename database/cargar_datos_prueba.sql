-- Script para cargar datos de prueba para MuebleClick
-- Ejecutar después de crear la base de datos

-- Cargar productos de la mueblería 1
SOURCE insertar_productos_muebleria1.sql;

-- Verificar que los datos se cargaron correctamente
SELECT 
    m.nombre_negocio,
    p.nombre as producto,
    p.imagen_url,
    p.precio_venta,
    i.stock_actual
FROM Mueblerias m
JOIN Productos p ON m.id_muebleria = p.id_muebleria
JOIN Inventario i ON p.id_producto = i.id_producto
WHERE m.id_muebleria = 1;
