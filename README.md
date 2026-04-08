# MuebleClick - Plataforma de Muebles en React + TypeScript

Una plataforma web moderna para la comercialización de muebles, construida con React, TypeScript, Bootstrap 5 y MariaDB.

## 🚀 Características

- **Catálogo de Mueblerías**: Explora diferentes tiendas de muebles
- **Sistema de Autenticación**: Registro e inicio de sesión de usuarios
- **Carrito de Compras**: Gestiona tus productos seleccionados
- **Lista de Deseos**: Guarda tus productos favoritos
- **Catálogo de Productos**: Navega por productos con filtros y ordenamiento
- **Diseño Responsivo**: Compatible con dispositivos móviles y desktop
- **Tipado Seguro**: Implementado con TypeScript
- **Backend API**: Conexión a base de datos MariaDB

## 🛠️ Tecnologías

### Frontend
- **React 18** - Librería principal de UI
- **TypeScript** - Tipado estático
- **React Router** - Navegación entre páginas
- **React Bootstrap** - Componentes UI
- **React Hot Toast** - Notificaciones
- **Zustand** - Manejo de estado
- **Axios** - Cliente HTTP

### Backend (API)
- **PHP** - Servidor backend
- **MariaDB** - Base de datos
- **PDO** - Conexión a base de datos

## 📁 Estructura del Proyecto

```
MuebleClick/
├── public/                 # Archivos estáticos
│   └── index.html        # Template HTML principal
├── src/                   # Código fuente React
│   ├── components/        # Componentes reutilizables
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── ProtectedRoute.tsx
│   ├── contexts/          # Contextos de React
│   │   ├── AuthContext.tsx
│   │   └── CartContext.tsx
│   ├── pages/             # Páginas principales
│   │   ├── Home.tsx
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── Profile.tsx
│   │   ├── Cart.tsx
│   │   ├── Wishlist.tsx
│   │   └── MuebleriaDetail.tsx
│   ├── services/          # Servicios API
│   │   └── api.ts
│   ├── types/             # Definiciones TypeScript
│   │   └── index.ts
│   ├── App.tsx            # Componente principal
│   ├── App.css            # Estilos de la aplicación
│   ├── index.css          # Estilos globales
│   └── index.tsx          # Punto de entrada
├── config/                # Configuración PHP
│   └── database.php      # Conexión a base de datos
├── database/              # Scripts SQL
│   └── crear_base_datos.sql
├── includes/              # Funciones PHP
│   └── functions.php
├── importar/              # Scripts de importación
│   ├── README.md
│   ├── importar_mueblerias.php
│   └── importar_productos.php
├── assets/                # Recursos estáticos
│   └── images/
├── package.json           # Dependencias npm
├── tsconfig.json         # Configuración TypeScript
└── README.md             # Este archivo
```

## 🚀 Instalación y Ejecución

### Prerrequisitos
- Node.js 16+ 
- npm o yarn
- MariaDB/MySQL
- Servidor web con PHP (Apache, Nginx)

### 1. Configurar la Base de Datos

```bash
# Crear la base de datos
mysql -u root -p
CREATE DATABASE muebleclick;

# Importar la estructura y datos iniciales
mysql -u root -p muebleclick < database/crear_base_datos.sql
```

### 2. Configurar el Backend PHP

1. Configurar el servidor web para que apunte al directorio del proyecto
2. Asegurarse que las extensiones de PHP necesarias estén habilitadas:
   - php-pdo_mysql
   - php-mbstring
   - php-json

### 3. Instalar Dependencias del Frontend

```bash
# Instalar dependencias
npm install

# Iniciar el servidor de desarrollo
npm start
```

La aplicación estará disponible en `http://localhost:3000`

### 4. Importar Datos de Ejemplo

```bash
# Importar datos de mueblerías
php importar/importar_mueblerias.php

# Importar datos de productos
php importar/importar_productos.php
```

## 📱 Uso de la Aplicación

### Flujo Principal

1. **Inicio**: Explora las mueblerías disponibles
2. **Catálogo**: Haz clic en una mueblería para ver sus productos
3. **Autenticación**: Regístrate o inicia sesión para acceder a todas las funciones
4. **Carrito**: Agrega productos al carrito de compras
5. **Lista de Deseos**: Guarda productos para comprar después
6. **Perfil**: Gestiona tu información personal

### Características del Usuario

- **Navegación**: Explora mueblerías y productos
- **Búsqueda**: Filtra productos por categoría, precio, color, material
- **Carrito**: Gestiona cantidades y aplica cupones
- **Deseos**: Mueve productos de deseos al carrito
- **Perfil**: Actualiza tu información personal

## 🔧 Configuración

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# Configuración de la base de datos
DB_HOST=localhost
DB_NAME=muebleclick
DB_USER=root
DB_PASSWORD=

# URL de la API
REACT_APP_API_URL=http://localhost:8000/api
```

### Configuración de Base de Datos

Modifica `config/database.php` para ajustar los parámetros de conexión:

```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'muebleclick');
define('DB_USER', 'root');
define('DB_PASSWORD', '');
define('DB_CHARSET', 'utf8mb4');
```

## 📊 Modelo de Datos

La aplicación utiliza las siguientes tablas principales:

- **Usuarios**: Información de clientes y administradores
- **Mueblerias**: Datos de las tiendas de muebles
- **Productos**: Catálogo de productos con precios y especificaciones
- **Inventario**: Control de stock por sucursal
- **Pedidos**: Gestión de órdenes de compra
- **Ventas**: Registro de transacciones completadas

## 🎨 Personalización

### Estilos

Los estilos principales están en:
- `src/index.css` - Estilos globales y variables
- `src/App.css` - Estilos específicos de componentes

### Componentes

Los componentes React están organizados por función:
- `components/` - Componentes reutilizables
- `pages/` - Páginas principales
- `contexts/` - Manejo de estado global

## 🔒 Seguridad

- **Autenticación**: Sistema de login/registro seguro
- **CSRF**: Protección contra ataques CSRF
- **Validación**: Validación de datos en frontend y backend
- **SQL Injection**: Uso de sentencias preparadas

## 🚀 Despliegue

### Producción

```bash
# Construir para producción
npm run build

# Los archivos optimizados estarán en la carpeta build/
```

### Consideraciones de Despliegue

1. Configurar variables de entorno de producción
2. Asegurar conexión HTTPS
3. Configurar CORS para la API
4. Optimizar imágenes y recursos estáticos
5. Configurar caché apropiadamente

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama de características (`git checkout -b feature/amazing-feature`)
3. Commit tus cambios (`git commit -m 'Add amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - mira el archivo [LICENSE](LICENSE) para detalles.

## 🆘 Soporte

Si encuentras algún problema o tienes sugerencias:

1. Revisa la sección de [Issues](../../issues)
2. Crea un nuevo issue describiendo el problema
3. Proporciona screenshots y pasos para reproducir

## 🙏 Agradecimientos

- React团队 por la increíble librería
- Bootstrap por el framework CSS
- La comunidad de código abierto

---

**MuebleClick** - Tu plataforma de confianza para encontrar los mejores muebles 🪑
