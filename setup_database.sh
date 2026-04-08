#!/bin/bash

echo "🗄️  Configuración de Base de Datos para MuebleClick"
echo "============================================"

# Verificar si MySQL está corriendo
if ! pgrep -x "mysqld" > /dev/null; then
    echo "❌ MySQL no está corriendo. Por favor inicia MySQL primero."
    exit 1
fi

echo "✅ MySQL está corriendo"

# Crear base de datos
echo "📝 Creando base de datos 'muebleclick'..."
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS muebleclick;"

# Importar estructura de tablas
echo "📋 Creando estructura de tablas..."
mysql -u root -p muebleclick < database/crear_base_datos.sql

# Insertar datos de prueba
echo "📦 Insertando datos de prueba..."
mysql -u root -p muebleclick < database/cargar_datos_prueba.sql

echo ""
echo "✅ Base de datos configurada exitosamente!"
echo ""
echo "🔍 Para verificar la instalación:"
echo "mysql -u root -p muebleclick"
echo "SHOW TABLES;"
echo ""
echo "🚀 Para iniciar el servidor backend:"
echo "php -S localhost:8000 server.php"
echo ""
echo "🌐 Luego inicia el frontend React:"
echo "npm start"
