const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: 'postgres',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '1234',
});

async function insertarDatos() {
    const client = await pool.connect();
    try {
        console.log('🚀 Insertando datos de demostración...\n');

        // Limpiar datos existentes (opcional)
        await client.query('DELETE FROM Productos WHERE id_muebleria IN (1,2,3)');
        await client.query('DELETE FROM Sucursales WHERE id_muebleria IN (1,2,3)');
        await client.query('DELETE FROM Mueblerias WHERE id_muebleria IN (1,2,3)');
        console.log('✅ Limpieza completada');

        // Resetear secuencias
        await client.query('ALTER SEQUENCE mueblerias_id_muebleria_seq RESTART WITH 1');
        await client.query('ALTER SEQUENCE productos_id_producto_seq RESTART WITH 1');
        await client.query('ALTER SEQUENCE sucursales_id_sucursal_seq RESTART WITH 1');
        console.log('✅ Secuencias reiniciadas');

        // Insertar Mueblerías
        const muebleriasQuery = `
            INSERT INTO Mueblerias (nombre_negocio, descripcion, telefono, email, id_propietario, fecha_registro, activo, imagenes) 
            VALUES 
            ('In decor', 'Muebles elegantes y contemporáneos para hogares modernos. Diseño funcional y minimalista.', '55-1234-5678', 'contacto@indecor.com', 1, NOW(), TRUE, '["/mueblerias/1/logo.jpg"]'),
            ('Interio', 'Muebles de interior con estilo único. Especialistas en diseño de espacios.', '55-8765-4321', 'info@interio.com', 1, NOW(), TRUE, '["/mueblerias/2/logo2.jpeg"]'),
            ('Chico Muebles', 'Muebles prácticos y económicos para toda la familia. Calidad accesible.', '55-2468-1357', 'ventas@chicomuebles.com', 1, NOW(), TRUE, '["/mueblerias/3/logo3.jpeg"]')
            RETURNING id_muebleria
        `;
        const muebleriasResult = await client.query(muebleriasQuery);
        console.log(`✅ 3 Mueblerías insertadas: ${muebleriasResult.rows.map(r => r.id_muebleria).join(', ')}`);

        // Insertar Sucursales
        const sucursalesQuery = `
            INSERT INTO Sucursales (id_muebleria, nombre, direccion, telefono, email, horario, activo) 
            VALUES
            (1, 'Sucursal Principal In Decor', 'Av. Reforma 123, Col. Juárez, CDMX', '55-1234-5678', 'principal@indecor.com', 'Lun-Vie: 9:00-20:00, Sab: 10:00-18:00', TRUE),
            (2, 'Sucursal Principal Interio', 'Blvd. Insurgentes 456, Col. Roma, CDMX', '55-8765-4321', 'principal@interio.com', 'Lun-Vie: 10:00-19:00, Sab-Dom: 11:00-17:00', TRUE),
            (3, 'Sucursal Principal Chico Muebles', 'Calle Hidalgo 789, Col. Centro, CDMX', '55-2468-1357', 'principal@chicomuebles.com', 'Lun-Dom: 9:00-21:00', TRUE)
        `;
        await client.query(sucursalesQuery);
        console.log('✅ 3 Sucursales insertadas');

        // Productos para Mueblería 1 (In Decor) - 20 productos
        const productos1 = [
            ['Sofá Minimalista Gris', 'Sofá de 3 plazas en tela gris con diseño minimalista', 12999.00, 1, 'producto_final', 15, '["/mueblerias/1/producto1.jpg"]'],
            ['Mesa de Centro Moderna', 'Mesa de centro con base de metal y vidrio templado', 4599.00, 1, 'producto_final', 20, '["/mueblerias/1/producto2.jpg"]'],
            ['Silla Eames Replica', 'Silla de diseño tipo Eames en color blanco', 1899.00, 1, 'producto_final', 30, '["/mueblerias/1/producto3.jpg"]'],
            ['Librero Modular', 'Librero de madera en configuración modular ajustable', 7899.00, 1, 'producto_final', 10, '["/mueblerias/1/producto4.jpg"]'],
            ['Escritorio Ejecutivo', 'Escritorio con cajonera integrada y acabado en roble', 8999.00, 1, 'producto_final', 12, '["/mueblerias/1/producto5.jpg"]'],
            ['Cama King Size', 'Cama king size con cabecera tapizada en lino', 15999.00, 1, 'producto_final', 8, '["/mueblerias/1/producto6.jpg"]'],
            ['Buró Minimalista', 'Buró de noche con 2 cajones y acabado mate', 2899.00, 1, 'producto_final', 25, '["/mueblerias/1/producto7.jpg"]'],
            ['Comedor 6 Sillas', 'Mesa de comedor con 6 sillas tapizadas en gris', 18499.00, 1, 'producto_final', 6, '["/mueblerias/1/producto8.jpg"]'],
            ['Vitrina de Cristal', 'Vitrina con iluminación LED y cristales transparentes', 12499.00, 1, 'producto_final', 9, '["/mueblerias/1/producto9.jpg"]'],
            ['Sillón Reclinable', 'Sillón reclinable eléctrico en cuero sintético', 11999.00, 1, 'producto_final', 11, '["/mueblerias/1/producto10.jpg"]'],
            ['Repisa Flotante', 'Set de 3 repisas flotantes en madera natural', 1599.00, 1, 'producto_final', 40, '["/mueblerias/1/producto1.jpg"]'],
            ['Mueble TV Moderno', 'Mueble para TV hasta 65 pulgadas con compartimentos', 6799.00, 1, 'producto_final', 14, '["/mueblerias/1/producto2.jpg"]'],
            ['Espejo Decorativo', 'Espejo de pared con marco dorado geométrico', 3299.00, 1, 'producto_final', 18, '["/mueblerias/1/producto3.jpg"]'],
            ['Lámpara de Pie', 'Lámpara de pie con pantalla de lino y base metálica', 2499.00, 1, 'producto_final', 22, '["/mueblerias/1/producto4.jpg"]'],
            ['Cómoda 6 Cajones', 'Cómoda amplia con 6 cajones y espejo incluido', 8499.00, 1, 'producto_final', 7, '["/mueblerias/1/producto5.jpg"]'],
            ['Perchero de Pie', 'Perchero minimalista de madera con ganchos metálicos', 1299.00, 1, 'producto_final', 35, '["/mueblerias/1/producto6.jpg"]'],
            ['Taburete Alto', 'Taburete tipo bar en madera con asiento tapizado', 1699.00, 1, 'producto_final', 28, '["/mueblerias/1/producto7.jpg"]'],
            ['Mesa Lateral', 'Mesa lateral redonda con acabado en nogal', 2299.00, 1, 'producto_final', 32, '["/mueblerias/1/producto8.jpg"]'],
            ['Cajonera Oficina', 'Cajonera con 4 niveles y ruedas para oficina', 3599.00, 1, 'producto_final', 19, '["/mueblerias/1/producto9.jpg"]'],
            ['Divisor de Ambientes', 'Biombo divisor de bambú plegable de 3 paneles', 2899.00, 1, 'producto_final', 16, '["/mueblerias/1/producto10.jpg"]']
        ];

        for (const p of productos1) {
            await client.query(
                'INSERT INTO Productos (nombre, descripcion, precio, id_muebleria, tipo_producto, stock, fecha_creacion, imagenes) VALUES ($1, $2, $3, $4, $5, $6, NOW(), $7)',
                p
            );
        }
        console.log('✅ 20 productos insertados para Mueblería 1 (In Decor)');

        // Productos para Mueblería 2 (Interio) - 20 productos
        const productos2 = [
            ['Sofá Seccional Beige', 'Sofá seccional en L color beige con chaise lounge', 24999.00, 2, 'producto_final', 5, '["/mueblerias/2/producto1.jpg"]'],
            ['Mesa de Comedor Oval', 'Mesa de comedor ovalada para 8 personas', 18999.00, 2, 'producto_final', 4, '["/mueblerias/2/producto2.jpg"]'],
            ['Silla de Comedor Set 4', 'Set de 4 sillas tapizadas en terciopelo azul', 8999.00, 2, 'producto_final', 8, '["/mueblerias/2/producto3.jpg"]'],
            ['Recámara Completa', 'Juego de recámara con cabecera, 2 burós y cómoda', 28999.00, 2, 'producto_final', 3, '["/mueblerias/2/producto4.jpg"]'],
            ['Mueble de Baño', 'Mueble para baño con lavabo y espejo incluido', 7999.00, 2, 'producto_final', 12, '["/mueblerias/2/producto5.jpg"]'],
            ['Cama con Almacenamiento', 'Cama queen size con cajones debajo del colchón', 18999.00, 2, 'producto_final', 7, '["/mueblerias/2/producto6.jpg"]'],
            ['Closet Modular', 'Sistema de closet modular con puertas corredizas', 15999.00, 2, 'producto_final', 6, '["/mueblerias/2/producto7.jpg"]'],
            ['Sala de Exterior', 'Set de sala para exterior en ratán sintético', 12999.00, 2, 'producto_final', 9, '["/mueblerias/2/producto8.jpg"]'],
            ['Mesa de Bar', 'Mesa alta de bar con 4 taburetes incluidos', 6999.00, 2, 'producto_final', 11, '["/mueblerias/2/producto9.jpg"]'],
            ['Escritorio Standing', 'Escritorio ajustable para trabajo de pie o sentado', 11499.00, 2, 'producto_final', 8, '["/mueblerias/2/producto10.jpg"]'],
            ['Sillón Orejero', 'Sillón orejero tapizado en tela color mostaza', 6999.00, 2, 'producto_final', 10, '["/mueblerias/2/producto1.jpg"]'],
            ['Mesa de Noche Doble', 'Set de 2 mesas de noche con cajones secretos', 4599.00, 2, 'producto_final', 15, '["/mueblerias/2/producto2.jpg"]'],
            ['Estantería Escalera', 'Estantería en forma de escalera de 5 niveles', 3499.00, 2, 'producto_final', 18, '["/mueblerias/2/producto3.jpg"]'],
            ['Mesa Consola', 'Mesa consola para entrada con cajón central', 3999.00, 2, 'producto_final', 20, '["/mueblerias/2/producto4.jpg"]'],
            ['Puff Redondo', 'Puff otomano redondo tapizado en tela gris', 1899.00, 2, 'producto_final', 25, '["/mueblerias/2/producto5.jpg"]'],
            ['Armario Esquinero', 'Armario aprovechador de esquinas con espejo', 9999.00, 2, 'producto_final', 7, '["/mueblerias/2/producto6.jpg"]'],
            ['Set Sala Compacta', 'Set de sala 2-1 para espacios pequeños', 13999.00, 2, 'producto_final', 6, '["/mueblerias/2/producto7.jpg"]'],
            ['Mesa de Juegos', 'Mesa multiusos con tapa reversible y 4 sillas', 5999.00, 2, 'producto_final', 14, '["/mueblerias/2/producto8.jpg"]'],
            ['Rack para Vinos', 'Rack para 24 botellas de vino en madera', 2199.00, 2, 'producto_final', 22, '["/mueblerias/2/producto9.jpg"]'],
            ['Zapatera 5 Niveles', 'Zapatera con espejo y 5 niveles ajustables', 2999.00, 2, 'producto_final', 17, '["/mueblerias/2/producto10.jpg"]']
        ];

        for (const p of productos2) {
            await client.query(
                'INSERT INTO Productos (nombre, descripcion, precio, id_muebleria, tipo_producto, stock, fecha_creacion, imagenes) VALUES ($1, $2, $3, $4, $5, $6, NOW(), $7)',
                p
            );
        }
        console.log('✅ 20 productos insertados para Mueblería 2 (Interio)');

        // Productos para Mueblería 3 (Chico Muebles) - 20 productos
        const productos3 = [
            ['Sofá Económico Rojo', 'Sofá de 2 plazas en tela roja ideal para departamentos', 4999.00, 3, 'producto_final', 25, '["/mueblerias/3/producto1.jpg"]'],
            ['Mesa Plegable', 'Mesa plegable multiusos para comedor o jardín', 1299.00, 3, 'producto_final', 40, '["/mueblerias/3/producto2.jpg"]'],
            ['Silla Plástico Set 6', 'Set de 6 sillas de plástico apilables colores', 1499.00, 3, 'producto_final', 50, '["/mueblerias/3/producto3.jpg"]'],
            ['Cama Individual', 'Cama individual con colchón ortopédico incluido', 3999.00, 3, 'producto_final', 20, '["/mueblerias/3/producto4.jpg"]'],
            ['Ropero Sencillo', 'Ropero de 2 puertas con barra y cajón', 2999.00, 3, 'producto_final', 30, '["/mueblerias/3/producto5.jpg"]'],
            ['Mesa de Noche Básica', 'Buró económico con 1 cajón amplio', 799.00, 3, 'producto_final', 45, '["/mueblerias/3/producto6.jpg"]'],
            ['Escritorio Estudiante', 'Escritorio compacto para estudiante con repisa', 1499.00, 3, 'producto_final', 35, '["/mueblerias/3/producto7.jpg"]'],
            ['Colchón Individual', 'Colchón individual de espuma de alta densidad', 1999.00, 3, 'producto_final', 28, '["/mueblerias/3/producto8.jpg"]'],
            ['Banco de Madera', 'Banco rústico de madera para interior o exterior', 899.00, 3, 'producto_final', 55, '["/mueblerias/3/producto9.jpg"]'],
            ['Cajonera Plástica', 'Cajonera de plástico con 5 cajones y ruedas', 699.00, 3, 'producto_final', 60, '["/mueblerias/3/producto10.jpg"]'],
            ['Sofá Cama', 'Sofá convertible a cama individual para visitas', 6499.00, 3, 'producto_final', 15, '["/mueblerias/3/producto1.jpg"]'],
            ['Mesa TV Sencilla', 'Mueble para TV con 2 entrepaños abiertos', 999.00, 3, 'producto_final', 42, '["/mueblerias/3/producto2.jpg"]'],
            ['Set Comedor 4', 'Mesa con 4 sillas de tubo y plástico', 2499.00, 3, 'producto_final', 33, '["/mueblerias/3/producto3.jpg"]'],
            ['Litera Metálica', 'Litera metálica con barandal de seguridad', 4999.00, 3, 'producto_final', 12, '["/mueblerias/3/producto4.jpg"]'],
            ['Colchón Matrimonial', 'Colchón matrimonial económico semi-ortopédico', 2999.00, 3, 'producto_final', 22, '["/mueblerias/3/producto5.jpg"]'],
            ['Hamaca Plegable', 'Hamaca portátil de tela resistente', 599.00, 3, 'producto_final', 48, '["/mueblerias/3/producto6.jpg"]'],
            ['Perchero Tubo', 'Perchero de tubo cromado con zapatera base', 499.00, 3, 'producto_final', 38, '["/mueblerias/3/producto7.jpg"]'],
            ['Base de Cama', 'Base de cama matrimonial de madera sencilla', 1799.00, 3, 'producto_final', 27, '["/mueblerias/3/producto8.jpg"]'],
            ['Cajas Organizadoras', 'Set de 5 cajas organizadoras apilables', 399.00, 3, 'producto_final', 65, '["/mueblerias/3/producto9.jpg"]'],
            ['Cortina Separador', 'Cortina para separar ambientes con riel', 799.00, 3, 'producto_final', 44, '["/mueblerias/3/producto10.jpg"]']
        ];

        for (const p of productos3) {
            await client.query(
                'INSERT INTO Productos (nombre, descripcion, precio, id_muebleria, tipo_producto, stock, fecha_creacion, imagenes) VALUES ($1, $2, $3, $4, $5, $6, NOW(), $7)',
                p
            );
        }
        console.log('✅ 20 productos insertados para Mueblería 3 (Chico Muebles)');

        console.log('\n🎉 ¡Datos insertados exitosamente!');
        console.log('📊 Resumen:');
        console.log('   • 3 Mueblerías');
        console.log('   • 3 Sucursales');
        console.log('   • 60 Productos (20 por mueblería)');
        
    } catch (err) {
        console.error('❌ Error:', err.message);
    } finally {
        client.release();
        await pool.end();
    }
}

insertarDatos();
