const { Pool } = require('pg');
require('dotenv').config();

// Manejar nombres de base de datos con espacios
let dbName = process.env.DB_NAME || 'muebles';
// Quitar comillas si existen
if (dbName.startsWith('"') && dbName.endsWith('"')) {
    dbName = dbName.slice(1, -1);
}

console.log('🔌 Intentando conectar a PostgreSQL...');
console.log('   Host:', process.env.DB_HOST || 'localhost');
console.log('   Puerto:', process.env.DB_PORT || 5432);
console.log('   Base de datos:', dbName);
console.log('   Usuario:', process.env.DB_USER || 'postgres');

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: dbName,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '1234',
});

pool.on('connect', () => {
    console.log('✅ Conectado a PostgreSQL');
});

pool.on('error', (err) => {
    console.error('❌ Error en la conexión a PostgreSQL:', err);
});

module.exports = pool;
