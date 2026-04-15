-- Verificar si existe usuario 1 y crear propietario
DO $$
DECLARE
    user_id INTEGER;
    prop_id INTEGER;
BEGIN
    -- Verificar si existe usuario 1
    SELECT id_usuario INTO user_id FROM Usuarios WHERE id_usuario = 1;
    
    -- Si no existe usuario 1, crear uno
    IF user_id IS NULL THEN
        INSERT INTO Usuarios (id_usuario, nombre, correo, password, role_id, activo)
        VALUES (1, 'Propietario Admin', 'admin@muebleclick.com', 'hashedpassword', 1, TRUE)
        RETURNING id_usuario INTO user_id;
    END IF;
    
    -- Verificar si existe propietario con ID 1
    SELECT id_usuario INTO prop_id FROM Propietario WHERE id_usuario = 1;
    
    IF prop_id IS NULL THEN
        INSERT INTO Propietario (id_usuario, curp_rfc, banco, verificado) 
        VALUES (1, 'XAXX010101000000', 'Banco Default', TRUE);
    END IF;
END $$;

-- Agregar columna logo_url a Mueblerias si no existe
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.columns 
                   WHERE table_name = 'mueblerias' AND column_name = 'logo_url') THEN
        ALTER TABLE Mueblerias ADD COLUMN logo_url TEXT;
    END IF;
END $$;

-- Agregar columna descripcion a Mueblerias si no existe
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.columns 
                   WHERE table_name = 'mueblerias' AND column_name = 'descripcion') THEN
        ALTER TABLE Mueblerias ADD COLUMN descripcion TEXT;
    END IF;
END $$;

-- Agregar columna email a Mueblerias si no existe
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.columns 
                   WHERE table_name = 'mueblerias' AND column_name = 'email') THEN
        ALTER TABLE Mueblerias ADD COLUMN email VARCHAR(100);
    END IF;
END $$;

-- Agregar columna activo a Mueblerias si no existe
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.columns 
                   WHERE table_name = 'mueblerias' AND column_name = 'activo') THEN
        ALTER TABLE Mueblerias ADD COLUMN activo BOOLEAN DEFAULT TRUE;
    END IF;
END $$;

-- Limpiar datos existentes
DELETE FROM Productos WHERE id_muebleria IN (SELECT id_muebleria FROM Mueblerias WHERE nombre_negocio IN ('In decor', 'Interio', 'Chico Muebles'));
DELETE FROM Sucursales WHERE id_muebleria IN (SELECT id_muebleria FROM Mueblerias WHERE nombre_negocio IN ('In decor', 'Interio', 'Chico Muebles'));
DELETE FROM Mueblerias WHERE nombre_negocio IN ('In decor', 'Interio', 'Chico Muebles');

-- Insertar 3 Mueblerías con logos correspondientes
INSERT INTO Mueblerias (nombre_negocio, descripcion, telefono, email, id_propietario, razon_social, rfc, direccion_principal, activo, logo_url) 
VALUES 
('In decor', 'Muebles elegantes y contemporáneos para hogares modernos. Diseño funcional y minimalista.', '55-1234-5678', 'contacto@indecor.com', 1, 'In Decor SA de CV', 'IND010101ABC1', 'Av. Reforma 123, CDMX', TRUE, '/mueblerias/1/logo.jpg'),
('Interio', 'Muebles de interior con estilo único. Especialistas en diseño de espacios.', '55-8765-4321', 'info@interio.com', 1, 'Interio Muebles SA de CV', 'INT020202DEF2', 'Blvd. Insurgentes 456, CDMX', TRUE, '/mueblerias/2/logo2.jpeg'),
('Chico Muebles', 'Muebles prácticos y económicos para toda la familia. Calidad accesible.', '55-2468-1357', 'ventas@chicomuebles.com', 1, 'Chico Muebles SA de CV', 'CHM030303GHI3', 'Calle Hidalgo 789, CDMX', TRUE, '/mueblerias/3/logo3.jpeg');

-- Insertar Sucursales para cada mueblería (verificando si existe tabla Municipios)
DO $$
DECLARE
    m1_id INTEGER;
    m2_id INTEGER;
    m3_id INTEGER;
    municipio_id INTEGER;
