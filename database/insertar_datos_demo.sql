-- Insertar 3 Mueblerías
INSERT INTO Mueblerias (nombre_negocio, descripcion, telefono, email, id_propietario, fecha_registro, activo) VALUES 
('In decor', 'Muebles elegantes y contemporáneos para hogares modernos. Diseño funcional y minimalista.', '55-1234-5678', 'contacto@indecor.com', 1, NOW(), TRUE),
('Interio', 'Muebles de interior con estilo único. Especialistas en diseño de espacios.', '55-8765-4321', 'info@interio.com', 1, NOW(), TRUE),
('Chico Muebles', 'Muebles prácticos y económicos para toda la familia. Calidad accesible.', '55-2468-1357', 'ventas@chicomuebles.com', 1, NOW(), TRUE);

-- Insertar Sucursales para cada mueblería
INSERT INTO Sucursales (id_muebleria, nombre, direccion, telefono, email, horario, activo) VALUES
(1, 'Sucursal Principal In Decor', 'Av. Reforma 123, Col. Juárez, CDMX', '55-1234-5678', 'principal@indecor.com', 'Lun-Vie: 9:00-20:00, Sab: 10:00-18:00', TRUE),
(2, 'Sucursal Principal Interio', 'Blvd. Insurgentes 456, Col. Roma, CDMX', '55-8765-4321', 'principal@interio.com', 'Lun-Vie: 10:00-19:00, Sab-Dom: 11:00-17:00', TRUE),
(3, 'Sucursal Principal Chico Muebles', 'Calle Hidalgo 789, Col. Centro, CDMX', '55-2468-1357', 'principal@chicomuebles.com', 'Lun-Dom: 9:00-21:00', TRUE);

-- Insertar 20 productos para Mueblería 1 (In Decor)
INSERT INTO Productos (nombre, descripcion, precio, id_muebleria, tipo_producto, stock, fecha_creacion, imagenes) VALUES
('Sofá Minimalista Gris', 'Sofá de 3 plazas en tela gris con diseño minimalista', 12999.00, 1, 'producto_final', 15, NOW(), '["/mueblerias/1/producto1.jpg"]'),
('Mesa de Centro Moderna', 'Mesa de centro con base de metal y vidrio templado', 4599.00, 1, 'producto_final', 20, NOW(), '["/mueblerias/1/producto2.jpg"]'),
('Silla Eames Replica', 'Silla de diseño tipo Eames en color blanco', 1899.00, 1, 'producto_final', 30, NOW(), '["/mueblerias/1/producto3.jpg"]'),
('Librero Modular', 'Librero de madera en configuración modular ajustable', 7899.00, 1, 'producto_final', 10, NOW(), '["/mueblerias/1/producto4.jpg"]'),
('Escritorio Ejecutivo', 'Escritorio con cajonera integrada y acabado en roble', 8999.00, 1, 'producto_final', 12, NOW(), '["/mueblerias/1/producto5.jpg"]'),
('Cama King Size', 'Cama king size con cabecera tapizada en lino', 15999.00, 1, 'producto_final', 8, NOW(), '["/mueblerias/1/producto6.jpg"]'),
('Buró Minimalista', 'Buró de noche con 2 cajones y acabado mate', 2899.00, 1, 'producto_final', 25, NOW(), '["/mueblerias/1/producto7.jpg"]'),
('Comedor 6 Sillas', 'Mesa de comedor con 6 sillas tapizadas en gris', 18499.00, 1, 'producto_final', 6, NOW(), '["/mueblerias/1/producto8.jpg"]'),
('Vitrina de Cristal', 'Vitrina con iluminación LED y cristales transparentes', 12499.00, 1, 'producto_final', 9, NOW(), '["/mueblerias/1/producto9.jpg"]'),
('Sillón Reclinable', 'Sillón reclinable eléctrico en cuero sintético', 11999.00, 1, 'producto_final', 11, NOW(), '["/mueblerias/1/producto10.jpg"]'),
('Repisa Flotante', 'Set de 3 repisas flotantes en madera natural', 1599.00, 1, 'producto_final', 40, NOW(), '["/mueblerias/1/producto1.jpg"]'),
('Mueble TV Moderno', 'Mueble para TV hasta 65 pulgadas con compartimentos', 6799.00, 1, 'producto_final', 14, NOW(), '["/mueblerias/1/producto2.jpg"]'),
('Espejo Decorativo', 'Espejo de pared con marco dorado geométrico', 3299.00, 1, 'producto_final', 18, NOW(), '["/mueblerias/1/producto3.jpg"]'),
('Lámpara de Pie', 'Lámpara de pie con pantalla de lino y base metálica', 2499.00, 1, 'producto_final', 22, NOW(), '["/mueblerias/1/producto4.jpg"]'),
('Cómoda 6 Cajones', 'Cómoda amplia con 6 cajones y espejo incluido', 8499.00, 1, 'producto_final', 7, NOW(), '["/mueblerias/1/producto5.jpg"]'),
('Perchero de Pie', 'Perchero minimalista de madera con ganchos metálicos', 1299.00, 1, 'producto_final', 35, NOW(), '["/mueblerias/1/producto6.jpg"]'),
('Taburete Alto', 'Taburete tipo bar en madera con asiento tapizado', 1699.00, 1, 'producto_final', 28, NOW(), '["/mueblerias/1/producto7.jpg"]'),
('Mesa Lateral', 'Mesa lateral redonda con acabado en nogal', 2299.00, 1, 'producto_final', 32, NOW(), '["/mueblerias/1/producto8.jpg"]'),
('Cajonera Oficina', 'Cajonera con 4 niveles y ruedas para oficina', 3599.00, 1, 'producto_final', 19, NOW(), '["/mueblerias/1/producto9.jpg"]'),
('Divisor de Ambientes', 'Biombo divisor de bambú plegable de 3 paneles', 2899.00, 1, 'producto_final', 16, NOW(), '["/mueblerias/1/producto10.jpg"]');

