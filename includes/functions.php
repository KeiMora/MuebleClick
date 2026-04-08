<?php
// Funciones generales del sistema

// Función para limpiar y sanitizar datos de entrada
function limpiarDatos($dato) {
    $dato = trim($dato);
    $dato = stripslashes($dato);
    $dato = htmlspecialchars($dato, ENT_QUOTES, 'UTF-8');
    return $dato;
}

// Función para validar email
function validarEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

// Función para generar token CSRF
function generarTokenCSRF() {
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

// Función para verificar token CSRF
function verificarTokenCSRF($token) {
    return isset($_SESSION['csrf_token']) && hash_equals($_SESSION['csrf_token'], $token);
}

// Función para formatear precio
function formatearPrecio($precio) {
    return '$' . number_format($precio, 2, '.', ',');
}

// Función para obtener mueblerías activas
function obtenerMuebleriasActivas($conn) {
    $sql = "SELECT m.*, p.nombre as propietario_nombre, 
                   (SELECT COUNT(*) FROM Sucursales s WHERE s.id_muebleria = m.id_muebleria AND s.activo = 1) as num_sucursales
            FROM Mueblerias m 
            JOIN Propietario pr ON m.id_propietario = pr.id_usuario
            JOIN Usuarios u ON pr.id_usuario = u.id_usuario
            WHERE u.activo = 1 
            ORDER BY m.nombre_negocio";
    return obtenerRegistros($sql);
}

// Función para obtener productos de una mueblería
function obtenerProductosMuebleria($conn, $id_muebleria, $limit = null, $offset = 0) {
    $sql = "SELECT p.*, c.nombre as categoria_nombre
            FROM Productos p
            LEFT JOIN (SELECT DISTINCT categoria FROM Productos WHERE id_muebleria = ?) c ON p.categoria = c.categoria
            WHERE p.id_muebleria = ? 
            AND p.tipo_producto = 'producto_final'
            ORDER BY p.nombre";
    
    if ($limit) {
        $sql .= " LIMIT ? OFFSET ?";
        return obtenerRegistros($sql, [$id_muebleria, $id_muebleria, $limit, $offset]);
    }
    
    return obtenerRegistros($sql, [$id_muebleria, $id_muebleria]);
}

// Función para obtener detalles de un producto
function obtenerProducto($conn, $id_producto) {
    $sql = "SELECT p.*, m.nombre_negocio, m.nombre_negocio as muebleria_nombre
            FROM Productos p
            JOIN Mueblerias m ON p.id_muebleria = m.id_muebleria
            WHERE p.id_producto = ?";
    return obtenerRegistro($sql, [$id_producto]);
}

// Función para obtener categorías de una mueblería
function obtenerCategoriasMuebleria($conn, $id_muebleria) {
    $sql = "SELECT DISTINCT categoria, COUNT(*) as total
            FROM Productos 
            WHERE id_muebleria = ? AND categoria IS NOT NULL AND categoria != ''
            GROUP BY categoria
            ORDER BY categoria";
    return obtenerRegistros($sql, [$id_muebleria]);
}

// Función para verificar si el usuario está logueado
function estaLogueado() {
    return isset($_SESSION['usuario']) && !empty($_SESSION['usuario']);
}

// Función para redirigir si no está logueado
function requiereLogin() {
    if (!estaLogueado()) {
        $_SESSION['mensaje_error'] = 'Debes iniciar sesión para acceder a esta página.';
        header('Location: login.php');
        exit;
    }
}

// Función para obtener información del usuario logueado
function obtenerUsuarioLogueado() {
    return estaLogueado() ? $_SESSION['usuario'] : null;
}

// Función para agregar producto al carrito
function agregarAlCarrito($id_producto, $cantidad = 1) {
    if (!isset($_SESSION['carrito'])) {
        $_SESSION['carrito'] = [];
    }
    
    if (isset($_SESSION['carrito'][$id_producto])) {
        $_SESSION['carrito'][$id_producto] += $cantidad;
    } else {
        $_SESSION['carrito'][$id_producto] = $cantidad;
    }
    
    return true;
}

// Función para eliminar producto del carrito
function eliminarDelCarrito($id_producto) {
    if (isset($_SESSION['carrito'][$id_producto])) {
        unset($_SESSION['carrito'][$id_producto]);
        return true;
    }
    return false;
}

// Función para actualizar cantidad en el carrito
function actualizarCarrito($id_producto, $cantidad) {
    if ($cantidad <= 0) {
        return eliminarDelCarrito($id_producto);
    }
    
    if (isset($_SESSION['carrito'][$id_producto])) {
        $_SESSION['carrito'][$id_producto] = $cantidad;
        return true;
    }
    return false;
}

// Función para obtener contenido del carrito
function obtenerCarrito($conn) {
    if (!isset($_SESSION['carrito']) || empty($_SESSION['carrito'])) {
        return [];
    }
    
    $carrito = [];
    $total = 0;
    
    foreach ($_SESSION['carrito'] as $id_producto => $cantidad) {
        $producto = obtenerProducto($conn, $id_producto);
        if ($producto) {
            $subtotal = $producto['precio_venta'] * $cantidad;
            $carrito[] = [
                'producto' => $producto,
                'cantidad' => $cantidad,
                'subtotal' => $subtotal
            ];
            $total += $subtotal;
        }
    }
    
    return ['items' => $carrito, 'total' => $total];
}

// Función para vaciar carrito
function vaciarCarrito() {
    unset($_SESSION['carrito']);
}

// Función para agregar a lista de deseos
function agregarAListaDeseos($conn, $id_cliente, $id_producto) {
    // Verificar si ya está en la lista
    $sql = "SELECT COUNT(*) FROM Lista_Deseos WHERE id_cliente = ? AND id_producto = ?";
    if (existeRegistro($sql, [$id_cliente, $id_producto])) {
        return false; // Ya existe
    }
    
    $sql = "INSERT INTO Lista_Deseos (id_cliente, id_producto) VALUES (?, ?)";
    return insertarRegistro($sql, [$id_cliente, $id_producto]) !== false;
}

// Función para eliminar de lista de deseos
function eliminarDeListaDeseos($conn, $id_cliente, $id_producto) {
    $sql = "DELETE FROM Lista_Deseos WHERE id_cliente = ? AND id_producto = ?";
    return eliminarRegistro($sql, [$id_cliente, $id_producto]) > 0;
}

// Función para obtener lista de deseos
function obtenerListaDeseos($conn, $id_cliente) {
    $sql = "SELECT p.*, ld.fecha_agregado
            FROM Lista_Deseos ld
            JOIN Productos p ON ld.id_producto = p.id_producto
            WHERE ld.id_cliente = ?
            ORDER BY ld.fecha_agregado DESC";
    return obtenerRegistros($sql, [$id_cliente]);
}

// Función para verificar si un producto está en la lista de deseos
function estaEnListaDeseos($conn, $id_cliente, $id_producto) {
    $sql = "SELECT COUNT(*) FROM Lista_Deseos WHERE id_cliente = ? AND id_producto = ?";
    return existeRegistro($sql, [$id_cliente, $id_producto]);
}

// Función para obtener sucursales de una mueblería
function obtenerSucursalesMuebleria($conn, $id_muebleria) {
    $sql = "SELECT s.*, m.nombre, e.nombre as estado_nombre
            FROM Sucursales s
            JOIN Municipios m ON s.id_municipio = m.id_municipio
            JOIN Estados e ON m.id_estado = e.id_estado
            WHERE s.id_muebleria = ? AND s.activo = 1
            ORDER BY s.nombre_sucursal";
    return obtenerRegistros($sql, [$id_muebleria]);
}

// Función para registrar usuario
function registrarUsuario($conn, $nombre, $correo, $password, $role_id = 5) {
    // Verificar si el correo ya existe
    $sql = "SELECT COUNT(*) FROM Usuarios WHERE correo = ?";
    if (existeRegistro($sql, [$correo])) {
        return ['success' => false, 'message' => 'El correo electrónico ya está registrado.'];
    }
    
    // Encriptar password
    $password_hash = password_hash($password, PASSWORD_DEFAULT);
    
    // Insertar usuario
    $sql = "INSERT INTO Usuarios (nombre, correo, password, role_id, activo) VALUES (?, ?, ?, ?, 1)";
    $id_usuario = insertarRegistro($sql, [$nombre, $correo, $password_hash, $role_id]);
    
    if ($id_usuario) {
        // Si es cliente, crear registro en tabla Cliente
        if ($role_id == 5) {
            $sql = "INSERT INTO Cliente (id_usuario, puntos) VALUES (?, 0)";
            insertarRegistro($sql, [$id_usuario]);
        }
        
        return ['success' => true, 'id_usuario' => $id_usuario];
    }
    
    return ['success' => false, 'message' => 'Error al registrar el usuario.'];
}

// Función para iniciar sesión
function iniciarSesion($conn, $correo, $password) {
    $sql = "SELECT u.*, r.nombre as role_nombre
            FROM Usuarios u
            JOIN Roles r ON u.role_id = r.id_rol
            WHERE u.correo = ? AND u.activo = 1";
    
    $usuario = obtenerRegistro($sql, [$correo]);
    
    if ($usuario && password_verify($password, $usuario['password'])) {
        // Obtener información adicional según el rol
        if ($usuario['role_id'] == 5) { // Cliente
            $sql = "SELECT * FROM Cliente WHERE id_usuario = ?";
            $cliente = obtenerRegistro($sql, [$usuario['id_usuario']]);
            if ($cliente) {
                $usuario = array_merge($usuario, $cliente);
            }
        }
        
        $_SESSION['usuario'] = $usuario;
        return ['success' => true, 'usuario' => $usuario];
    }
    
    return ['success' => false, 'message' => 'Correo o contraseña incorrectos.'];
}

// Función para mostrar mensajes
function mostrarMensaje() {
    $html = '';
    
    if (isset($_SESSION['mensaje_exito'])) {
        $html .= '<div class="alert alert-success alert-dismissible fade show" role="alert">';
        $html .= $_SESSION['mensaje_exito'];
        $html .= '<button type="button" class="btn-close" data-bs-dismiss="alert"></button>';
        $html .= '</div>';
        unset($_SESSION['mensaje_exito']);
    }
    
    if (isset($_SESSION['mensaje_error'])) {
        $html .= '<div class="alert alert-danger alert-dismissible fade show" role="alert">';
        $html .= $_SESSION['mensaje_error'];
        $html .= '<button type="button" class="btn-close" data-bs-dismiss="alert"></button>';
        $html .= '</div>';
        unset($_SESSION['mensaje_error']);
    }
    
    if (isset($_SESSION['mensaje_info'])) {
        $html .= '<div class="alert alert-info alert-dismissible fade show" role="alert">';
        $html .= $_SESSION['mensaje_info'];
        $html .= '<button type="button" class="btn-close" data-bs-dismiss="alert"></button>';
        $html .= '</div>';
        unset($_SESSION['mensaje_info']);
    }
    
    return $html;
}

// Función para paginar resultados
function paginar($total_items, $items_por_pagina, $pagina_actual = 1) {
    $total_paginas = ceil($total_items / $items_por_pagina);
    $pagina_actual = max(1, min($pagina_actual, $total_paginas));
    $offset = ($pagina_actual - 1) * $items_por_pagina;
    
    return [
        'pagina_actual' => $pagina_actual,
        'total_paginas' => $total_paginas,
        'items_por_pagina' => $items_por_pagina,
        'offset' => $offset,
        'total_items' => $total_items
    ];
}

// Función para generar paginación HTML
function generarPaginacion($paginacion, $url_base) {
    if ($paginacion['total_paginas'] <= 1) {
        return '';
    }
    
    $html = '<nav aria-label="Paginación"><ul class="pagination justify-content-center">';
    
    // Anterior
    if ($paginacion['pagina_actual'] > 1) {
        $html .= '<li class="page-item"><a class="page-link" href="' . $url_base . '?pagina=' . ($paginacion['pagina_actual'] - 1) . '">Anterior</a></li>';
    } else {
        $html .= '<li class="page-item disabled"><span class="page-link">Anterior</span></li>';
    }
    
    // Páginas
    for ($i = 1; $i <= $paginacion['total_paginas']; $i++) {
        if ($i == $paginacion['pagina_actual']) {
            $html .= '<li class="page-item active"><span class="page-link">' . $i . '</span></li>';
        } else {
            $html .= '<li class="page-item"><a class="page-link" href="' . $url_base . '?pagina=' . $i . '">' . $i . '</a></li>';
        }
    }
    
    // Siguiente
    if ($paginacion['pagina_actual'] < $paginacion['total_paginas']) {
        $html .= '<li class="page-item"><a class="page-link" href="' . $url_base . '?pagina=' . ($paginacion['pagina_actual'] + 1) . '">Siguiente</a></li>';
    } else {
        $html .= '<li class="page-item disabled"><span class="page-link">Siguiente</span></li>';
    }
    
    $html .= '</ul></nav>';
    
    return $html;
}

// Función para obtener inventario de un producto
function obtenerInventarioProducto($conn, $id_producto, $id_sucursal = null) {
    if ($id_sucursal) {
        $sql = "SELECT * FROM Inventario WHERE id_producto = ? AND id_sucursal = ?";
        return obtenerRegistro($sql, [$id_producto, $id_sucursal]);
    } else {
        $sql = "SELECT SUM(cantidad) as total_disponible FROM Inventario WHERE id_producto = ?";
        $resultado = obtenerRegistro($sql, [$id_producto]);
        return $resultado ? $resultado['total_disponible'] : 0;
    }
}

// Función para verificar disponibilidad de producto
function verificarDisponibilidad($conn, $id_producto, $cantidad_solicitada, $id_sucursal = null) {
    $disponible = obtenerInventarioProducto($conn, $id_producto, $id_sucursal);
    return $disponible >= $cantidad_solicitada;
}
?>
