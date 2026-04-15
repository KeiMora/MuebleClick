-- Creación de la base de datos para MuebleClick
-- Motor: PostgreSQL 14+
-- Codificación: UTF8

-- Crear base de datos (ejecutar como superusuario)
-- CREATE DATABASE muebles WITH ENCODING = 'UTF8' LC_COLLATE = 'es_MX.UTF-8' LC_CTYPE = 'es_MX.UTF-8';

-- Conectar a la base de datos
-- \c muebles;

-- ==================== TIPOS ENUM PERSONALIZADOS ====================

CREATE TYPE tipo_producto_enum AS ENUM ('materia_prima', 'ensamblado', 'producto_final');
CREATE TYPE tipo_proveedor_enum AS ENUM ('materia_prima', 'producto', 'servicio');
CREATE TYPE tipo_entrega_enum AS ENUM ('recoger_tienda', 'envio_domicilio');
CREATE TYPE estado_pedido_enum AS ENUM ('pendiente', 'confirmado', 'preparando', 'enviado', 'entregado', 'cancelado');
CREATE TYPE estado_pago_enum AS ENUM ('activo', 'inactivo');
CREATE TYPE estado_venta_enum AS ENUM ('completada', 'pendiente', 'cancelada');

-- ==================== TABLAS PRINCIPALES ====================

-- Roles: catálogo de tipos de usuario
CREATE TABLE Roles (
    id_rol SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT
);

CREATE INDEX idx_roles_nombre ON Roles(nombre);

-- Usuarios: registro principal de usuarios del sistema
CREATE TABLE Usuarios (
    id_usuario SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role_id INTEGER NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE,
    CONSTRAINT fk_usuarios_role FOREIGN KEY (role_id) REFERENCES Roles(id_rol) ON DELETE RESTRICT
);

CREATE INDEX idx_usuarios_correo ON Usuarios(correo);
CREATE INDEX idx_usuarios_role ON Usuarios(role_id);

-- Propietario: información fiscal y bancaria del usuario propietario
CREATE TABLE Propietario (
    id_usuario INTEGER PRIMARY KEY,
    curp_rfc VARCHAR(18) UNIQUE,
    clabe_interbancaria VARCHAR(18),
    banco VARCHAR(100),
    verificado BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_propietario_usuario FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario) ON DELETE CASCADE
);

CREATE INDEX idx_propietario_rfc ON Propietario(curp_rfc);

-- Estados: catálogo de entidades federativas
CREATE TABLE Estados (
    id_estado SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    codigo_iso VARCHAR(2) UNIQUE
);

CREATE INDEX idx_estados_nombre ON Estados(nombre);

-- Municipios: municipios dentro de un estado
CREATE TABLE Municipios (
    id_municipio SERIAL PRIMARY KEY,
    id_estado INTEGER NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    CONSTRAINT fk_municipios_estado FOREIGN KEY (id_estado) REFERENCES Estados(id_estado) ON DELETE RESTRICT
);

CREATE INDEX idx_municipios_estado ON Municipios(id_estado);
CREATE INDEX idx_municipios_nombre ON Municipios(nombre);

-- Mueblerias: entidad comercial o marca
CREATE TABLE Mueblerias (
    id_muebleria SERIAL PRIMARY KEY,
    nombre_negocio VARCHAR(150) NOT NULL,
    id_propietario INTEGER NOT NULL,
    razon_social VARCHAR(200) NOT NULL,
    rfc VARCHAR(13) NOT NULL UNIQUE,
    direccion_principal TEXT NOT NULL,
    telefono VARCHAR(20),
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_mueblerias_propietario FOREIGN KEY (id_propietario) REFERENCES Propietario(id_usuario) ON DELETE RESTRICT
);

CREATE INDEX idx_mueblerias_propietario ON Mueblerias(id_propietario);
CREATE INDEX idx_mueblerias_nombre ON Mueblerias(nombre_negocio);

