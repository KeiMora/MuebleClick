const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true
}));
app.use(express.json());

// Middleware de autenticación
const authMiddleware = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Token no proporcionado' });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Token inválido' });
    }
};

// ============================================
// AUTENTICACIÓN
// ============================================

// Registro de usuario
app.post('/api/register', async (req, res) => {
    const { nombre, correo, password, telefono } = req.body;
    
    try {
        // Verificar si el correo ya existe
        const checkResult = await pool.query(
            'SELECT id_usuario FROM Usuarios WHERE correo = $1',
            [correo]
        );
        
        if (checkResult.rows.length > 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'El correo electrónico ya está registrado.' 
            });
        }
        
        // Encriptar contraseña
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Insertar usuario (role_id = 5 es cliente)
        const userResult = await pool.query(
            `INSERT INTO Usuarios (nombre, correo, password, role_id, activo) 
             VALUES ($1, $2, $3, 5, TRUE) 
             RETURNING id_usuario, nombre, correo, role_id`,
            [nombre, correo, hashedPassword]
        );
        
        const userId = userResult.rows[0].id_usuario;
        
        // Crear registro en tabla Cliente
        await pool.query(
            'INSERT INTO Cliente (id_usuario, telefono, puntos) VALUES ($1, $2, 0)',
            [userId, telefono || null]
        );
        
        // Generar token
        const token = jwt.sign(
            { 
                id: userId, 
                correo, 
                nombre,
                role_id: 5 
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        res.json({
            success: true,
            message: 'Usuario registrado exitosamente',
            token,
            user: {
                id_usuario: userId,
                nombre,
                correo,
                role_id: 5
            }
        });
        
    } catch (err) {
        console.error('Error en registro:', err);
        res.status(500).json({ 
            success: false, 
            message: 'Error al registrar el usuario.' 
        });
    }
});

// Login de usuario (compatibilidad con rutas del frontend)
app.post('/auth/login', async (req, res) => {
    const { nombre, correo, password, telefono } = req.body;
    
    try {
        // Verificar si el correo ya existe
        const checkResult = await pool.query(
            'SELECT id_usuario FROM Usuarios WHERE correo = $1',
            [correo]
        );
        
        if (checkResult.rows.length > 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'El correo electrónico ya está registrado.' 
            });
        }
        
        // Encriptar contraseña
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Insertar usuario (role_id = 5 es cliente)
        const userResult = await pool.query(
            `INSERT INTO Usuarios (nombre, correo, password, role_id, activo) 
             VALUES ($1, $2, $3, 5, TRUE) 
             RETURNING id_usuario, nombre, correo, role_id`,
            [nombre, correo, hashedPassword]
        );
        
        const userId = userResult.rows[0].id_usuario;
        
        // Crear registro en tabla Cliente
        await pool.query(
            'INSERT INTO Cliente (id_usuario, telefono, puntos) VALUES ($1, $2, 0)',
            [userId, telefono || null]
        );
        
        // Generar token
        const token = jwt.sign(
            { 
                id: userId, 
                correo, 
                nombre,
                role_id: 5 
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        res.json({
            success: true,
            message: 'Usuario registrado exitosamente',
            token,
            user: {
                id_usuario: userId,
                nombre,
                correo,
                role_id: 5
            }
        });
        
    } catch (err) {
        console.error('Error en registro:', err);
        res.status(500).json({ 
            success: false, 
            message: 'Error al registrar el usuario.' 
        });
    }
});

// Login de usuario
app.post('/api/login', async (req, res) => {
    const { correo, password } = req.body;
    
    try {
        // Buscar usuario
        const userResult = await pool.query(
            `SELECT u.*, r.nombre as role_nombre 
             FROM Usuarios u 
             JOIN Roles r ON u.role_id = r.id_rol 
             WHERE u.correo = $1 AND u.activo = TRUE`,
            [correo]
        );
        
        if (userResult.rows.length === 0) {
            return res.status(401).json({ 
                success: false, 
                message: 'Correo o contraseña incorrectos.' 
            });
        }
        
        const user = userResult.rows[0];
        
        // Verificar contraseña
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ 
                success: false, 
                message: 'Correo o contraseña incorrectos.' 
            });
        }
        
        // Obtener información adicional del cliente si aplica
        let userData = { ...user };
        delete userData.password; // No enviar password
        
        if (user.role_id === 5) { // Cliente
            const clienteResult = await pool.query(
                'SELECT * FROM Cliente WHERE id_usuario = $1',
                [user.id_usuario]
            );
            if (clienteResult.rows.length > 0) {
                userData = { ...userData, ...clienteResult.rows[0] };
            }
        }
        
        // Generar token
        const token = jwt.sign(
            { 
                id: user.id_usuario, 
                correo: user.correo, 
                nombre: user.nombre,
                role_id: user.role_id 
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        res.json({
            success: true,
            message: 'Login exitoso',
            token,
            user: userData
        });
        
    } catch (err) {
        console.error('Error en login:', err);
        res.status(500).json({ 
            success: false, 
            message: 'Error al iniciar sesión.' 
        });
    }
});