-- Insertar 20 productos para Mueblería 2 (Interio)
INSERT INTO Productos (nombre, descripcion, precio, id_muebleria, tipo_producto, stock, fecha_creacion, imagenes) VALUES
('Sofá Seccional Beige', 'Sofá seccional en L color beige con chaise lounge', 24999.00, 2, 'producto_final', 5, NOW(), '["/mueblerias/2/producto1.jpg"]'),
('Mesa de Comedor Oval', 'Mesa de comedor ovalada para 8 personas', 18999.00, 2, 'producto_final', 4, NOW(), '["/mueblerias/2/producto2.jpg"]'),
('Silla de Comedor Set 4', 'Set de 4 sillas tapizadas en terciopelo azul', 8999.00, 2, 'producto_final', 8, NOW(), '["/mueblerias/2/producto3.jpg"]'),
('Recámara Completa', 'Juego de recámara con cabecera, 2 burós y cómoda', 28999.00, 2, 'producto_final', 3, NOW(), '["/mueblerias/2/producto4.jpg"]'),
('Mueble de Baño', 'Mueble para baño con lavabo y espejo incluido', 7999.00, 2, 'producto_final', 12, NOW(), '["/mueblerias/2/producto5.jpg"]'),
('Cama con Almacenamiento', 'Cama queen size con cajones debajo del colchón', 18999.00, 2, 'producto_final', 7, NOW(), '["/mueblerias/2/producto6.jpg"]'),
('Closet Modular', 'Sistema de closet modular con puertas corredizas', 15999.00, 2, 'producto_final', 6, NOW(), '["/mueblerias/2/producto7.jpg"]'),
('Sala de Exterior', 'Set de sala para exterior en ratán sintético', 12999.00, 2, 'producto_final', 9, NOW(), '["/mueblerias/2/producto8.jpg"]'),
('Mesa de Bar', 'Mesa alta de bar con 4 taburetes incluidos', 6999.00, 2, 'producto_final', 11, NOW(), '["/mueblerias/2/producto9.jpg"]'),
('Escritorio Standing', 'Escritorio ajustable para trabajo de pie o sentado', 11499.00, 2, 'producto_final', 8, NOW(), '["/mueblerias/2/producto10.jpg"]'),
('Sillón Orejero', 'Sillón orejero tapizado en tela color mostaza', 6999.00, 2, 'producto_final', 10, NOW(), '["/mueblerias/2/producto1.jpg"]'),
('Mesa de Noche Doble', 'Set de 2 mesas de noche con cajones secretos', 4599.00, 2, 'producto_final', 15, NOW(), '["/mueblerias/2/producto2.jpg"]'),
('Estantería Escalera', 'Estantería en forma de escalera de 5 niveles', 3499.00, 2, 'producto_final', 18, NOW(), '["/mueblerias/2/producto3.jpg"]'),
('Mesa Consola', 'Mesa consola para entrada con cajón central', 3999.00, 2, 'producto_final', 20, NOW(), '["/mueblerias/2/producto4.jpg"]'),
('Puff Redondo', 'Puff otomano redondo tapizado en tela gris', 1899.00, 2, 'producto_final', 25, NOW(), '["/mueblerias/2/producto5.jpg"]'),
('Armario Esquinero', 'Armario aprovechador de esquinas con espejo', 9999.00, 2, 'producto_final', 7, NOW(), '["/mueblerias/2/producto6.jpg"]'),
('Set Sala Compacta', 'Set de sala 2-1 para espacios pequeños', 13999.00, 2, 'producto_final', 6, NOW(), '["/mueblerias/2/producto7.jpg"]'),
('Mesa de Juegos', 'Mesa multiusos con tapa reversible y 4 sillas', 5999.00, 2, 'producto_final', 14, NOW(), '["/mueblerias/2/producto8.jpg"]'),
('Rack para Vinos', 'Rack para 24 botellas de vino en madera', 2199.00, 2, 'producto_final', 22, NOW(), '["/mueblerias/2/producto9.jpg"]'),
('Zapatera 5 Niveles', 'Zapatera con espejo y 5 niveles ajustables', 2999.00, 2, 'producto_final', 17, NOW(), '["/mueblerias/2/producto10.jpg"]');

