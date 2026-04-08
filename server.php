<?php
// Servidor backend para MuebleClick
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once 'database/config.php';

// Obtener la ruta de la solicitud
$request_uri = $_SERVER['REQUEST_URI'];
$method = $_SERVER['REQUEST_METHOD'];

// Eliminar query string de la URI
$request_uri = explode('?', $request_uri)[0];

// Enrutamiento básico
switch ($request_uri) {
    case '/api/mueblerias':
        handleMueblerias($method);
        break;
    
    case '/api/productos':
        handleProductos($method);
        break;
    
    default:
        // Para rutas con parámetros (ej: /api/mueblerias/1)
        if (preg_match('/\/api\/mueblerias\/(\d+)/', $request_uri, $matches)) {
            handleMuebleriaDetail($method, $matches[1]);
        } elseif (preg_match('/\/api\/productos\/muebleria\/(\d+)/', $request_uri, $matches)) {
            handleProductosByMuebleria($method, $matches[1]);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Ruta no encontrada']);
        }
        break;
}

function handleMueblerias($method) {
    $database = new Database();
    $db = $database->connect();

    try {
        if ($method === 'GET') {
            $query = "
                SELECT m.*, 
                       COUNT(p.id_producto) as total_productos,
                       COUNT(DISTINCT s.id_sucursal) as num_sucursales
                FROM Mueblerias m
                LEFT JOIN Productos p ON m.id_muebleria = p.id_muebleria
                LEFT JOIN Sucursales s ON m.id_muebleria = s.id_muebleria
                GROUP BY m.id_muebleria
                ORDER BY m.nombre_negocio
            ";
            
            $stmt = $db->prepare($query);
            $stmt->execute();
            $mueblerias = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Convertir a números los campos que vienen como strings
            foreach ($mueblerias as &$muebleria) {
                $muebleria['total_productos'] = (int)$muebleria['total_productos'];
                $muebleria['num_sucursales'] = (int)$muebleria['num_sucursales'];
            }

            echo json_encode([
                'success' => true,
                'data' => $mueblerias
            ]);
        }
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => 'Error en la consulta: ' . $e->getMessage()
        ]);
    }
}

function handleMuebleriaDetail($method, $id) {
    $database = new Database();
    $db = $database->connect();

    try {
        if ($method === 'GET') {
            $query = "
                SELECT m.*, 
                       COUNT(p.id_producto) as total_productos,
                       COUNT(DISTINCT s.id_sucursal) as num_sucursales
                FROM Mueblerias m
                LEFT JOIN Productos p ON m.id_muebleria = p.id_muebleria
                LEFT JOIN Sucursales s ON m.id_muebleria = s.id_muebleria
                WHERE m.id_muebleria = :id
                GROUP BY m.id_muebleria
            ";
            
            $stmt = $db->prepare($query);
            $stmt->bindParam(':id', $id);
            $stmt->execute();
            $muebleria = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($muebleria) {
                $muebleria['total_productos'] = (int)$muebleria['total_productos'];
                $muebleria['num_sucursales'] = (int)$muebleria['num_sucursales'];
                
                echo json_encode([
                    'success' => true,
                    'data' => $muebleria
                ]);
            } else {
                http_response_code(404);
                echo json_encode([
                    'success' => false,
                    'error' => 'Mueblería no encontrada'
                ]);
            }
        }
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => 'Error en la consulta: ' . $e->getMessage()
        ]);
    }
}

function handleProductosByMuebleria($method, $id_muebleria) {
    $database = new Database();
    $db = $database->connect();

    try {
        if ($method === 'GET') {
            // Obtener parámetros de filtrado
            $categoria = $_GET['categoria'] ?? '';
            $ordenar = $_GET['ordenar'] ?? 'nombre';
            $precio_min = $_GET['precio_min'] ?? 0;
            $precio_max = $_GET['precio_max'] ?? 999999;

            // Construir consulta base
            $query = "
                SELECT p.*, i.stock_actual
                FROM Productos p
                LEFT JOIN Inventario i ON p.id_producto = i.id_producto
                WHERE p.id_muebleria = :id_muebleria
            ";

            $params = [':id_muebleria' => $id_muebleria];

            // Agregar filtros
            if (!empty($categoria)) {
                $query .= " AND p.categoria = :categoria";
                $params[':categoria'] = $categoria;
            }

            if ($precio_min > 0) {
                $query .= " AND p.precio_venta >= :precio_min";
                $params[':precio_min'] = $precio_min;
            }

            if ($precio_max < 999999) {
                $query .= " AND p.precio_venta <= :precio_max";
                $params[':precio_max'] = $precio_max;
            }

            // Agregar ordenamiento
            switch ($ordenar) {
                case 'precio_asc':
                    $query .= " ORDER BY p.precio_venta ASC";
                    break;
                case 'precio_desc':
                    $query .= " ORDER BY p.precio_venta DESC";
                    break;
                default:
                    $query .= " ORDER BY p.nombre ASC";
            }

            $stmt = $db->prepare($query);
            foreach ($params as $key => $value) {
                $stmt->bindValue($key, $value);
            }
            $stmt->execute();
            $productos = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Obtener categorías únicas
            $categorias_query = "
                SELECT DISTINCT categoria 
                FROM Productos 
                WHERE id_muebleria = :id_muebleria AND categoria IS NOT NULL AND categoria != ''
                ORDER BY categoria
            ";
            $stmt = $db->prepare($categorias_query);
            $stmt->bindParam(':id_muebleria', $id_muebleria);
            $stmt->execute();
            $categorias = $stmt->fetchAll(PDO::FETCH_COLUMN);

            echo json_encode([
                'success' => true,
                'data' => $productos,
                'categorias' => $categorias
            ]);
        }
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => 'Error en la consulta: ' . $e->getMessage()
        ]);
    }
}

function handleProductos($method) {
    $database = new Database();
    $db = $database->connect();

    try {
        if ($method === 'GET') {
            $query = "
                SELECT p.*, m.nombre_negocio as muebleria_nombre
                FROM Productos p
                JOIN Mueblerias m ON p.id_muebleria = m.id_muebleria
                ORDER BY p.nombre
            ";
            
            $stmt = $db->prepare($query);
            $stmt->execute();
            $productos = $stmt->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode([
                'success' => true,
                'data' => $productos
            ]);
        }
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => 'Error en la consulta: ' . $e->getMessage()
        ]);
    }
}
?>
