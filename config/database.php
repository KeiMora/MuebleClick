<?php
// Configuración de la base de datos
define('DB_HOST', 'localhost');
define('DB_NAME', 'muebleclick');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_CHARSET', 'utf8mb4');

// Conexión a la base de datos MariaDB
try {
    $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];
    
    $conn = new PDO($dsn, DB_USER, DB_PASS, $options);
    
} catch (PDOException $e) {
    // En producción, registrar el error y mostrar un mensaje genérico
    error_log("Error de conexión a la base de datos: " . $e->getMessage());
    
    // Mostrar página de error amigable
    die("
    <!DOCTYPE html>
    <html lang='es'>
    <head>
        <meta charset='UTF-8'>
        <meta name='viewport' content='width=device-width, initial-scale=1.0'>
        <title>Error de Conexión - MuebleClick</title>
        <link href='https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css' rel='stylesheet'>
    </head>
    <body class='bg-light'>
        <div class='container mt-5'>
            <div class='row justify-content-center'>
                <div class='col-md-6'>
                    <div class='card shadow'>
                        <div class='card-body text-center'>
                            <i class='bi bi-exclamation-triangle text-warning' style='font-size: 4rem;'></i>
                            <h3 class='mt-3'>Error de Conexión</h3>
                            <p class='text-muted'>No podemos conectar con la base de datos en este momento.</p>
                            <p class='text-muted'>Por favor, inténtalo de nuevo más tarde.</p>
                            <a href='index.php' class='btn btn-primary'>Volver al Inicio</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </body>
    </html>
    ");
}

// Función para ejecutar consultas preparadas
function ejecutarConsulta($sql, $params = []) {
    global $conn;
    try {
        $stmt = $conn->prepare($sql);
        $stmt->execute($params);
        return $stmt;
    } catch (PDOException $e) {
        error_log("Error en consulta: " . $e->getMessage());
        return false;
    }
}

// Función para obtener un solo registro
function obtenerRegistro($sql, $params = []) {
    $stmt = ejecutarConsulta($sql, $params);
    return $stmt ? $stmt->fetch() : false;
}

// Función para obtener múltiples registros
function obtenerRegistros($sql, $params = []) {
    $stmt = ejecutarConsulta($sql, $params);
    return $stmt ? $stmt->fetchAll() : [];
}

// Función para insertar registros
function insertarRegistro($sql, $params = []) {
    global $conn;
    try {
        $stmt = $conn->prepare($sql);
        $stmt->execute($params);
        return $conn->lastInsertId();
    } catch (PDOException $e) {
        error_log("Error al insertar: " . $e->getMessage());
        return false;
    }
}

// Función para actualizar registros
function actualizarRegistro($sql, $params = []) {
    $stmt = ejecutarConsulta($sql, $params);
    return $stmt ? $stmt->rowCount() : false;
}

// Función para eliminar registros
function eliminarRegistro($sql, $params = []) {
    $stmt = ejecutarConsulta($sql, $params);
    return $stmt ? $stmt->rowCount() : false;
}

// Función para verificar si existe un registro
function existeRegistro($sql, $params = []) {
    $stmt = ejecutarConsulta($sql, $params);
    return $stmt ? $stmt->fetchColumn() > 0 : false;
}
?>