-- Sucursales: puntos de venta pertenecientes a una mueblería
CREATE TABLE Sucursales (
    id_sucursal SERIAL PRIMARY KEY,
    id_muebleria INTEGER NOT NULL,
    nombre_sucursal VARCHAR(150) NOT NULL,
    calle_numero TEXT NOT NULL,
    id_municipio INTEGER NOT NULL,
    telefono VARCHAR(20),
    horario JSONB,
    activo BOOLEAN DEFAULT TRUE,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_sucursales_muebleria FOREIGN KEY (id_muebleria) REFERENCES Mueblerias(id_muebleria) ON DELETE CASCADE,
    CONSTRAINT fk_sucursales_municipio FOREIGN KEY (id_municipio) REFERENCES Municipios(id_municipio) ON DELETE RESTRICT
);

CREATE INDEX idx_sucursales_muebleria ON Sucursales(id_muebleria);
CREATE INDEX idx_sucursales_municipio ON Sucursales(id_municipio);
CREATE INDEX idx_sucursales_activa ON Sucursales(activo);

-- Cliente: extensión de usuarios con datos de clientes
CREATE TABLE Cliente (
    id_usuario INTEGER PRIMARY KEY,
    telefono VARCHAR(20),
    id_municipio_default INTEGER,
    direccion_principal TEXT,
    puntos INTEGER DEFAULT 0,
    CONSTRAINT fk_cliente_usuario FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario) ON DELETE CASCADE,
    CONSTRAINT fk_cliente_municipio FOREIGN KEY (id_municipio_default) REFERENCES Municipios(id_municipio) ON DELETE SET NULL
);

CREATE INDEX idx_cliente_municipio ON Cliente(id_municipio_default);

-- Empleado: extensión de usuarios para empleados
CREATE TABLE Empleado (
    id_usuario INTEGER PRIMARY KEY,
    id_sucursal INTEGER NOT NULL,
    puesto VARCHAR(100),
    fecha_ingreso DATE,
    activo BOOLEAN DEFAULT TRUE,
    es_vendedor BOOLEAN DEFAULT FALSE,
    codigo_vendedor VARCHAR(20) UNIQUE,
    comision_pct NUMERIC(5,2) DEFAULT 0.00,
    CONSTRAINT fk_empleado_usuario FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario) ON DELETE CASCADE,
    CONSTRAINT fk_empleado_sucursal FOREIGN KEY (id_sucursal) REFERENCES Sucursales(id_sucursal) ON DELETE RESTRICT
);

CREATE INDEX idx_empleado_sucursal ON Empleado(id_sucursal);
CREATE INDEX idx_empleado_vendedor ON Empleado(es_vendedor);
CREATE INDEX idx_empleado_codigo ON Empleado(codigo_vendedor);

-- ==================== PRODUCTOS Y MATERIAS PRIMAS ====================

-- Productos: catálogo de productos terminados
CREATE TABLE Productos (
    id_producto SERIAL PRIMARY KEY,
    sku VARCHAR(50) NOT NULL UNIQUE,
    id_muebleria INTEGER NOT NULL,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    categoria VARCHAR(100),
    unidad_medida VARCHAR(20) DEFAULT 'pieza',
    imagen_url TEXT,
    precio_venta NUMERIC(10,2) NOT NULL,
    peso_kg NUMERIC(8,2),
    volumen_m3 NUMERIC(8,2),
    tipo_producto tipo_producto_enum DEFAULT 'producto_final',
    color VARCHAR(50),
    material VARCHAR(100),
    medidas VARCHAR(100),
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_productos_muebleria FOREIGN KEY (id_muebleria) REFERENCES Mueblerias(id_muebleria) ON DELETE CASCADE
);

CREATE INDEX idx_productos_muebleria ON Productos(id_muebleria);
CREATE INDEX idx_productos_categoria ON Productos(categoria);
CREATE INDEX idx_productos_tipo ON Productos(tipo_producto);
CREATE INDEX idx_productos_sku ON Productos(sku);

-- Trigger para actualizar automáticamente actualizado_en
CREATE OR REPLACE FUNCTION update_actualizado_en()
RETURNS TRIGGER AS $$
BEGIN
    NEW.actualizado_en = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_productos_actualizado
    BEFORE UPDATE ON Productos
    FOR EACH ROW
    EXECUTE FUNCTION update_actualizado_en();