BEGIN
    -- Obtener IDs de mueblerías
    SELECT id_muebleria INTO m1_id FROM Mueblerias WHERE nombre_negocio = 'In decor';
    SELECT id_muebleria INTO m2_id FROM Mueblerias WHERE nombre_negocio = 'Interio';
    SELECT id_muebleria INTO m3_id FROM Mueblerias WHERE nombre_negocio = 'Chico Muebles';
    
    -- Obtener primer municipio disponible o crear uno
    SELECT id_municipio INTO municipio_id FROM Municipios LIMIT 1;
    
    IF municipio_id IS NULL THEN
        INSERT INTO Municipios (nombre, id_estado) VALUES ('Cuauhtémoc', 1) RETURNING id_municipio INTO municipio_id;
    END IF;
    
    -- Insertar sucursales
    INSERT INTO Sucursales (id_muebleria, nombre_sucursal, calle_numero, id_municipio, telefono, horario, activo) VALUES
    (m1_id, 'Sucursal Principal', 'Av. Reforma 123, Col. Juárez', municipio_id, '55-1234-5678', '{"lunes_viernes": "9:00-20:00", "sabado": "10:00-18:00"}'::jsonb, TRUE),
    (m2_id, 'Sucursal Principal', 'Blvd. Insurgentes 456, Col. Roma', municipio_id, '55-8765-4321', '{"lunes_viernes": "10:00-19:00", "sabado_domingo": "11:00-17:00"}'::jsonb, TRUE),
    (m3_id, 'Sucursal Principal', 'Calle Hidalgo 789, Col. Centro', municipio_id, '55-2468-1357', '{"lunes_domingo": "9:00-21:00"}'::jsonb, TRUE);
END $$;

-- Insertar 20 productos para Mueblería 1 (In Decor)
DO $$
DECLARE
    m1_id INTEGER;
    sku_counter INTEGER := 1;
