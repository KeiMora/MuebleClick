const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: 'postgres',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '1234',
});

async function ejecutarSQL() {
    const client = await pool.connect();
    try {
        console.log('📄 Leyendo archivo SQL...');
        const sqlFile = fs.readFileSync(path.join(__dirname, '..', 'database', 'insertar_datos_demo_final.sql'), 'utf8');
        
        console.log('🚀 Ejecutando script SQL...\n');
        await client.query(sqlFile);
        
        console.log('\n✅ ¡Datos insertados exitosamente!');
        console.log('📊 Resumen:');
        console.log('   • 3 Mueblerías (In decor, Interio, Chico Muebles)');
        console.log('   • 3 Sucursales');
        console.log('   • 60 Productos (20 por mueblería)');
        console.log('\n🖼️  Logos configurados:');
        console.log('   • Mueblería 1: /mueblerias/1/logo.jpg');
        console.log('   • Mueblería 2: /mueblerias/2/logo2.jpeg');
        console.log('   • Mueblería 3: /mueblerias/3/logo3.jpeg');
        
    } catch (err) {
        console.error('❌ Error:', err.message);
        console.error(err.stack);
    } finally {
        client.release();
        await pool.end();
    }
}

ejecutarSQL();