-- Proveedores: lista de proveedores
CREATE TABLE Proveedores (
    id_proveedor SERIAL PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    contacto_nombre VARCHAR(100),
    contacto_email VARCHAR(100),
    telefono VARCHAR(20),
    id_municipio INTEGER,
    direccion TEXT,
    rfc VARCHAR(13),
    cuenta_bancaria VARCHAR(18),
    tiempo_entrega_dias INTEGER DEFAULT 7,
    tipo_proveedor tipo_proveedor_enum DEFAULT 'producto',
    CONSTRAINT fk_proveedores_municipio FOREIGN KEY (id_municipio) REFERENCES Municipios(id_municipio) ON DELETE SET NULL
);

CREATE INDEX idx_proveedores_municipio ON Proveedores(id_municipio);
CREATE INDEX idx_proveedores_tipo ON Proveedores(tipo_proveedor);

-- Materias_Primas: materiales necesarios para fabricar productos
CREATE TABLE Materias_Primas (
    id_materia SERIAL PRIMARY KEY,
    codigo VARCHAR(50) NOT NULL UNIQUE,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    unidad_medida VARCHAR(20) NOT NULL,
    precio_unitario NUMERIC(10,2) NOT NULL,
    proveedor_preferente INTEGER,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_mp_proveedor FOREIGN KEY (proveedor_preferente) REFERENCES Proveedores(id_proveedor) ON DELETE SET NULL
);

CREATE INDEX idx_mp_codigo ON Materias_Primas(codigo);
CREATE INDEX idx_mp_proveedor ON Materias_Primas(proveedor_preferente);

CREATE TRIGGER trg_materias_actualizado
    BEFORE UPDATE ON Materias_Primas
    FOR EACH ROW
    EXECUTE FUNCTION update_actualizado_en();

-- ==================== INVENTARIOS ====================

-- Inventario: stock de productos por sucursal
CREATE TABLE Inventario (
    id_inventario SERIAL PRIMARY KEY,
    id_sucursal INTEGER NOT NULL,
    id_producto INTEGER NOT NULL,
    cantidad INTEGER NOT NULL DEFAULT 0,
    reservado INTEGER NOT NULL DEFAULT 0,
    stock_min INTEGER DEFAULT 5,
    stock_max INTEGER DEFAULT 100,
    ultimo_movimiento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_inventario_sucursal_producto UNIQUE (id_sucursal, id_producto),
    CONSTRAINT fk_inventario_sucursal FOREIGN KEY (id_sucursal) REFERENCES Sucursales(id_sucursal) ON DELETE CASCADE,
    CONSTRAINT fk_inventario_producto FOREIGN KEY (id_producto) REFERENCES Productos(id_producto) ON DELETE CASCADE
);

CREATE INDEX idx_inventario_sucursal ON Inventario(id_sucursal);
CREATE INDEX idx_inventario_producto ON Inventario(id_producto);

-- Trigger para actualizar ultimo_movimiento
CREATE OR REPLACE FUNCTION update_ultimo_movimiento()
RETURNS TRIGGER AS $$
BEGIN
    NEW.ultimo_movimiento = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_inventario_movimiento
    BEFORE UPDATE ON Inventario
    FOR EACH ROW
    EXECUTE FUNCTION update_ultimo_movimiento();

-- Inventario_MP: stock de materias primas por sucursal
CREATE TABLE Inventario_MP (
    id_inventario_mp SERIAL PRIMARY KEY,
    id_sucursal INTEGER NOT NULL,
    id_materia INTEGER NOT NULL,
    cantidad NUMERIC(12,3) NOT NULL DEFAULT 0.000,
    stock_min NUMERIC(12,3) DEFAULT 1.000,
    stock_max NUMERIC(12,3) DEFAULT 1000.000,
    ultimo_movimiento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_inventario_mp_sucursal_materia UNIQUE (id_sucursal, id_materia),
    CONSTRAINT fk_inventario_mp_sucursal FOREIGN KEY (id_sucursal) REFERENCES Sucursales(id_sucursal) ON DELETE CASCADE,
    CONSTRAINT fk_inventario_mp_materia FOREIGN KEY (id_materia) REFERENCES Materias_Primas(id_materia) ON DELETE CASCADE
);

