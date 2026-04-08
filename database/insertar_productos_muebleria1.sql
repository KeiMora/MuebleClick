-- Insertar productos para la Mueblería 1 (Muebles Modernos SA de CV)
INSERT INTO Productos (sku, id_muebleria, nombre, descripcion, categoria, unidad_medida, imagen_url, precio_venta, peso_kg, volumen_m3, tipo_producto, color, material, medidas) VALUES
('MM-SOF-001', 1, 'Sofá Moderno de 3 Plazas', 'Sofá elegante con diseño contemporáneo, tapizado en tela premium y estructura de madera maciza', 'Sofás', 'pieza', '/mueblerias/1/producto1.jpg', 8999.00, 45.50, 1.20, 'producto_final', 'Gris', 'Madera maciza y tela', '2.10m x 0.85m x 0.80m'),

('MM-SIL-002', 1, 'Silla de Comedor Moderna', 'Silla ergonómica con respaldo alto, perfecta para comedor u oficina', 'Sillas', 'pieza', '/mueblerias/1/producto2.jpg', 1299.00, 8.20, 0.15, 'producto_final', 'Negro', 'Madera y tela', '0.45m x 0.50m x 0.90m'),

('MM-MES-003', 1, 'Mesa de Centro Cristal', 'Mesa elegante con superficie de cristal templado y base de acero inoxidable', 'Mesas', 'pieza', '/mueblerias/1/producto3.jpg', 3499.00, 28.00, 0.35, 'producto_final', 'Transparente', 'Cristal templado y acero', '1.20m x 0.60m x 0.45m');

-- Insertar inventario para estos productos en la sucursal principal
INSERT INTO Inventario (id_producto, id_sucursal, stock_actual, stock_minimo, stock_maximo, precio_venta_unitario, activo) VALUES
(1, 1, 15, 5, 30, 8999.00, TRUE),
(2, 1, 25, 10, 50, 1299.00, TRUE),
(3, 1, 8, 3, 20, 3499.00, TRUE);

-- Actualizar el último ID de producto
ALTER TABLE Productos AUTO_INCREMENT = 4;