BEGIN
    SELECT id_muebleria INTO m1_id FROM Mueblerias WHERE nombre_negocio = 'In decor';
    
    -- Crear productos con SKUs únicos
    INSERT INTO Productos (sku, id_muebleria, nombre, descripcion, categoria, precio_venta, tipo_producto, imagen_url, color, material, medidas) VALUES
    ('IN' || LPAD(sku_counter::text, 3, '0'), m1_id, 'Sofá Minimalista Gris', 'Sofá de 3 plazas en tela gris con diseño minimalista', 'Sofás', 12999.00, 'producto_final', '/mueblerias/1/producto1.jpg', 'Gris', 'Tela', '200x90x85 cm');
    sku_counter := sku_counter + 1;
    
    INSERT INTO Productos (sku, id_muebleria, nombre, descripcion, categoria, precio_venta, tipo_producto, imagen_url, color, material, medidas) VALUES
    ('IN' || LPAD(sku_counter::text, 3, '0'), m1_id, 'Mesa de Centro Moderna', 'Mesa de centro con base de metal y vidrio templado', 'Mesas', 4599.00, 'producto_final', '/mueblerias/1/producto2.jpg', 'Transparente', 'Metal y Vidrio', '100x60x45 cm');
    sku_counter := sku_counter + 1;
    
    INSERT INTO Productos (sku, id_muebleria, nombre, descripcion, categoria, precio_venta, tipo_producto, imagen_url, color, material, medidas) VALUES
    ('IN' || LPAD(sku_counter::text, 3, '0'), m1_id, 'Silla Eames Réplica', 'Silla de diseño tipo Eames en color blanco', 'Sillas', 1899.00, 'producto_final', '/mueblerias/1/producto3.jpg', 'Blanco', 'Plástico y Madera', '45x45x85 cm');
    sku_counter := sku_counter + 1;
    
    INSERT INTO Productos (sku, id_muebleria, nombre, descripcion, categoria, precio_venta, tipo_producto, imagen_url, color, material, medidas) VALUES
    ('IN' || LPAD(sku_counter::text, 3, '0'), m1_id, 'Librero Modular', 'Librero de madera en configuración modular ajustable', 'Libreros', 7899.00, 'producto_final', '/mueblerias/1/producto4.jpg', 'Roble', 'Madera', '120x30x180 cm');
    sku_counter := sku_counter + 1;
    
    INSERT INTO Productos (sku, id_muebleria, nombre, descripcion, categoria, precio_venta, tipo_producto, imagen_url, color, material, medidas) VALUES
    ('IN' || LPAD(sku_counter::text, 3, '0'), m1_id, 'Escritorio Ejecutivo', 'Escritorio con cajonera integrada y acabado en roble', 'Escritorios', 8999.00, 'producto_final', '/mueblerias/1/producto5.jpg', 'Roble', 'Madera', '140x70x75 cm');
    sku_counter := sku_counter + 1;
    
    INSERT INTO Productos (sku, id_muebleria, nombre, descripcion, categoria, precio_venta, tipo_producto, imagen_url, color, material, medidas) VALUES
    ('IN' || LPAD(sku_counter::text, 3, '0'), m1_id, 'Cama King Size', 'Cama king size con cabecera tapizada en lino', 'Recámaras', 15999.00, 'producto_final', '/mueblerias/1/producto6.jpg', 'Beige', 'Lino y Madera', '200x200 cm');
    sku_counter := sku_counter + 1;
    
    INSERT INTO Productos (sku, id_muebleria, nombre, descripcion, categoria, precio_venta, tipo_producto, imagen_url, color, material, medidas) VALUES
    ('IN' || LPAD(sku_counter::text, 3, '0'), m1_id, 'Buró Minimalista', 'Buró de noche con 2 cajones y acabado mate', 'Recámaras', 2899.00, 'producto_final', '/mueblerias/1/producto7.jpg', 'Blanco', 'Madera', '50x40x55 cm');
    sku_counter := sku_counter + 1;
    
    INSERT INTO Productos (sku, id_muebleria, nombre, descripcion, categoria, precio_venta, tipo_producto, imagen_url, color, material, medidas) VALUES
    ('IN' || LPAD(sku_counter::text, 3, '0'), m1_id, 'Comedor 6 Sillas', 'Mesa de comedor con 6 sillas tapizadas en gris', 'Comedores', 18499.00, 'producto_final', '/mueblerias/1/producto8.jpg', 'Gris', 'Madera y Tela', '180x90x75 cm');
    sku_counter := sku_counter + 1;
    
    INSERT INTO Productos (sku, id_muebleria, nombre, descripcion, categoria, precio_venta, tipo_producto, imagen_url, color, material, medidas) VALUES
    ('IN' || LPAD(sku_counter::text, 3, '0'), m1_id, 'Vitrina de Cristal', 'Vitrina con iluminación LED y cristales transparentes', 'Vitrinas', 12499.00, 'producto_final', '/mueblerias/1/producto9.jpg', 'Transparente', 'Cristal y Madera', '80x40x180 cm');
    sku_counter := sku_counter + 1;
    
    INSERT INTO Productos (sku, id_muebleria, nombre, descripcion, categoria, precio_venta, tipo_producto, imagen_url, color, material, medidas) VALUES
    ('IN' || LPAD(sku_counter::text, 3, '0'), m1_id, 'Sillón Reclinable', 'Sillón reclinable eléctrico en cuero sintético', 'Sillones', 11999.00, 'producto_final', '/mueblerias/1/producto10.jpg', 'Negro', 'Cuero Sintético', '90x90x100 cm');
    sku_counter := sku_counter + 1;
    
    -- Repetir algunas imágenes para productos 11-20
    INSERT INTO Productos (sku, id_muebleria, nombre, descripcion, categoria, precio_venta, tipo_producto, imagen_url, color, material, medidas) VALUES
    ('IN' || LPAD(sku_counter::text, 3, '0'), m1_id, 'Repisa Flotante', 'Set de 3 repisas flotantes en madera natural', 'Repisas', 1599.00, 'producto_final', '/mueblerias/1/producto1.jpg', 'Natural', 'Madera', '60x20x3 cm cada una');
    sku_counter := sku_counter + 1;
    
    INSERT INTO Productos (sku, id_muebleria, nombre, descripcion, categoria, precio_venta, tipo_producto, imagen_url, color, material, medidas) VALUES
    ('IN' || LPAD(sku_counter::text, 3, '0'), m1_id, 'Mueble TV Moderno', 'Mueble para TV hasta 65 pulgadas con compartimentos', 'Entretenimiento', 6799.00, 'producto_final', '/mueblerias/1/producto2.jpg', 'Negro', 'Madera', '160x40x50 cm');
    sku_counter := sku_counter + 1;
    
    INSERT INTO Productos (sku, id_muebleria, nombre, descripcion, categoria, precio_venta, tipo_producto, imagen_url, color, material, medidas) VALUES
    ('IN' || LPAD(sku_counter::text, 3, '0'), m1_id, 'Espejo Decorativo', 'Espejo de pared con marco dorado geométrico', 'Decoración', 3299.00, 'producto_final', '/mueblerias/1/producto3.jpg', 'Dorado', 'Metal y Cristal', '80x80 cm');
    sku_counter := sku_counter + 1;
    
    INSERT INTO Productos (sku, id_muebleria, nombre, descripcion, categoria, precio_venta, tipo_producto, imagen_url, color, material, medidas) VALUES
    ('IN' || LPAD(sku_counter::text, 3, '0'), m1_id, 'Lámpara de Pie', 'Lámpara de pie con pantalla de lino y base metálica', 'Iluminación', 2499.00, 'producto_final', '/mueblerias/1/producto4.jpg', 'Beige', 'Metal y Lino', '30x160 cm');
    sku_counter := sku_counter + 1;
    
    INSERT INTO Productos (sku, id_muebleria, nombre, descripcion, categoria, precio_venta, tipo_producto, imagen_url, color, material, medidas) VALUES
    ('IN' || LPAD(sku_counter::text, 3, '0'), m1_id, 'Cómoda 6 Cajones', 'Cómoda amplia con 6 cajones y espejo incluido', 'Recámaras', 8499.00, 'producto_final', '/mueblerias/1/producto5.jpg', 'Blanco', 'Madera', '120x50x80 cm');
    sku_counter := sku_counter + 1;
    
    INSERT INTO Productos (sku, id_muebleria, nombre, descripcion, categoria, precio_venta, tipo_producto, imagen_url, color, material, medidas) VALUES
    ('IN' || LPAD(sku_counter::text, 3, '0'), m1_id, 'Perchero de Pie', 'Perchero minimalista de madera con ganchos metálicos', 'Accesorios', 1299.00, 'producto_final', '/mueblerias/1/producto6.jpg', 'Natural', 'Madera y Metal', '40x40x170 cm');
    sku_counter := sku_counter + 1;
    
    INSERT INTO Productos (sku, id_muebleria, nombre, descripcion, categoria, precio_venta, tipo_producto, imagen_url, color, material, medidas) VALUES
    ('IN' || LPAD(sku_counter::text, 3, '0'), m1_id, 'Taburete Alto', 'Taburete tipo bar en madera con asiento tapizado', 'Sillas', 1699.00, 'producto_final', '/mueblerias/1/producto7.jpg', 'Marrón', 'Madera y Tela', '35x35x75 cm');
    sku_counter := sku_counter + 1;
    
    INSERT INTO Productos (sku, id_muebleria, nombre, descripcion, categoria, precio_venta, tipo_producto, imagen_url, color, material, medidas) VALUES
    ('IN' || LPAD(sku_counter::text, 3, '0'), m1_id, 'Mesa Lateral', 'Mesa lateral redonda con acabado en nogal', 'Mesas', 2299.00, 'producto_final', '/mueblerias/1/producto8.jpg', 'Nogal', 'Madera', '50x50x60 cm');
    sku_counter := sku_counter + 1;
    
    INSERT INTO Productos (sku, id_muebleria, nombre, descripcion, categoria, precio_venta, tipo_producto, imagen_url, color, material, medidas) VALUES
    ('IN' || LPAD(sku_counter::text, 3, '0'), m1_id, 'Cajonera Oficina', 'Cajonera con 4 niveles y ruedas para oficina', 'Oficina', 3599.00, 'producto_final', '/mueblerias/1/producto9.jpg', 'Gris', 'Metal', '40x50x70 cm');
    sku_counter := sku_counter + 1;
    
    INSERT INTO Productos (sku, id_muebleria, nombre, descripcion, categoria, precio_venta, tipo_producto, imagen_url, color, material, medidas) VALUES
    ('IN' || LPAD(sku_counter::text, 3, '0'), m1_id, 'Divisor de Ambientes', 'Biombo divisor de bambú plegable de 3 paneles', 'Decoración', 2899.00, 'producto_final', '/mueblerias/1/producto10.jpg', 'Natural', 'Bambú', '180x3x150 cm');