CREATE INDEX idx_inventario_mp_sucursal ON Inventario_MP(id_sucursal);
CREATE INDEX idx_inventario_mp_materia ON Inventario_MP(id_materia);

CREATE TRIGGER trg_inventario_mp_movimiento
    BEFORE UPDATE ON Inventario_MP
    FOR EACH ROW
    EXECUTE FUNCTION update_ultimo_movimiento();

-- ==================== VENTAS Y PEDIDOS ====================

-- Direcciones_Envio: direcciones de clientes
CREATE TABLE Direcciones_Envio (
    id_direccion SERIAL PRIMARY KEY,
    id_cliente INTEGER NOT NULL,
    calle_numero TEXT NOT NULL,
    id_municipio INTEGER NOT NULL,
    referencias TEXT,
    CONSTRAINT fk_direcciones_cliente FOREIGN KEY (id_cliente) REFERENCES Cliente(id_usuario) ON DELETE CASCADE,
    CONSTRAINT fk_direcciones_municipio FOREIGN KEY (id_municipio) REFERENCES Municipios(id_municipio) ON DELETE RESTRICT
);

CREATE INDEX idx_direcciones_cliente ON Direcciones_Envio(id_cliente);
CREATE INDEX idx_direcciones_municipio ON Direcciones_Envio(id_municipio);

-- Pedidos: órdenes creadas por clientes
CREATE TABLE Pedidos (
    id_pedido SERIAL PRIMARY KEY,
    id_cliente INTEGER NOT NULL,
    id_direccion INTEGER,
    fecha_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tipo_entrega tipo_entrega_enum DEFAULT 'envio_domicilio',
    id_sucursal_origen INTEGER,
    estado_pedido estado_pedido_enum DEFAULT 'pendiente',
    total NUMERIC(10,2) NOT NULL,
    CONSTRAINT fk_pedidos_cliente FOREIGN KEY (id_cliente) REFERENCES Cliente(id_usuario) ON DELETE RESTRICT,
    CONSTRAINT fk_pedidos_direccion FOREIGN KEY (id_direccion) REFERENCES Direcciones_Envio(id_direccion) ON DELETE SET NULL,
    CONSTRAINT fk_pedidos_sucursal FOREIGN KEY (id_sucursal_origen) REFERENCES Sucursales(id_sucursal) ON DELETE SET NULL
);

CREATE INDEX idx_pedidos_cliente ON Pedidos(id_cliente);
CREATE INDEX idx_pedidos_direccion ON Pedidos(id_direccion);
CREATE INDEX idx_pedidos_sucursal ON Pedidos(id_sucursal_origen);
CREATE INDEX idx_pedidos_estado ON Pedidos(estado_pedido);

-- Metodo_Pago: catálogo de métodos de pago
CREATE TABLE Metodo_Pago (
    id_metodo SERIAL PRIMARY KEY,
    tipo_pago VARCHAR(50) NOT NULL,
    detalles_pago JSONB,
    estado_pago estado_pago_enum DEFAULT 'activo'
);

