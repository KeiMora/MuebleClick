#!/bin/bash

echo "🗄️  Configuración de Base de Datos para MuebleClick"
echo "============================================"
echo "📋 Configuración:"
echo "   Host: localhost"
echo "   Base de datos: muebles"
echo "   Usuario: sa"
echo "   Contraseña: 1234"
echo ""

# Verificar si MySQL está corriendo
if ! pgrep -x "mysqld" > /dev/null; then
    echo "❌ MySQL no está corriendo. Por favor inicia MySQL primero."
    echo "   macOS: brew services start mysql"
    echo "   Linux: sudo systemctl start mysql"
    exit 1
fi

echo "✅ MySQL está corriendo"

# Probar conexión con tus credenciales
echo "🔍 Probando conexión con tus credenciales..."
mysql -u sa -p1234 -e "SELECT 'Conexión exitosa' as mensaje;" 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✅ Conexión a MySQL exitosa con usuario 'sa'"
else
    echo "❌ Error de conexión con usuario 'sa' y contraseña '1234'"
    echo "   Verifica que el usuario 'sa' exista y tenga la contraseña correcta"
    echo "   Para crear el usuario:"
    echo "   CREATE USER 'sa'@'localhost' IDENTIFIED BY '1234';"
    echo "   GRANT ALL PRIVILEGES ON *.* TO 'sa'@'localhost';"
    echo "   FLUSH PRIVILEGES;"
    exit 1
fi

# Crear base de datos
echo "📝 Creando base de datos 'muebles'..."
mysql -u sa -p1234 -e "CREATE DATABASE IF NOT EXISTS muebles CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci;"

if [ $? -eq 0 ]; then
    echo "✅ Base de datos 'muebles' creada exitosamente"
else
    echo "❌ Error al crear la base de datos"
    exit 1
fi

# Importar estructura de tablas
echo "📋 Creando estructura de tablas..."
mysql -u sa -p1234 muebles < database/crear_base_datos.sql

if [ $? -eq 0 ]; then
    echo "✅ Estructura de tablas creada exitosamente"
else
    echo "❌ Error al crear la estructura de tablas"
    exit 1
fi

# Insertar datos de prueba
echo "📦 Insertando datos de prueba..."
mysql -u sa -p1234 muebles < database/cargar_datos_prueba.sql

if [ $? -eq 0 ]; then
    echo "✅ Datos de prueba insertados exitosamente"
else
    echo "❌ Error al insertar datos de prueba"
    exit 1
fi

echo ""
echo "🎉 ¡Configuración completada exitosamente!"
echo ""
echo "🔍 Para verificar la instalación:"
echo "mysql -u sa -p1234 muebles"
echo "SHOW TABLES;"
echo ""
echo "🚀 Para iniciar el servidor backend:"
echo "php -S localhost:8000 server.php"
echo ""
echo "🌐 Luego inicia el frontend React:"
echo "npm start"
echo ""
echo "📱 La aplicación estará disponible en:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:8000/api/mueblerias"
