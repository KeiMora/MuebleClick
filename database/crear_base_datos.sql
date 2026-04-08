-- Creación de la base de datos para MuebleClick
-- Motor: MariaDB
-- Versión: 10.4+

CREATE DATABASE IF NOT EXISTS muebles CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci;

USE muebles;

-- ------------------------- TABLAS PRINCIPALES -------------------------

-- Roles: catálogo de tipos de usuario (ej: cliente, empleado, vendedor, propietario, admin).
-- Se utiliza para control de permisos y comportamiento en la interfaz.
CREATE TABLE Roles (
    id_rol INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT,
    INDEX idx_roles_nombre (nombre)
) ENGINE=InnoDB;

-- Usuarios: registro principal de usuarios del sistema (credenciales y estado).
-- role_id referencia el rol principal asignado.
CREATE TABLE Usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role_id INT NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE,
    INDEX idx_usuarios_correo (correo),
    INDEX idx_usuarios_role (role_id),
    FOREIGN KEY (role_id) REFERENCES Roles(id_rol) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- Propietario: información fiscal y bancaria del usuario que es propietario de la mueblería.
-- Usada para facturación y verificación de pagos.
CREATE TABLE Propietario (
    id_usuario INT PRIMARY KEY,
    curp_rfc VARCHAR(18) UNIQUE,
    clabe_interbancaria VARCHAR(18),
    banco VARCHAR(100),
    verificado BOOLEAN DEFAULT FALSE,
    INDEX idx_propietario_rfc (curp_rfc),
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Estados: catálogo de entidades federativas (normaliza direcciones por estado).
CREATE TABLE Estados (
    id_estado INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    codigo_iso VARCHAR(2) UNIQUE,
    INDEX idx_estados_nombre (nombre)
) ENGINE=InnoDB;

-- Municipios: municipios o localidades dentro de un estado.
-- Usada por sucursales, proveedores y direcciones de clientes.
CREATE TABLE Municipios (
    id_municipio INT AUTO_INCREMENT PRIMARY KEY,
    id_estado INT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    INDEX idx_municipios_estado (id_estado),
    INDEX idx_municipios_nombre (nombre),
    FOREIGN KEY (id_estado) REFERENCES Estados(id_estado) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- Mueblerias: entidad comercial o marca que opera sucursales.
-- Contiene datos fiscales y de contacto generales de la empresa.
CREATE TABLE Mueblerias (
    id_muebleria INT AUTO_INCREMENT PRIMARY KEY,
    nombre_negocio VARCHAR(150) NOT NULL,
    id_propietario INT NOT NULL,
    razon_social VARCHAR(200) NOT NULL,
    rfc VARCHAR(13) NOT NULL UNIQUE,
    direccion_principal TEXT NOT NULL,
    telefono VARCHAR(20),
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_mueblerias_propietario (id_propietario),
    INDEX idx_mueblerias_nombre (nombre_negocio),
    FOREIGN KEY (id_propietario) REFERENCES Propietario(id_usuario) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- Sucursales: puntos de venta, talleres o bodegas pertenecientes a una mueblería.
-- Aquí se asocian inventarios, producciones y personal.
CREATE TABLE Sucursales (
    id_sucursal INT AUTO_INCREMENT PRIMARY KEY,
    id_muebleria INT NOT NULL,
    nombre_sucursal VARCHAR(150) NOT NULL,
    calle_numero TEXT NOT NULL,
    id_municipio INT NOT NULL,
    telefono VARCHAR(20),
    horario JSON,
    activo BOOLEAN DEFAULT TRUE,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_sucursales_muebleria (id_muebleria),
    INDEX idx_sucursales_municipio (id_municipio),
    INDEX idx_sucursales_activa (activo),
    FOREIGN KEY (id_muebleria) REFERENCES Mueblerias(id_muebleria) ON DELETE CASCADE,
    FOREIGN KEY (id_municipio) REFERENCES Municipios(id_municipio) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- Cliente: extensión de usuarios con datos propios de clientes (dirección, teléfono, puntos).
CREATE TABLE Cliente (
    id_usuario INT PRIMARY KEY,
    telefono VARCHAR(20),
    id_municipio_default INT,
    direccion_principal TEXT,
    puntos INT DEFAULT 0,
    INDEX idx_cliente_municipio (id_municipio_default),
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_municipio_default) REFERENCES Municipios(id_municipio) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Empleado: extensión de usuarios para empleados. Incluye información de sucursal y comisiones.
CREATE TABLE Empleado (
    id_usuario INT PRIMARY KEY,
    id_sucursal INT NOT NULL,
    puesto VARCHAR(100),
    fecha_ingreso DATE,
    activo BOOLEAN DEFAULT TRUE,
    es_vendedor BOOLEAN DEFAULT FALSE,
    codigo_vendedor VARCHAR(20) UNIQUE,
    comision_pct DECIMAL(5,2) DEFAULT 0.00,
    INDEX idx_empleado_sucursal (id_sucursal),
    INDEX idx_empleado_vendedor (es_vendedor),
    INDEX idx_empleado_codigo (codigo_vendedor),
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_sucursal) REFERENCES Sucursales(id_sucursal) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- ------------------------- PRODUCTOS Y MATERIAS PRIMAS -------------------------

-- Productos: catálogo de productos terminados y ensamblados. Contiene precio y dimensiones.
CREATE TABLE Productos (
    id_producto INT AUTO_INCREMENT PRIMARY KEY,
    sku VARCHAR(50) NOT NULL UNIQUE,
    id_muebleria INT NOT NULL,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    categoria VARCHAR(100),
    unidad_medida VARCHAR(20) DEFAULT 'pieza',
    imagen_url TEXT,
    precio_venta DECIMAL(10,2) NOT NULL,
    peso_kg DECIMAL(8,2),
    volumen_m3 DECIMAL(8,2),
    tipo_producto ENUM('materia_prima','ensamblado','producto_final') DEFAULT 'producto_final',
    color VARCHAR(50),
    material VARCHAR(100),
    medidas VARCHAR(100),
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_productos_muebleria (id_muebleria),
    INDEX idx_productos_categoria (categoria),
    INDEX idx_productos_tipo (tipo_producto),
    INDEX idx_productos_sku (sku),
    FOREIGN KEY (id_muebleria) REFERENCES Mueblerias(id_muebleria) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Materias_Primas: materiales necesarios para fabricar productos (BOM).
-- Se controla precio y proveedor preferente.
CREATE TABLE Materias_Primas (
    id_materia INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(50) NOT NULL UNIQUE,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    unidad_medida VARCHAR(20) NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    proveedor_preferente INT,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_mp_codigo (codigo),
    INDEX idx_mp_proveedor (proveedor_preferente),
    FOREIGN KEY (proveedor_preferente) REFERENCES Proveedores(id_proveedor) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Proveedores: lista de proveedores (materia prima, productos o servicios).
-- Asociados a un municipio para logística y tiempos de entrega.
CREATE TABLE Proveedores (
    id_proveedor INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    contacto_nombre VARCHAR(100),
    contacto_email VARCHAR(100),
    telefono VARCHAR(20),
    id_municipio INT,
    direccion TEXT,
    rfc VARCHAR(13),
    cuenta_bancaria VARCHAR(18),
    tiempo_entrega_dias INT DEFAULT 7,
    tipo_proveedor ENUM('materia_prima','producto','servicio') DEFAULT 'producto',
    INDEX idx_proveedores_municipio (id_municipio),
    INDEX idx_proveedores_tipo (tipo_proveedor),
    FOREIGN KEY (id_municipio) REFERENCES Municipios(id_municipio) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ------------------------- INVENTARIOS -------------------------

-- Inventario: stock de productos por sucursal. Campo 'reservado' para pedidos en proceso.
CREATE TABLE Inventario (
    id_inventario INT AUTO_INCREMENT PRIMARY KEY,
    id_sucursal INT NOT NULL,
    id_producto INT NOT NULL,
    cantidad INT NOT NULL DEFAULT 0,
    reservado INT NOT NULL DEFAULT 0,
    stock_min INT DEFAULT 5,
    stock_max INT DEFAULT 100,
    ultimo_movimiento TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_inventario_sucursal_producto (id_sucursal, id_producto),
    INDEX idx_inventario_sucursal (id_sucursal),
    INDEX idx_inventario_producto (id_producto),
    FOREIGN KEY (id_sucursal) REFERENCES Sucursales(id_sucursal) ON DELETE CASCADE,
    FOREIGN KEY (id_producto) REFERENCES Productos(id_producto) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Inventario_MP: stock de materias primas por sucursal, para consumo en producción.
CREATE TABLE Inventario_MP (
    id_inventario_mp INT AUTO_INCREMENT PRIMARY KEY,
    id_sucursal INT NOT NULL,
    id_materia INT NOT NULL,
    cantidad DECIMAL(12,3) NOT NULL DEFAULT 0.000,
    stock_min DECIMAL(12,3) DEFAULT 1.000,
    stock_max DECIMAL(12,3) DEFAULT 1000.000,
    ultimo_movimiento TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_inventario_mp_sucursal_materia (id_sucursal, id_materia),
    INDEX idx_inventario_mp_sucursal (id_sucursal),
    INDEX idx_inventario_mp_materia (id_materia),
    FOREIGN KEY (id_sucursal) REFERENCES Sucursales(id_sucursal) ON DELETE CASCADE,
    FOREIGN KEY (id_materia) REFERENCES Materias_Primas(id_materia) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ------------------------- VENTAS Y PEDIDOS -------------------------

-- Direcciones_Envio: direcciones de clientes referenciadas por municipio.
CREATE TABLE Direcciones_Envio (
    id_direccion INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT NOT NULL,
    calle_numero TEXT NOT NULL,
    id_municipio INT NOT NULL,
    referencias TEXT,
    INDEX idx_direcciones_cliente (id_cliente),
    INDEX idx_direcciones_municipio (id_municipio),
    FOREIGN KEY (id_cliente) REFERENCES Cliente(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_municipio) REFERENCES Municipios(id_municipio) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- Pedidos: órdenes creadas por clientes; enlaza cliente, dirección y sucursal que procesa pedido.
CREATE TABLE Pedidos (
    id_pedido INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT NOT NULL,
    id_direccion INT,
    fecha_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tipo_entrega ENUM('recoger_tienda','envio_domicilio') DEFAULT 'envio_domicilio',
    id_sucursal_origen INT,
    estado_pedido ENUM('pendiente','confirmado','preparando','enviado','entregado','cancelado') DEFAULT 'pendiente',
    total DECIMAL(10,2) NOT NULL,
    INDEX idx_pedidos_cliente (id_cliente),
    INDEX idx_pedidos_direccion (id_direccion),
    INDEX idx_pedidos_sucursal (id_sucursal_origen),
    INDEX idx_pedidos_estado (estado_pedido),
    FOREIGN KEY (id_cliente) REFERENCES Cliente(id_usuario) ON DELETE RESTRICT,
    FOREIGN KEY (id_direccion) REFERENCES Direcciones_Envio(id_direccion) ON DELETE SET NULL,
    FOREIGN KEY (id_sucursal_origen) REFERENCES Sucursales(id_sucursal) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Metodo_Pago: catálogo de métodos de pago y configuraciones asociadas.
CREATE TABLE Metodo_Pago (
    id_metodo INT AUTO_INCREMENT PRIMARY KEY,
    tipo_pago VARCHAR(50) NOT NULL,
    detalles_pago JSON,
    estado_pago VARCHAR(20) DEFAULT 'activo'
) ENGINE=InnoDB;

-- Cupones: códigos promocionales aplicables en el checkout.
CREATE TABLE Cupones (
    id_cupon INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(20) NOT NULL UNIQUE,
    descuento_porcentaje DECIMAL(5,2) NOT NULL,
    fecha_expiracion DATE,
    activo BOOLEAN DEFAULT TRUE,
    INDEX idx_cupones_codigo (codigo),
    INDEX idx_cupones_activo (activo)
) ENGINE=InnoDB;

-- Venta: registro financiero de la transacción (checkout). Puede estar ligada a pedido y vendedor.
CREATE TABLE Venta (
    id_venta INT AUTO_INCREMENT PRIMARY KEY,
    id_pedido INT,
    id_cliente INT NOT NULL,
    id_metodo_pago INT,
    id_cupon INT,
    id_vendedor INT,
    fecha_venta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    sub_total DECIMAL(10,2) NOT NULL,
    descuento DECIMAL(10,2) DEFAULT 0.00,
    total_venta DECIMAL(10,2) NOT NULL,
    comision DECIMAL(10,2) DEFAULT 0.00,
    estado_venta VARCHAR(20) DEFAULT 'completada',
    INDEX idx_ventas_pedido (id_pedido),
    INDEX idx_ventas_cliente (id_cliente),
    INDEX idx_ventas_vendedor (id_vendedor),
    INDEX idx_ventas_fecha (fecha_venta),
    FOREIGN KEY (id_pedido) REFERENCES Pedidos(id_pedido) ON DELETE SET NULL,
    FOREIGN KEY (id_cliente) REFERENCES Cliente(id_usuario) ON DELETE RESTRICT,
    FOREIGN KEY (id_metodo_pago) REFERENCES Metodo_Pago(id_metodo) ON DELETE SET NULL,
    FOREIGN KEY (id_cupon) REFERENCES Cupones(id_cupon) ON DELETE SET NULL,
    FOREIGN KEY (id_vendedor) REFERENCES Empleado(id_usuario) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Detalle_Venta: líneas de venta (productos vendidos y cantidades).
CREATE TABLE Detalle_Venta (
    id_detalle_venta INT AUTO_INCREMENT PRIMARY KEY,
    id_venta INT NOT NULL,
    id_producto INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    INDEX idx_detalle_venta_venta (id_venta),
    INDEX idx_detalle_venta_producto (id_producto),
    FOREIGN KEY (id_venta) REFERENCES Venta(id_venta) ON DELETE CASCADE,
    FOREIGN KEY (id_producto) REFERENCES Productos(id_producto) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- ------------------------- TABLAS ADICIONALES -------------------------

-- Lista de Deseos (para clientes)
CREATE TABLE Lista_Deseos (
    id_deseo INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT NOT NULL,
    id_producto INT NOT NULL,
    fecha_agregado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_lista_deseos_cliente_producto (id_cliente, id_producto),
    INDEX idx_lista_deseos_cliente (id_cliente),
    INDEX idx_lista_deseos_producto (id_producto),
    FOREIGN KEY (id_cliente) REFERENCES Cliente(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_producto) REFERENCES Productos(id_producto) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Carrito de Compras (temporal, puede ser en sesión o tabla)
CREATE TABLE Carrito_Compras (
    id_carrito INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT,
    session_id VARCHAR(255),
    id_producto INT NOT NULL,
    cantidad INT NOT NULL DEFAULT 1,
    fecha_agregado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_carrito_cliente (id_cliente),
    INDEX idx_carrito_session (session_id),
    INDEX idx_carrito_producto (id_producto),
    FOREIGN KEY (id_cliente) REFERENCES Cliente(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_producto) REFERENCES Productos(id_producto) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ------------------------- INSERCIÓN DE DATOS INICIALES -------------------------

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

-- Insertar algunos municipios clave (ejemplo para Ciudad de México, Estado de México y Jalisco)
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

-- Crear directorios para imágenes (esto se debe hacer a nivel de sistema de archivos)
-- NOTA: Estos comandos deben ejecutarse en el servidor:
-- mkdir -p assets/images/mueblerias/1/logos
-- mkdir -p assets/images/mueblerias/1/productos
-- mkdir -p assets/images/mueblerias/2/logos
-- mkdir -p assets/images/mueblerias/2/productos
-- mkdir -p assets/images/mueblerias/3/logos
-- mkdir -p assets/images/mueblerias/3/productos

COMMIT;