END $$;

-- Insertar 20 productos para Mueblería 2 (Interio)
DO $$
DECLARE
    m2_id INTEGER;
    sku_counter INTEGER := 21;
BEGIN
    SELECT id_muebleria INTO m2_id FROM Mueblerias WHERE nombre_negocio = 'Interio';
    
    INSERT INTO Productos (sku, id_muebleria, nombre, descripcion, categoria, precio_venta, tipo_producto, imagen_url, color, material, medidas) VALUES
    ('IN' || LPAD(sku_counter::text, 3, '0'), m2_id, 'Sofá Seccional Beige', 'Sofá seccional en L color beige con chaise lounge', 'Sofás', 24999.00, 'producto_final', '/mueblerias/2/producto1.jpg', 'Beige', 'Tela', '300x180x85 cm');
    sku_counter := sku_counter + 1;
    
    INSERT INTO Productos (sku, id_muebleria, nombre, descripcion, categoria, precio_venta, tipo_producto, imagen_url, color, material, medidas) VALUES
    ('IN' || LPAD(sku_counter::text, 3, '0'), m2_id, 'Mesa de Comedor Oval', 'Mesa de comedor ovalada para 8 personas', 'Comedores', 18999.00, 'producto_final', '/mueblerias/2/producto2.jpg', 'Blanco', 'Madera', '200x100x75 cm');
    sku_counter := sku_counter + 1;
    
    INSERT INTO Productos (sku, id_muebleria, nombre, descripcion, categoria, precio_venta, tipo_producto, imagen_url, color, material, medidas) VALUES
    ('IN' || LPAD(sku_counter::text, 3, '0'), m2_id, 'Silla de Comedor Set 4', 'Set de 4 sillas tapizadas en terciopelo azul', 'Sillas', 8999.00, 'producto_final', '/mueblerias/2/producto3.jpg', 'Azul', 'Terciopelo', '45x45x90 cm');
    sku_counter := sku_counter + 1;
    
    INSERT INTO Productos (sku, id_muebleria, nombre, descripcion, categoria, precio_venta, tipo_producto, imagen_url, color, material, medidas) VALUES
    ('IN' || LPAD(sku_counter::text, 3, '0'), m2_id, 'Recámara Completa', 'Juego de recámara con cabecera, 2 burós y cómoda', 'Recámaras', 28999.00, 'producto_final', '/mueblerias/2/producto4.jpg', 'Gris', 'Madera', 'King Size');
    sku_counter := sku_counter + 1;
    
    INSERT INTO Productos (sku, id_muebleria, nombre, descripcion, categoria, precio_venta, tipo_producto, imagen_url, color, material, medidas) VALUES
    ('IN' || LPAD(sku_counter::text, 3, '0'), m2_id, 'Mueble de Baño', 'Mueble para baño con lavabo y espejo incluido', 'Baño', 7999.00, 'producto_final', '/mueblerias/2/producto5.jpg', 'Blanco', 'Madera', '80x45x180 cm');
    sku_counter := sku_counter + 1;
    
    INSERT INTO Productos (sku, id_muebleria, nombre, descripcion, categoria, precio_venta, tipo_producto, imagen_url, color, material, medidas) VALUES
    ('IN' || LPAD(sku_counter::text, 3, '0'), m2_id, 'Cama con Almacenamiento', 'Cama queen size con cajones debajo del colchón', 'Recámaras', 18999.00, 'producto_final', '/mueblerias/2/producto6.jpg', 'Gris', 'Madera', '160x200 cm');
    sku_counter := sku_counter + 1;
    
    INSERT INTO Productos (sku, id_muebleria, nombre, descripcion, categoria, precio_venta, tipo_producto, imagen_url, color, material, medidas) VALUES
    ('IN' || LPAD(sku_counter::text, 3, '0'), m2_id, 'Closet Modular', 'Sistema de closet modular con puertas corredizas', 'Closets', 15999.00, 'producto_final', '/mueblerias/2/producto7.jpg', 'Blanco', 'Madera', '240x60x220 cm');
    sku_counter := sku_counter + 1;
    
    INSERT INTO Productos (sku, id_muebleria, nombre, descripcion, categoria, precio_venta, tipo_producto, imagen_url, color, material, medidas) VALUES
    ('IN' || LPAD(sku_counter::text, 3, '0'), m2_id, 'Sala de Exterior', 'Set de sala para exterior en ratán sintético', 'Exterior', 12999.00, 'producto_final', '/mueblerias/2/producto8.jpg', 'Gris', 'Ratán Sintético', '4 piezas');
    sku_counter := sku_counter + 1;
    
    INSERT INTO Productos (sku, id_muebleria, nombre, descripcion, categoria, precio_venta, tipo_producto, imagen_url, color, material, medidas) VALUES
    ('IN' || LPAD(sku_counter::text, 3, '0'), m2_id, 'Mesa de Bar', 'Mesa alta de bar con 4 taburetes incluidos', 'Comedores', 6999.00, 'producto_final', '/mueblerias/2/producto9.jpg', 'Negro', 'Madera', '120x60x105 cm');
    sku_counter := sku_counter + 1;
    
    INSERT INTO Productos (sku, id_muebleria, nombre, descripcion, categoria, precio_venta, tipo_producto, imagen_url, color, material, medidas) VALUES
    ('IN' || LPAD(sku_counter::text, 3, '0'), m2_id, 'Escritorio Standing', 'Escritorio ajustable para trabajo de pie o sentado', 'Oficina', 11499.00, 'producto_final', '/mueblerias/2/producto10.jpg', 'Negro', 'Metal', '120x60x75-120 cm');
    sku_counter := sku_counter + 1;
    
    INSERT INTO Productos (sku, id_muebleria, nombre, descripcion, categoria, precio_venta, tipo_producto, imagen_url, color, material, medidas) VALUES
    ('IN' || LPAD(sku_counter::text, 3, '0'), m2_id, 'Sillón Orejero', 'Sillón orejero tapizado en tela color mostaza', 'Sillones', 6999.00, 'producto_final', '/mueblerias/2/producto1.jpg', 'Mostaza', 'Tela', '80x80x100 cm');
    sku_counter := sku_counter + 1;
    
    INSERT INTO Productos (sku, id_muebleria, nombre, descripcion, categoria, precio_venta, tipo_producto, imagen_url, color, material, medidas) VALUES
    ('IN' || LPAD(sku_counter::text, 3, '0'), m2_id, 'Mesa de Noche Doble', 'Set de 2 mesas de noche con cajones secretos', 'Recámaras', 4599.00, 'producto_final', '/mueblerias/2/producto2.jpg', 'Blanco', 'Madera', '45x40x55 cm');
    sku_counter := sku_counter + 1;
    
    INSERT INTO Productos (sku, id_muebleria, nombre, descripcion, categoria, precio_venta, tipo_producto, imagen_url, color, material, medidas) VALUES
    ('IN' || LPAD(sku_counter::text, 3, '0'), m2_id, 'Estantería Escalera', 'Estantería en forma de escalera de 5 niveles', 'Libreros', 3499.00, 'producto_final', '/mueblerias/2/producto3.jpg', 'Café', 'Madera', '60x40x180 cm');
    sku_counter := sku_counter + 1;
    
    INSERT INTO Productos (sku, id_muebleria, nombre, descripcion, categoria, precio_venta, tipo_producto, imagen_url, color, material, medidas) VALUES
    ('IN' || LPAD(sku_counter::text, 3, '0'), m2_id, 'Mesa Consola', 'Mesa consola para entrada con cajón central', 'Mesas', 3999.00, 'producto_final', '/mueblerias/2/producto4.jpg', 'Roble', 'Madera', '100x30x75 cm');
    sku_counter := sku_counter + 1;
    
    INSERT INTO Productos (sku, id_muebleria, nombre, descripcion, categoria, precio_venta, tipo_producto, imagen_url, color, material, medidas) VALUES
    ('IN' || LPAD(sku_counter::text, 3, '0'), m2_id, 'Puff Redondo', 'Puff otomano redondo tapizado en tela gris', 'Sillones', 1899.00, 'producto_final', '/mueblerias/2/producto5.jpg', 'Gris', 'Tela', '50x35 cm');
    sku_counter := sku_counter + 1;
    
    INSERT INTO Productos (sku, id_muebleria, nombre, descripcion, categoria, precio_venta, tipo_producto, imagen_url, color, material, medidas) VALUES
    ('IN' || LPAD(sku_counter::text, 3, '0'), m2_id, 'Armario Esquinero', 'Armario aprovechador de esquinas con espejo', 'Closets', 9999.00, 'producto_final', '/mueblerias/2/producto6.jpg', 'Blanco', 'Madera', '90x90x200 cm');
    sku_counter := sku_counter + 1;
    
    INSERT INTO Productos (sku, id_muebleria, nombre, descripcion, categoria, precio_venta, tipo_producto, imagen_url, color, material, medidas) VALUES
    ('IN' || LPAD(sku_counter::text, 3, '0'), m2_id, 'Set Sala Compacta', 'Set de sala 2-1 para espacios pequeños', 'Salas', 13999.00, 'producto_final', '/mueblerias/2/producto7.jpg', 'Gris', 'Tela', '3 piezas');
    sku_counter := sku_counter + 1;
    
    INSERT INTO Productos (sku, id_muebleria, nombre, descripcion, categoria, precio_venta, tipo_producto, imagen_url, color, material, medidas) VALUES
    ('IN' || LPAD(sku_counter::text, 3, '0'), m2_id, 'Mesa de Juegos', 'Mesa multiusos con tapa reversible y 4 sillas', 'Entretenimiento', 5999.00, 'producto_final', '/mueblerias/2/producto8.jpg', 'Madera', 'Madera', '100x100x75 cm');
    sku_counter := sku_counter + 1;
    
    INSERT INTO Productos (sku, id_muebleria, nombre, descripcion, categoria, precio_venta, tipo_producto, imagen_url, color, material, medidas) VALUES
    ('IN' || LPAD(sku_counter::text, 3, '0'), m2_id, 'Rack para Vinos', 'Rack para 24 botellas de vino en madera', 'Accesorios', 2199.00, 'producto_final', '/mueblerias/2/producto9.jpg', 'Café', 'Madera', '60x25x80 cm');
    sku_counter := sku_counter + 1;
    
    INSERT INTO Productos (sku, id_muebleria, nombre, descripcion, categoria, precio_venta, tipo_producto, imagen_url, color, material, medidas) VALUES
    ('IN' || LPAD(sku_counter::text, 3, '0'), m2_id, 'Zapatera 5 Niveles', 'Zapatera con espejo y 5 niveles ajustables', 'Accesorios', 2999.00, 'producto_final', '/mueblerias/2/producto10.jpg', 'Blanco', 'Metal y Plástico', '60x30x100 cm');