-- Cupones: códigos promocionales
CREATE TABLE Cupones (
    id_cupon SERIAL PRIMARY KEY,
    codigo VARCHAR(20) NOT NULL UNIQUE,
    descuento_porcentaje NUMERIC(5,2) NOT NULL,
    fecha_expiracion DATE,
    activo BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_cupones_codigo ON Cupones(codigo);
CREATE INDEX idx_cupones_activo ON Cupones(activo);

-- Venta: registro financiero de la transacción
CREATE TABLE Venta (
    id_venta SERIAL PRIMARY KEY,
    id_pedido INTEGER,
    id_cliente INTEGER NOT NULL,
    id_metodo_pago INTEGER,
    id_cupon INTEGER,
    id_vendedor INTEGER,
    fecha_venta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    sub_total NUMERIC(10,2) NOT NULL,
    descuento NUMERIC(10,2) DEFAULT 0.00,
    total_venta NUMERIC(10,2) NOT NULL,
    comision NUMERIC(10,2) DEFAULT 0.00,
    estado_venta estado_venta_enum DEFAULT 'completada',
    CONSTRAINT fk_ventas_pedido FOREIGN KEY (id_pedido) REFERENCES Pedidos(id_pedido) ON DELETE SET NULL,
    CONSTRAINT fk_ventas_cliente FOREIGN KEY (id_cliente) REFERENCES Cliente(id_usuario) ON DELETE RESTRICT,
    CONSTRAINT fk_ventas_metodo FOREIGN KEY (id_metodo_pago) REFERENCES Metodo_Pago(id_metodo) ON DELETE SET NULL,
    CONSTRAINT fk_ventas_cupon FOREIGN KEY (id_cupon) REFERENCES Cupones(id_cupon) ON DELETE SET NULL,
    CONSTRAINT fk_ventas_vendedor FOREIGN KEY (id_vendedor) REFERENCES Empleado(id_usuario) ON DELETE SET NULL
);

CREATE INDEX idx_ventas_pedido ON Venta(id_pedido);
CREATE INDEX idx_ventas_cliente ON Venta(id_cliente);
CREATE INDEX idx_ventas_vendedor ON Venta(id_vendedor);
CREATE INDEX idx_ventas_fecha ON Venta(fecha_venta);

-- Detalle_Venta: líneas de venta
CREATE TABLE Detalle_Venta (
    id_detalle_venta SERIAL PRIMARY KEY,
    id_venta INTEGER NOT NULL,
    id_producto INTEGER NOT NULL,
    cantidad INTEGER NOT NULL,
    precio_unitario NUMERIC(10,2) NOT NULL,
    subtotal NUMERIC(10,2) NOT NULL,
    CONSTRAINT fk_detalle_venta_venta FOREIGN KEY (id_venta) REFERENCES Venta(id_venta) ON DELETE CASCADE,
    CONSTRAINT fk_detalle_venta_producto FOREIGN KEY (id_producto) REFERENCES Productos(id_producto) ON DELETE RESTRICT
);

CREATE INDEX idx_detalle_venta_venta ON Detalle_Venta(id_venta);
CREATE INDEX idx_detalle_venta_producto ON Detalle_Venta(id_producto);

-- ==================== TABLAS ADICIONALES ====================

-- Lista de Deseos (para clientes)
CREATE TABLE Lista_Deseos (
    id_deseo SERIAL PRIMARY KEY,
    id_cliente INTEGER NOT NULL,
    id_producto INTEGER NOT NULL,
    fecha_agregado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_lista_deseos_cliente_producto UNIQUE (id_cliente, id_producto),
    CONSTRAINT fk_lista_deseos_cliente FOREIGN KEY (id_cliente) REFERENCES Cliente(id_usuario) ON DELETE CASCADE,
    CONSTRAINT fk_lista_deseos_producto FOREIGN KEY (id_producto) REFERENCES Productos(id_producto) ON DELETE CASCADE
);

CREATE INDEX idx_lista_deseos_cliente ON Lista_Deseos(id_cliente);
CREATE INDEX idx_lista_deseos_producto ON Lista_Deseos(id_producto);

-- Carrito de Compras
CREATE TABLE Carrito_Compras (
    id_carrito SERIAL PRIMARY KEY,
    id_cliente INTEGER,
    session_id VARCHAR(255),
    id_producto INTEGER NOT NULL,
    cantidad INTEGER NOT NULL DEFAULT 1,
    fecha_agregado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_carrito_cliente FOREIGN KEY (id_cliente) REFERENCES Cliente(id_usuario) ON DELETE CASCADE,
    CONSTRAINT fk_carrito_producto FOREIGN KEY (id_producto) REFERENCES Productos(id_producto) ON DELETE CASCADE
);

CREATE INDEX idx_carrito_cliente ON Carrito_Compras(id_cliente);
CREATE INDEX idx_carrito_session ON Carrito_Compras(session_id);
CREATE INDEX idx_carrito_producto ON Carrito_Compras(id_producto);

-- ==================== INSERCIÓN DE DATOS INICIALES ====================

-- Insertar roles básicos
INSERT INTO Roles (id_rol, nombre, descripcion) VALUES
(1, 'admin', 'Administrador del sistema con acceso completo'),
(2, 'propietario', 'Propietario de mueblería con acceso a su negocio'),
(3, 'empleado', 'Empleado de mueblería con acceso limitado'),
(4, 'vendedor', 'Vendedor con acceso a ventas y comisiones'),
(5, 'cliente', 'Cliente final que compra productos');

-- Insertar estados de México
INSERT INTO Estados (id_estado, nombre, codigo_iso) VALUES
(1, 'Aguascalientes', 'AG'),
(2, 'Baja California', 'BC'),
(3, 'Baja California Sur', 'BS'),
(4, 'Campeche', 'CM'),
(5, 'Coahuila', 'CO'),
(6, 'Colima', 'CL'),
(7, 'Chiapas', 'CS'),
(8, 'Chihuahua', 'CH'),
(9, 'Ciudad de México', 'DF'),
(10, 'Durango', 'DG'),
(11, 'Guanajuato', 'GT'),
(12, 'Guerrero', 'GR'),
(13, 'Hidalgo', 'HG'),
(14, 'Jalisco', 'JA'),
(15, 'México', 'EM'),
(16, 'Michoacán', 'MI'),
(17, 'Morelos', 'MO'),
(18, 'Nayarit', 'NA'),
(19, 'Nuevo León', 'NL'),
(20, 'Oaxaca', 'OA'),
(21, 'Puebla', 'PU'),
(22, 'Querétaro', 'QE'),
(23, 'Quintana Roo', 'QR'),
(24, 'San Luis Potosí', 'SL'),
(25, 'Sinaloa', 'SI'),
(26, 'Sonora', 'SO'),
(27, 'Tabasco', 'TB'),
(28, 'Tamaulipas', 'TM'),
(29, 'Tlaxcala', 'TL'),
(30, 'Veracruz', 'VZ'),
(31, 'Yucatán', 'YU'),
(32, 'Zacatecas', 'ZA');

-- Insertar algunos municipios clave
INSERT INTO Municipios (id_estado, nombre) VALUES
-- Ciudad de México
(9, 'Álvaro Obregón'), (9, 'Azcapotzalco'), (9, 'Benito Juárez'), (9, 'Coyoacán'), (9, 'Cuauhtémoc'),
(9, 'Gustavo A. Madero'), (9, 'Iztacalco'), (9, 'Iztapalapa'), (9, 'La Magdalena Contreras'), (9, 'Miguel Hidalgo'),
(9, 'Milpa Alta'), (9, 'Tláhuac'), (9, 'Tlalpan'), (9, 'Venustiano Carranza'), (9, 'Xochimilco'),
-- Estado de México
(15, 'Toluca'), (15, 'Ecatepec'), (15, 'Naucalpan'), (15, 'Nezahualcóyotl'), (15, 'Tlalnepantla'),
(15, 'Chimalhuacán'), (15, 'Atizapán'), (15, 'Cuautitlán'), (15, 'Tultitlán'), (15, 'Coacalco'),
-- Jalisco
(14, 'Guadalajara'), (14, 'Zapopan'), (14, 'Tlaquepaque'), (14, 'Tonalá'), (14, 'Puerto Vallarta');

-- Insertar métodos de pago
INSERT INTO Metodo_Pago (tipo_pago, detalles_pago, estado_pago) VALUES
('tarjeta_credito', '{"processor": "stripe", "allowed_cards": ["visa", "mastercard", "amex"]}', 'activo'),
('tarjeta_debito', '{"processor": "stripe", "allowed_cards": ["visa", "mastercard"]}', 'activo'),
('transferencia', '{"bank_accounts": ["BBVA", "Bancomer", "Santander"]}', 'activo'),
('paypal', '{"processor": "paypal"}', 'activo'),
('tienda', '{"description": "Pago en tienda física"}', 'activo');

-- Insertar cupones de ejemplo
INSERT INTO Cupones (codigo, descuento_porcentaje, fecha_expiracion, activo) VALUES
('BIENVENIDA10', 10.00, '2024-12-31', TRUE),
('VERANO20', 20.00, '2024-08-31', TRUE),
('PRIMAVERA15', 15.00, '2024-06-30', TRUE);

-- Crear usuario administrador por defecto
-- Password: admin123 (encriptado con password_hash)
INSERT INTO Usuarios (nombre, correo, password, role_id, activo) VALUES
('Administrador', 'admin@muebleclick.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, TRUE);

-- Crear 3 propietarios de ejemplo para las 3 mueblerías
INSERT INTO Usuarios (nombre, correo, password, role_id, activo) VALUES
('Carlos Mendoza', 'carlos@mueblesmodernos.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 2, TRUE),
('Ana Rodríguez', 'ana@mueblesclasicos.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 2, TRUE),
('Roberto Silva', 'roberto@mueblesrusticos.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 2, TRUE);

-- Insertar datos de propietarios
INSERT INTO Propietario (id_usuario, curp_rfc, clabe_interbancaria, banco, verificado) VALUES
(2, 'MENC800101HDFABC01', '002310000000000000', 'BBVA Bancomer', TRUE),
(3, 'RODA850215MDFXYZ02', '012320000000000000', 'Bancomer', TRUE),
(4, 'SIRA750330GHIJKL03', '014180000000000000', 'Santander', TRUE);

-- Insertar las 3 mueblerías principales
INSERT INTO Mueblerias (nombre_negocio, id_propietario, razon_social, rfc, direccion_principal, telefono) VALUES
('Muebles Modernos SA de CV', 2, 'Muebles Modernos SA de CV', 'MME800101ABC', 'Av. Reforma 123, Cuauhtémoc, Ciudad de México', '55-1234-5678'),
('Muebles Clásicos y Tradicionales', 3, 'Muebles Clásicos y Tradicionales SA', 'MCT850215XYZ', 'Blvd. Juárez 456, Centro, Guadalajara', '33-8765-4321'),
('Muebles Rústicos del Bajío', 4, 'Muebles Rústicos del Bajío SC', 'MRB750330DEF', 'Calle Hidalgo 789, Centro, Toluca', '722-345-6789');

-- Insertar sucursales para cada mueblería
INSERT INTO Sucursales (id_muebleria, nombre_sucursal, calle_numero, id_municipio, telefono, horario, activo) VALUES
-- Sucursales de Muebles Modernos
(1, 'Sucursal Reforma', 'Av. Reforma 123, Cuauhtémoc', 4, '55-1234-5678', '{"lunes_viernes": "9:00-20:00", "sabado": "9:00-18:00", "domingo": "10:00-16:00"}', TRUE),
(1, 'Sucursal Polanco', 'Masaryk 500, Miguel Hidalgo', 15, '55-2345-6789', '{"lunes_viernes": "10:00-21:00", "sabado": "10:00-19:00", "domingo": "11:00-17:00"}', TRUE),
-- Sucursales de Muebles Clásicos
(2, 'Sucursal Centro', 'Blvd. Juárez 456, Guadalajara Centro', 31, '33-8765-4321', '{"lunes_viernes": "9:00-19:00", "sabado": "9:00-17:00", "domingo": "10:00-15:00"}', TRUE),
(2, 'Sucursal Zapopan', 'Av. Patria 789, Zapopan', 32, '33-9876-5432', '{"lunes_viernes": "10:00-20:00", "sabado": "10:00-18:00", "domingo": "11:00-16:00"}', TRUE),
-- Sucursales de Muebles Rústicos
(3, 'Sucursal Toluca', 'Calle Hidalgo 789, Toluca Centro', 36, '722-345-6789', '{"lunes_viernes": "8:00-19:00", "sabado": "8:00-18:00", "domingo": "9:00-14:00"}', TRUE),
(3, 'Sucursal Metepec', 'Av. Lerdo 321, Metepec', 37, '722-456-7890', '{"lunes_viernes": "9:00-20:00", "sabado": "9:00-19:00", "domingo": "10:00-17:00"}', TRUE);

-- Esquema cargado correctamente
