<?php
/**
 * ========================================
 * CONFIGURACIÓN DE CONEXIÓN A BASE DE DATOS
 * ========================================
 * 
 * MODIFICA ESTOS VALORES SEGÚN TU CONFIGURACIÓN:
 */

// HOST/SERVIDOR de la base de datos
define('DB_HOST', 'localhost');     // Cambiar si tu MySQL está en otro servidor

// NOMBRE de la base de datos
define('DB_NAME', 'muebles');      // Nombre que se creará en MySQL

// USUARIO de MySQL
define('DB_USER', 'root');           // Tu usuario MySQL

// CONTRASEÑA de MySQL
define('DB_PASS', '1234');         // Tu contraseña de MySQL

// CHARSET para caracteres especiales (utf8mb4 recomendado)
define('DB_CHARSET', 'utf8mb4');

/**
 * ========================================
 * CLASE DE CONEXIÓN (NO MODIFICAR ABAJO)
 * ========================================
 */

class Database {
    private $host = DB_HOST;
    private $db_name = DB_NAME;
    private $username = DB_USER;
    private $password = DB_PASS;
    private $charset = DB_CHARSET;
    private $conn;

    public function connect() {
        $this->conn = null;

        try {
            // Cadena de conexión DSN
            $dsn = "mysql:host=" . $this->host . 
                   ";dbname=" . $this->db_name . 
                   ";charset=" . $this->charset;

            // Opciones de PDO
            $options = [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ];

            // Crear conexión
            $this->conn = new PDO($dsn, $this->username, $this->password, $options);
            
            return $this->conn;

        } catch(PDOException $e) {
            // Mostrar error detallado para debugging
            die("❌ ERROR DE CONEXIÓN A LA BASE DE DATOS:<br>" .
                "Host: " . $this->host . "<br>" .
                "Base de datos: " . $this->db_name . "<br>" .
                "Usuario: " . $this->username . "<br>" .
                "Error: " . $e->getMessage());
        }
    }

    /**
     * Verificar conexión
     */
    public function testConnection() {
        try {
            $conn = $this->connect();
            if ($conn) {
                echo "✅ Conexión exitosa!<br>";
                echo "📍 Host: " . $this->host . "<br>";
                echo "🗄️ Base de datos: " . $this->db_name . "<br>";
                echo "👤 Usuario: " . $this->username . "<br>";
                
                // Probar consulta simple
                $result = $conn->query("SELECT VERSION() as version");
                $row = $result->fetch();
                echo "🔧 Versión MySQL: " . $row['version'] . "<br>";
                
                return true;
            }
        } catch(Exception $e) {
            echo "❌ Error: " . $e->getMessage() . "<br>";
            return false;
        }
    }
}

/**
 * ========================================
 * PRUEBA DE CONEXIÓN (Ejecutar este archivo directamente)
 * ========================================
 */

// Si se ejecuta este archivo directamente, hacer prueba de conexión
if (basename($_SERVER['PHP_SELF']) === 'conexion_config.php') {
    echo "<h2>🔍 PRUEBA DE CONEXIÓN A BASE DE DATOS</h2>";
    echo "<hr>";
    
    $database = new Database();
    $database->testConnection();
    
    echo "<hr>";
    echo "<h3>📋 CONFIGURACIÓN ACTUAL:</h3>";
    echo "<table border='1' cellpadding='10'>";
    echo "<tr><td><strong>Host:</strong></td><td>" . DB_HOST . "</td></tr>";
    echo "<tr><td><strong>Base de datos:</strong></td><td>" . DB_NAME . "</td></tr>";
    echo "<tr><td><strong>Usuario:</strong></td><td>" . DB_USER . "</td></tr>";
    echo "<tr><td><strong>Contraseña:</strong></td><td>" . (empty(DB_PASS) ? '(vacía)' : '***') . "</td></tr>";
    echo "</table>";
    
    echo "<hr>";
    echo "<h3>🔧 PASOS PARA CONFIGURAR:</h3>";
    echo "<ol>";
    echo "<li>Verifica que MySQL esté corriendo</li>";
    echo "<li>Modifica las constantes DB_HOST, DB_NAME, DB_USER, DB_PASS</li>";
    echo "<li>Crea la base de datos: <code>CREATE DATABASE IF NOT EXISTS muebleclick;</code></li>";
    echo "<li>Importa las tablas: <code>mysql -u " . DB_USER . " -p " . DB_NAME . " < database/crear_base_datos.sql</code></li>";
    echo "<li>Prueba esta conexión nuevamente</li>";
    echo "</ol>";
}

?>