-- Insertar 20 productos para Mueblería 3 (Chico Muebles)
INSERT INTO Productos (nombre, descripcion, precio, id_muebleria, tipo_producto, stock, fecha_creacion, imagenes) VALUES
('Sofá Económico Rojo', 'Sofá de 2 plazas en tela roja ideal para departamentos', 4999.00, 3, 'producto_final', 25, NOW(), '["/mueblerias/3/producto1.jpg"]'),
('Mesa Plegable', 'Mesa plegable multiusos para comedor o jardín', 1299.00, 3, 'producto_final', 40, NOW(), '["/mueblerias/3/producto2.jpg"]'),
('Silla Plástico Set 6', 'Set de 6 sillas de plástico apilables colores', 1499.00, 3, 'producto_final', 50, NOW(), '["/mueblerias/3/producto3.jpg"]'),
('Cama Individual', 'Cama individual con colchón ortopédico incluido', 3999.00, 3, 'producto_final', 20, NOW(), '["/mueblerias/3/producto4.jpg"]'),
('Ropero Sencillo', 'Ropero de 2 puertas con barra y cajón', 2999.00, 3, 'producto_final', 30, NOW(), '["/mueblerias/3/producto5.jpg"]'),
('Mesa de Noche Básica', 'Buró económico con 1 cajón amplio', 799.00, 3, 'producto_final', 45, NOW(), '["/mueblerias/3/producto6.jpg"]'),
('Escritorio Estudiante', 'Escritorio compacto para estudiante con repisa', 1499.00, 3, 'producto_final', 35, NOW(), '["/mueblerias/3/producto7.jpg"]'),
('Colchón Individual', 'Colchón individual de espuma de alta densidad', 1999.00, 3, 'producto_final', 28, NOW(), '["/mueblerias/3/producto8.jpg"]'),
('Banco de Madera', 'Banco rústico de madera para interior o exterior', 899.00, 3, 'producto_final', 55, NOW(), '["/mueblerias/3/producto9.jpg"]'),
('Cajonera Plástica', 'Cajonera de plástico con 5 cajones y ruedas', 699.00, 3, 'producto_final', 60, NOW(), '["/mueblerias/3/producto10.jpg"]'),
('Sofá Cama', 'Sofá convertible a cama individual para visitas', 6499.00, 3, 'producto_final', 15, NOW(), '["/mueblerias/3/producto1.jpg"]'),
('Mesa TV Sencilla', 'Mueble para TV con 2 entrepaños abiertos', 999.00, 3, 'producto_final', 42, NOW(), '["/mueblerias/3/producto2.jpg"]'),
('Set Comedor 4', 'Mesa con 4 sillas de tubo y plástico', 2499.00, 3, 'producto_final', 33, NOW(), '["/mueblerias/3/producto3.jpg"]'),
('Litera Metálica', 'Litera metálica con barandal de seguridad', 4999.00, 3, 'producto_final', 12, NOW(), '["/mueblerias/3/producto4.jpg"]'),
('Colchón Matrimonial', 'Colchón matrimonial económico semi-ortopédico', 2999.00, 3, 'producto_final', 22, NOW(), '["/mueblerias/3/producto5.jpg"]'),
('Hamaca Plegable', 'Hamaca portátil de tela resistente', 599.00, 3, 'producto_final', 48, NOW(), '["/mueblerias/3/producto6.jpg"]'),
('Perchero Tubo', 'Perchero de tubo cromado con zapatera base', 499.00, 3, 'producto_final', 38, NOW(), '["/mueblerias/3/producto7.jpg"]'),
('Base de Cama', 'Base de cama matrimonial de madera sencilla', 1799.00, 3, 'producto_final', 27, NOW(), '["/mueblerias/3/producto8.jpg"]'),
('Cajas Organizadoras', 'Set de 5 cajas organizadoras apilables', 399.00, 3, 'producto_final', 65, NOW(), '["/mueblerias/3/producto9.jpg"]'),
('Cortina Separador', 'Cortina para separar ambientes con riel', 799.00, 3, 'producto_final', 44, NOW(), '["/mueblerias/3/producto10.jpg"]');