END $$;

-- Insertar 20 productos para Mueblería 3 (Chico Muebles)
DO $$
DECLARE
    m3_id INTEGER;
    sku_counter INTEGER := 41;
BEGIN
    SELECT id_muebleria INTO m3_id FROM Mueblerias WHERE nombre_negocio = 'Chico Muebles';
    
    INSERT INTO Productos (sku, id_muebleria, nombre, descripcion, categoria, precio_venta, tipo_producto, imagen_url, color, material, medidas) VALUES
    ('CM' || LPAD(sku_counter::text, 3, '0'), m3_id, 'Sofá Económico Rojo', 'Sofá de 2 plazas en tela roja ideal para departamentos', 'Sofás', 4999.00, 'producto_final', '/mueblerias/3/producto1.jpg', 'Rojo', 'Tela', '180x90x85 cm');
    sku_counter := sku_counter + 1;
    
    INSERT INTO Productos (sku, id_muebleria, nombre, descripcion, categoria, precio_venta, tipo_producto, imagen_url, color, material, medidas) VALUES
    ('CM' || LPAD(sku_counter::text, 3, '0'), m3_id, 'Mesa Plegable', 'Mesa plegable multiusos para comedor o jardín', 'Mesas', 1299.00, 'producto_final', '/mueblerias/3/producto2.jpg', 'Blanco', 'Plástico', '120x60x75 cm');
    sku_counter := sku_counter + 1;
    
    INSERT INTO Productos (sku, id_muebleria, nombre, descripcion, categoria, precio_venta, tipo_producto, imagen_url, color, material, medidas) VALUES
    ('CM' || LPAD(sku_counter::text, 3, '0'), m3_id, 'Silla Plástico Set 6', 'Set de 6 sillas de plástico apilables colores', 'Sillas', 1499.00, 'producto_final', '/mueblerias/3/producto3.jpg', 'Multicolor', 'Plástico', '40x40x85 cm');
    sku_counter := sku_counter + 1;
    
    INSERT INTO Productos (sku, id_muebleria, nombre, descripcion, categoria, precio_venta, tipo_producto, imagen_url, color, material, medidas) VALUES
    ('CM' || LPAD(sku_counter::text, 3, '0'), m3_id, 'Cama Individual', 'Cama individual con colchón ortopédico incluido', 'Recámaras', 3999.00, 'producto_final', '/mueblerias/3/producto4.jpg', 'Blanco', 'Metal', '100x200 cm');
    sku_counter := sku_counter + 1;
    
    INSERT INTO Productos (sku, id_muebleria, nombre, descripcion, categoria, precio_venta, tipo_producto, imagen_url, color, material, medidas) VALUES
    ('CM' || LPAD(sku_counter::text, 3, '0'), m3_id, 'Ropero Sencillo', 'Ropero de 2 puertas con barra y cajón', 'Closets', 2999.00, 'producto_final', '/mueblerias/3/producto5.jpg', 'Café', 'Madera', '80x50x180 cm');
    sku_counter := sku_counter + 1;
    
    INSERT INTO Productos (sku, id_muebleria, nombre, descripcion, categoria, precio_venta, tipo_producto, imagen_url, color, material, medidas) VALUES
    ('CM' || LPAD(sku_counter::text, 3, '0'), m3_id, 'Mesa de Noche Básica', 'Buró económico con 1 cajón amplio', 'Recámaras', 799.00, 'producto_final', '/mueblerias/3/producto6.jpg', 'Blanco', 'Madera', '40x35x50 cm');
    sku_counter := sku_counter + 1;
    
    INSERT INTO Productos (sku, id_muebleria, nombre, descripcion, categoria, precio_venta, tipo_producto, imagen_url, color, material, medidas) VALUES
    ('CM' || LPAD(sku_counter::text, 3, '0'), m3_id, 'Escritorio Estudiante', 'Escritorio compacto para estudiante con repisa', 'Escritorios', 1499.00, 'producto_final', '/mueblerias/3/producto7.jpg', 'Blanco', 'Madera', '100x50x75 cm');
    sku_counter := sku_counter + 1;
    
    INSERT INTO Productos (sku, id_muebleria, nombre, descripcion, categoria, precio_venta, tipo_producto, imagen_url, color, material, medidas) VALUES
    ('CM' || LPAD(sku_counter::text, 3, '0'), m3_id, 'Colchón Individual', 'Colchón individual de espuma de alta densidad', 'Colchones', 1999.00, 'producto_final', '/mueblerias/3/producto8.jpg', 'Blanco', 'Espuma', '100x200x20 cm');
    sku_counter := sku_counter + 1;
    
    INSERT INTO Productos (sku, id_muebleria, nombre, descripcion, categoria, precio_venta, tipo_producto, imagen_url, color, material, medidas) VALUES
    ('CM' || LPAD(sku_counter::text, 3, '0'), m3_id, 'Banco de Madera', 'Banco rústico de madera para interior o exterior', 'Bancos', 899.00, 'producto_final', '/mueblerias/3/producto9.jpg', 'Natural', 'Madera', '100x30x45 cm');
    sku_counter := sku_counter + 1;
    
    INSERT INTO Productos (sku, id_muebleria, nombre, descripcion, categoria, precio_venta, tipo_producto, imagen_url, color, material, medidas) VALUES
    ('CM' || LPAD(sku_counter::text, 3, '0'), m3_id, 'Cajonera Plástica', 'Cajonera de plástico con 5 cajones y ruedas', 'Accesorios', 699.00, 'producto_final', '/mueblerias/3/producto10.jpg', 'Transparente', 'Plástico', '40x40x100 cm');
    sku_counter := sku_counter + 1;
    
    INSERT INTO Productos (sku, id_muebleria, nombre, descripcion, categoria, precio_venta, tipo_producto, imagen_url, color, material, medidas) VALUES
    ('CM' || LPAD(sku_counter::text, 3, '0'), m3_id, 'Sofá Cama', 'Sofá convertible a cama individual para visitas', 'Sofás', 6499.00, 'producto_final', '/mueblerias/3/producto1.jpg', 'Azul', 'Tela', '190x90x85 cm');
    sku_counter := sku_counter + 1;
    
    INSERT INTO Productos (sku, id_muebleria, nombre, descripcion, categoria, precio_venta, tipo_producto, imagen_url, color, material, medidas) VALUES
    ('CM' || LPAD(sku_counter::text, 3, '0'), m3_id, 'Mesa TV Sencilla', 'Mueble para TV con 2 entrepaños abiertos', 'Entretenimiento', 999.00, 'producto_final', '/mueblerias/3/producto2.jpg', 'Negro', 'Madera', '80x40x50 cm');
    sku_counter := sku_counter + 1;
    
    INSERT INTO Productos (sku, id_muebleria, nombre, descripcion, categoria, precio_venta, tipo_producto, imagen_url, color, material, medidas) VALUES
    ('CM' || LPAD(sku_counter::text, 3, '0'), m3_id, 'Set Comedor 4', 'Mesa con 4 sillas de tubo y plástico', 'Comedores', 2499.00, 'producto_final', '/mueblerias/3/producto3.jpg', 'Blanco', 'Metal y Plástico', '120x75 cm + 4 sillas');
    sku_counter := sku_counter + 1;
    
    INSERT INTO Productos (sku, id_muebleria, nombre, descripcion, categoria, precio_venta, tipo_producto, imagen_url, color, material, medidas) VALUES
    ('CM' || LPAD(sku_counter::text, 3, '0'), m3_id, 'Litera Metálica', 'Litera metálica con barandal de seguridad', 'Recámaras', 4999.00, 'producto_final', '/mueblerias/3/producto4.jpg', 'Blanco', 'Metal', '100x200 cm (2 niveles)');
    sku_counter := sku_counter + 1;
    
    INSERT INTO Productos (sku, id_muebleria, nombre, descripcion, categoria, precio_venta, tipo_producto, imagen_url, color, material, medidas) VALUES
    ('CM' || LPAD(sku_counter::text, 3, '0'), m3_id, 'Colchón Matrimonial', 'Colchón matrimonial económico semi-ortopédico', 'Colchones', 2999.00, 'producto_final', '/mueblerias/3/producto5.jpg', 'Blanco', 'Espuma', '140x190x18 cm');
    sku_counter := sku_counter + 1;
    
    INSERT INTO Productos (sku, id_muebleria, nombre, descripcion, categoria, precio_venta, tipo_producto, imagen_url, color, material, medidas) VALUES
    ('CM' || LPAD(sku_counter::text, 3, '0'), m3_id, 'Hamaca Plegable', 'Hamaca portátil de tela resistente', 'Exterior', 599.00, 'producto_final', '/mueblerias/3/producto6.jpg', 'Multicolor', 'Tela', '200x80 cm');
    sku_counter := sku_counter + 1;
    
    INSERT INTO Productos (sku, id_muebleria, nombre, descripcion, categoria, precio_venta, tipo_producto, imagen_url, color, material, medidas) VALUES
    ('CM' || LPAD(sku_counter::text, 3, '0'), m3_id, 'Perchero Tubo', 'Perchero de tubo cromado con zapatera base', 'Accesorios', 499.00, 'producto_final', '/mueblerias/3/producto7.jpg', 'Cromado', 'Metal', '80x40x170 cm');
    sku_counter := sku_counter + 1;
    
    INSERT INTO Productos (sku, id_muebleria, nombre, descripcion, categoria, precio_venta, tipo_producto, imagen_url, color, material, medidas) VALUES
    ('CM' || LPAD(sku_counter::text, 3, '0'), m3_id, 'Base de Cama', 'Base de cama matrimonial de madera sencilla', 'Recámaras', 1799.00, 'producto_final', '/mueblerias/3/producto8.jpg', 'Café', 'Madera', '140x190 cm');
    sku_counter := sku_counter + 1;
    
    INSERT INTO Productos (sku, id_muebleria, nombre, descripcion, categoria, precio_venta, tipo_producto, imagen_url, color, material, medidas) VALUES
    ('CM' || LPAD(sku_counter::text, 3, '0'), m3_id, 'Cajas Organizadoras', 'Set de 5 cajas organizadoras apilables', 'Accesorios', 399.00, 'producto_final', '/mueblerias/3/producto9.jpg', 'Transparente', 'Plástico', '40x30x20 cm c/u');
    sku_counter := sku_counter + 1;
    
    INSERT INTO Productos (sku, id_muebleria, nombre, descripcion, categoria, precio_venta, tipo_producto, imagen_url, color, material, medidas) VALUES
    ('CM' || LPAD(sku_counter::text, 3, '0'), m3_id, 'Cortina Separador', 'Cortina para separar ambientes con riel', 'Decoración', 799.00, 'producto_final', '/mueblerias/3/producto10.jpg', 'Beige', 'Tela', '200x250 cm');
END $$;