// Verificar token
app.get('/api/verify', authMiddleware, async (req, res) => {
    try {
        const userResult = await pool.query(
            `SELECT u.id_usuario, u.nombre, u.correo, u.role_id, r.nombre as role_nombre 
             FROM Usuarios u 
             JOIN Roles r ON u.role_id = r.id_rol 
             WHERE u.id_usuario = $1 AND u.activo = TRUE`,
            [req.user.id]
        );
        
        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        
        res.json({ 
            valid: true, 
            user: userResult.rows[0] 
        });
    } catch (err) {
        res.status(500).json({ error: 'Error al verificar usuario' });
    }
});

// ============================================
// MUEBLERÍAS
// ============================================

// Obtener todas las mueblerías
app.get('/api/mueblerias', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT m.id_muebleria, m.nombre_negocio, m.razon_social, m.rfc, 
                   m.direccion_principal, m.telefono, m.creado_en, m.descripcion, 
                   m.email, m.logo_url, m.id_propietario,
                   COUNT(DISTINCT p.id_producto) as total_productos,
                   COUNT(DISTINCT s.id_sucursal) as num_sucursales
            FROM Mueblerias m
            LEFT JOIN Productos p ON m.id_muebleria = p.id_muebleria
            LEFT JOIN Sucursales s ON m.id_muebleria = s.id_muebleria
            GROUP BY m.id_muebleria, m.nombre_negocio, m.razon_social, m.rfc, 
                     m.direccion_principal, m.telefono, m.creado_en, m.descripcion, 
                     m.email, m.logo_url, m.id_propietario
            ORDER BY m.nombre_negocio
        `);
        
        res.json({
            success: true,
            data: result.rows
        });
    } catch (err) {
        console.error('Error al obtener mueblerías:', err);
        res.status(500).json({ 
            success: false, 
            error: 'Error al obtener mueblerías' 
        });
    }
});

// Obtener detalle de una mueblería
app.get('/api/mueblerias/:id', async (req, res) => {
    const { id } = req.params;
    
    try {
        const result = await pool.query(`
            SELECT m.*, 
                   COUNT(DISTINCT p.id_producto) as total_productos,
                   COUNT(DISTINCT s.id_sucursal) as num_sucursales
            FROM Mueblerias m
            LEFT JOIN Productos p ON m.id_muebleria = p.id_muebleria
            LEFT JOIN Sucursales s ON m.id_muebleria = s.id_muebleria
            WHERE m.id_muebleria = $1
            GROUP BY m.id_muebleria
        `, [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ 
                success: false, 
                error: 'Mueblería no encontrada' 
            });
        }
        
        res.json({
            success: true,
            data: result.rows[0]
        });
    } catch (err) {
        console.error('Error al obtener mueblería:', err);
        res.status(500).json({ 
            success: false, 
            error: 'Error al obtener mueblería' 
        });
    }
});

// Crear nueva mueblería (requiere autenticación)
app.post('/api/mueblerias', authMiddleware, async (req, res) => {
    const { nombre_negocio, descripcion, telefono, email, id_propietario } = req.body;
    
    try {
        const result = await pool.query(
            `INSERT INTO Mueblerias (nombre_negocio, descripcion, telefono, email, id_propietario, fecha_registro, activo) 
             VALUES ($1, $2, $3, $4, $5, NOW(), TRUE) 
             RETURNING *`,
            [nombre_negocio, descripcion, telefono, email, id_propietario || req.user.id]
        );
        
        res.json({
            success: true,
            message: 'Mueblería creada exitosamente',
            data: result.rows[0]
        });
    } catch (err) {
        console.error('Error al crear mueblería:', err);
        res.status(500).json({ 
            success: false, 
            error: 'Error al crear mueblería' 
        });
    }
});

// ============================================
// PRODUCTOS
// ============================================

// Crear nuevo producto (requiere autenticación)
app.post('/api/productos', authMiddleware, async (req, res) => {
    const { nombre, descripcion, precio, id_muebleria, tipo_producto, stock } = req.body;
    
    try {
        const result = await pool.query(
            `INSERT INTO Productos (nombre, descripcion, precio, id_muebleria, tipo_producto, stock, fecha_creacion) 
             VALUES ($1, $2, $3, $4, $5, $6, NOW()) 
             RETURNING *`,
            [nombre, descripcion, precio, id_muebleria, tipo_producto || 'producto_final', stock || 0]
        );
        
        res.json({
            success: true,
            message: 'Producto creado exitosamente',
            data: result.rows[0]
        });
    } catch (err) {
        console.error('Error al crear producto:', err);
        res.status(500).json({ 
            success: false, 
            error: 'Error al crear producto' 
        });
    }
});

// ============================================
// PRODUCTOS
// ============================================

// Obtener productos por mueblería
app.get('/api/productos/muebleria/:id', async (req, res) => {
    const { id } = req.params;
    
    try {
        const result = await pool.query(`
            SELECT p.*, m.nombre_negocio as muebleria_nombre
            FROM Productos p
            JOIN Mueblerias m ON p.id_muebleria = m.id_muebleria
            WHERE p.id_muebleria = $1 
            AND p.tipo_producto = 'producto_final'
            ORDER BY p.nombre
        `, [id]);
        
        res.json({
            success: true,
            data: result.rows
        });
    } catch (err) {
        console.error('Error al obtener productos:', err);
        res.status(500).json({ 
            success: false, 
            error: 'Error al obtener productos' 
        });
    }
});

// Obtener detalle de un producto
app.get('/api/productos/:id', async (req, res) => {
    const { id } = req.params;
    
    try {
        const result = await pool.query(`
            SELECT p.*, m.nombre_negocio as muebleria_nombre
            FROM Productos p
            JOIN Mueblerias m ON p.id_muebleria = m.id_muebleria
            WHERE p.id_producto = $1
        `, [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ 
                success: false, 
                error: 'Producto no encontrado' 
            });
        }
        
        res.json({
            success: true,
            data: result.rows[0]
        });
    } catch (err) {
        console.error('Error al obtener producto:', err);
        res.status(500).json({ 
            success: false, 
            error: 'Error al obtener producto' 
        });
    }
});

// ============================================
// SUCURSALES
// ============================================

// Obtener sucursales de una mueblería
app.get('/api/sucursales/muebleria/:id', async (req, res) => {
    const { id } = req.params;
    
    try {
        const result = await pool.query(`
            SELECT s.*, m.nombre as municipio_nombre, e.nombre as estado_nombre
            FROM Sucursales s
            JOIN Municipios m ON s.id_municipio = m.id_municipio
            JOIN Estados e ON m.id_estado = e.id_estado
            WHERE s.id_muebleria = $1 AND s.activo = TRUE
            ORDER BY s.nombre_sucursal
        `, [id]);
        
        res.json({
            success: true,
            data: result.rows
        });
    } catch (err) {
        console.error('Error al obtener sucursales:', err);
        res.status(500).json({ 
            success: false, 
            error: 'Error al obtener sucursales' 
        });
    }
});

// ============================================
// LISTA DE DESEOS
// ============================================

// Obtener lista de deseos del usuario
app.get('/api/deseos', authMiddleware, async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT p.*, ld.fecha_agregado
            FROM Lista_Deseos ld
            JOIN Productos p ON ld.id_producto = p.id_producto
            WHERE ld.id_cliente = $1
            ORDER BY ld.fecha_agregado DESC
        `, [req.user.id]);
        
        res.json({
            success: true,
            data: result.rows
        });
    } catch (err) {
        console.error('Error al obtener lista de deseos:', err);
        res.status(500).json({ 
            success: false, 
            error: 'Error al obtener lista de deseos' 
        });
    }
});

// Agregar a lista de deseos
app.post('/api/deseos', authMiddleware, async (req, res) => {
    const { id_producto } = req.body;
    
    try {
        // Verificar si ya existe
        const checkResult = await pool.query(
            'SELECT id_deseo FROM Lista_Deseos WHERE id_cliente = $1 AND id_producto = $2',
            [req.user.id, id_producto]
        );
        
        if (checkResult.rows.length > 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'El producto ya está en tu lista de deseos' 
            });
        }
        
        const result = await pool.query(
            'INSERT INTO Lista_Deseos (id_cliente, id_producto) VALUES ($1, $2) RETURNING *',
            [req.user.id, id_producto]
        );
        
        res.json({
            success: true,
            message: 'Producto agregado a tu lista de deseos',
            data: result.rows[0]
        });
    } catch (err) {
        console.error('Error al agregar a deseos:', err);
        res.status(500).json({ 
            success: false, 
            error: 'Error al agregar a lista de deseos' 
        });
    }
});

// Eliminar de lista de deseos
app.delete('/api/deseos/:id_producto', authMiddleware, async (req, res) => {
    const { id_producto } = req.params;
    
    try {
        await pool.query(
            'DELETE FROM Lista_Deseos WHERE id_cliente = $1 AND id_producto = $2',
            [req.user.id, id_producto]
        );
        
        res.json({
            success: true,
            message: 'Producto eliminado de tu lista de deseos'
        });
    } catch (err) {
        console.error('Error al eliminar de deseos:', err);
        res.status(500).json({ 
            success: false, 
            error: 'Error al eliminar de lista de deseos' 
        });
    }
});

// ============================================
// INICIAR SERVIDOR
// ============================================

app.listen(PORT, () => {
    console.log(`🚀 Servidor Node.js corriendo en http://localhost:${PORT}`);
    console.log(`📦 API Endpoints disponibles:`);
    console.log(`   POST /api/register - Registro de usuarios`);
    console.log(`   POST /api/login - Login de usuarios`);
    console.log(`   GET  /api/mueblerias - Lista de mueblerías`);
    console.log(`   GET  /api/productos/muebleria/:id - Productos por mueblería`);
    console.log(`   GET  /api/sucursales/muebleria/:id - Sucursales por mueblería`);
});
