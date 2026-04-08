<?php
session_start();
require_once 'config/database.php';
require_once 'includes/functions.php';

// Verificar si se proporcionó el ID de la mueblería
if (!isset($_GET['id']) || empty($_GET['id'])) {
    $_SESSION['mensaje_error'] = 'Mueblería no especificada.';
    header('Location: index.php');
    exit;
}

$id_muebleria = intval($_GET['id']);
$muebleria = null;
$productos = [];
$categorias = [];
$sucursales = [];

// Obtener información de la mueblería
$sql = "SELECT m.*, u.nombre as propietario_nombre, u.correo as propietario_email,
               (SELECT COUNT(*) FROM Productos p WHERE p.id_muebleria = m.id_muebleria AND p.tipo_producto = 'producto_final') as total_productos,
               (SELECT COUNT(*) FROM Sucursales s WHERE s.id_muebleria = m.id_muebleria AND s.activo = 1) as total_sucursales
        FROM Mueblerias m
        JOIN Propietario pr ON m.id_propietario = pr.id_usuario
        JOIN Usuarios u ON pr.id_usuario = u.id_usuario
        WHERE m.id_muebleria = ? AND u.activo = 1";

$muebleria = obtenerRegistro($sql, [$id_muebleria]);

if (!$muebleria) {
    $_SESSION['mensaje_error'] = 'La mueblería solicitada no existe o no está disponible.';
    header('Location: index.php');
    exit;
}

// Paginación de productos
$pagina_actual = isset($_GET['pagina']) ? intval($_GET['pagina']) : 1;
$items_por_pagina = 12;

// Filtros
$categoria_filtro = isset($_GET['categoria']) ? limpiarDatos($_GET['categoria']) : '';
$ordenar = isset($_GET['ordenar']) ? limpiarDatos($_GET['ordenar']) : 'nombre';

// Obtener categorías disponibles
$categorias = obtenerCategoriasMuebleria($conn, $id_muebleria);

// Construir consulta de productos con filtros
$sql_productos = "SELECT p.* FROM Productos p WHERE p.id_muebleria = ? AND p.tipo_producto = 'producto_final'";
$params = [$id_muebleria];

if (!empty($categoria_filtro)) {
    $sql_productos .= " AND p.categoria = ?";
    $params[] = $categoria_filtro;
}

// Ordenamiento
switch ($ordenar) {
    case 'precio_asc':
        $sql_productos .= " ORDER BY p.precio_venta ASC";
        break;
    case 'precio_desc':
        $sql_productos .= " ORDER BY p.precio_venta DESC";
        break;
    case 'nombre':
    default:
        $sql_productos .= " ORDER BY p.nombre ASC";
        break;
}

// Contar total de productos para paginación
$sql_count = "SELECT COUNT(*) FROM (" . $sql_productos . ") as count_query";
$total_productos = obtenerRegistro($sql_count, $params)['COUNT(*)'];

// Configurar paginación
$paginacion = paginar($total_productos, $items_por_pagina, $pagina_actual);

// Obtener productos paginados
$sql_productos .= " LIMIT ? OFFSET ?";
$params[] = $paginacion['items_por_pagina'];
$params[] = $paginacion['offset'];

$productos = obtenerRegistros($sql_productos, $params);

// Obtener sucursales de la mueblería
$sucursales = obtenerSucursalesMuebleria($conn, $id_muebleria);

// Procesar acciones del carrito
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['accion'])) {
    if ($_POST['accion'] == 'agregar_carrito' && isset($_POST['id_producto'])) {
        $id_producto = intval($_POST['id_producto']);
        $cantidad = isset($_POST['cantidad']) ? intval($_POST['cantidad']) : 1;
        
        if (agregarAlCarrito($id_producto, $cantidad)) {
            $_SESSION['mensaje_exito'] = 'Producto agregado al carrito correctamente.';
        } else {
            $_SESSION['mensaje_error'] = 'Error al agregar el producto al carrito.';
        }
        
        header('Location: muebleria.php?id=' . $id_muebleria . '&categoria=' . urlencode($categoria_filtro) . '&ordenar=' . urlencode($ordenar) . '&pagina=' . $pagina_actual);
        exit;
    }
    
    if ($_POST['accion'] == 'agregar_deseos' && isset($_POST['id_producto'])) {
        if (!estaLogueado()) {
            $_SESSION['mensaje_error'] = 'Debes iniciar sesión para agregar productos a tu lista de deseos.';
            header('Location: login.php');
            exit;
        }
        
        $id_producto = intval($_POST['id_producto']);
        $id_cliente = $_SESSION['usuario']['id_usuario'];
        
        if (agregarAListaDeseos($conn, $id_cliente, $id_producto)) {
            $_SESSION['mensaje_exito'] = 'Producto agregado a tu lista de deseos.';
        } else {
            $_SESSION['mensaje_info'] = 'Este producto ya está en tu lista de deseos.';
        }
        
        header('Location: muebleria.php?id=' . $id_muebleria . '&categoria=' . urlencode($categoria_filtro) . '&ordenar=' . urlencode($ordenar) . '&pagina=' . $pagina_actual);
        exit;
    }
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo htmlspecialchars($muebleria['nombre_negocio']); ?> - MuebleClick</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css">
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
    <!-- Navegación -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
        <div class="container">
            <a class="navbar-brand" href="index.php">
                <i class="bi bi-shop"></i> MuebleClick
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item">
                        <a class="nav-link" href="index.php">Inicio</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link position-relative" href="carrito.php">
                            <i class="bi bi-cart3"></i> Carrito
                            <?php if (isset($_SESSION['carrito']) && count($_SESSION['carrito']) > 0): ?>
                                <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                    <?php echo count($_SESSION['carrito']); ?>
                                </span>
                            <?php endif; ?>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="deseos.php">
                            <i class="bi bi-heart"></i> Deseos
                        </a>
                    </li>
                    <?php if (isset($_SESSION['usuario'])): ?>
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                                <i class="bi bi-person-circle"></i> <?php echo $_SESSION['usuario']['nombre']; ?>
                            </a>
                            <ul class="dropdown-menu">
                                <li><a class="dropdown-item" href="perfil.php">Mi Perfil</a></li>
                                <li><a class="dropdown-item" href="pedidos.php">Mis Pedidos</a></li>
                                <li><hr class="dropdown-divider"></li>
                                <li><a class="dropdown-item" href="logout.php">Cerrar Sesión</a></li>
                            </ul>
                        </li>
                    <?php else: ?>
                        <li class="nav-item">
                            <a class="nav-link" href="login.php">Iniciar Sesión</a>
                        </li>
                    <?php endif; ?>
                </ul>
            </div>
        </div>
    </nav>

    <!-- Header de la Mueblería -->
    <section class="muebleria-header bg-light py-5">
        <div class="container">
            <div class="row align-items-center">
                <div class="col-lg-3">
                    <img src="assets/images/mueblerias/<?php echo $muebleria['id_muebleria']; ?>/logo.jpg" 
                         alt="<?php echo htmlspecialchars($muebleria['nombre_negocio']); ?>"
                         class="img-fluid rounded muebleria-logo"
                         onerror="this.src='assets/images/default-muebleria.jpg'">
                </div>
                <div class="col-lg-9">
                    <h1 class="display-5 fw-bold"><?php echo htmlspecialchars($muebleria['nombre_negocio']); ?></h1>
                    <p class="lead"><?php echo htmlspecialchars($muebleria['razon_social']); ?></p>
                    <div class="row mt-3">
                        <div class="col-md-6">
                            <p><i class="bi bi-geo-alt text-primary"></i> <?php echo htmlspecialchars($muebleria['direccion_principal']); ?></p>
                            <p><i class="bi bi-telephone text-primary"></i> <?php echo htmlspecialchars($muebleria['telefono']); ?></p>
                            <p><i class="bi bi-envelope text-primary"></i> <?php echo htmlspecialchars($muebleria['propietario_email']); ?></p>
                        </div>
                        <div class="col-md-6">
                            <div class="d-flex gap-3">
                                <div class="text-center">
                                    <h4 class="text-primary"><?php echo $muebleria['total_productos']; ?></h4>
                                    <small class="text-muted">Productos</small>
                                </div>
                                <div class="text-center">
                                    <h4 class="text-primary"><?php echo $muebleria['total_sucursales']; ?></h4>
                                    <small class="text-muted">Sucursales</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Sucursales -->
    <?php if (!empty($sucursales)): ?>
    <section class="py-4 bg-white">
        <div class="container">
            <h4 class="mb-3">Nuestras Sucursales</h4>
            <div class="row">
                <?php foreach ($sucursales as $sucursal): ?>
                    <div class="col-md-6 col-lg-4 mb-3">
                        <div class="card h-100">
                            <div class="card-body">
                                <h6 class="card-title"><?php echo htmlspecialchars($sucursal['nombre_sucursal']); ?></h6>
                                <p class="card-text small">
                                    <i class="bi bi-geo-alt"></i> <?php echo htmlspecialchars($sucursal['calle_numero']); ?><br>
                                    <i class="bi bi-geo"></i> <?php echo htmlspecialchars($sucursal['nombre']); ?>, <?php echo htmlspecialchars($sucursal['estado_nombre']); ?><br>
                                    <i class="bi bi-telephone"></i> <?php echo htmlspecialchars($sucursal['telefono']); ?>
                                </p>
                            </div>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
    </section>
    <?php endif; ?>

    <!-- Filtros y Productos -->
    <section class="py-5">
        <div class="container">
            <div class="row">
                <!-- Filtros -->
                <div class="col-lg-3">
                    <div class="card">
                        <div class="card-header">
                            <h5 class="mb-0"><i class="bi bi-funnel"></i> Filtros</h5>
                        </div>
                        <div class="card-body">
                            <form method="GET" action="muebleria.php">
                                <input type="hidden" name="id" value="<?php echo $id_muebleria; ?>">
                                
                                <!-- Categorías -->
                                <?php if (!empty($categorias)): ?>
                                    <h6 class="mb-3">Categorías</h6>
                                    <div class="mb-4">
                                        <div class="form-check">
                                            <input class="form-check-input" type="radio" name="categoria" id="cat_todas" value="" 
                                                   <?php echo empty($categoria_filtro) ? 'checked' : ''; ?>>
                                            <label class="form-check-label" for="cat_todas">
                                                Todas las categorías
                                            </label>
                                        </div>
                                        <?php foreach ($categorias as $categoria): ?>
                                            <div class="form-check">
                                                <input class="form-check-input" type="radio" name="categoria" 
                                                       id="cat_<?php echo md5($categoria['categoria']); ?>" 
                                                       value="<?php echo htmlspecialchars($categoria['categoria']); ?>"
                                                       <?php echo $categoria_filtro === $categoria['categoria'] ? 'checked' : ''; ?>>
                                                <label class="form-check-label" for="cat_<?php echo md5($categoria['categoria']); ?>">
                                                    <?php echo htmlspecialchars($categoria['categoria']); ?> (<?php echo $categoria['total']; ?>)
                                                </label>
                                            </div>
                                        <?php endforeach; ?>
                                    </div>
                                <?php endif; ?>

                                <!-- Ordenar por -->
                                <h6 class="mb-3">Ordenar por</h6>
                                <div class="mb-4">
                                    <select class="form-select" name="ordenar">
                                        <option value="nombre" <?php echo $ordenar === 'nombre' ? 'selected' : ''; ?>>Nombre (A-Z)</option>
                                        <option value="precio_asc" <?php echo $ordenar === 'precio_asc' ? 'selected' : ''; ?>>Precio: Menor a Mayor</option>
                                        <option value="precio_desc" <?php echo $ordenar === 'precio_desc' ? 'selected' : ''; ?>>Precio: Mayor a Menor</option>
                                    </select>
                                </div>

                                <button type="submit" class="btn btn-primary w-100">Aplicar Filtros</button>
                            </form>
                        </div>
                    </div>
                </div>

                <!-- Productos -->
                <div class="col-lg-9">
                    <?php echo mostrarMensaje(); ?>

                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <h4>Catálogo de Productos</h4>
                        <small class="text-muted">
                            Mostrando <?php echo count($productos); ?> de <?php echo $total_productos; ?> productos
                        </small>
                    </div>

                    <?php if (!empty($productos)): ?>
                        <div class="row">
                            <?php foreach ($productos as $producto): ?>
                                <div class="col-lg-4 col-md-6 mb-4">
                                    <div class="card producto-card h-100">
                                        <div class="producto-imagen-container">
                                            <img src="assets/images/mueblerias/<?php echo $producto['id_muebleria']; ?>/productos/<?php echo $producto['id_producto']; ?>.jpg" 
                                                 class="card-img-top producto-imagen" 
                                                 alt="<?php echo htmlspecialchars($producto['nombre']); ?>"
                                                 onerror="this.src='assets/images/default-product.jpg'">
                                            <?php if (estaLogueado() && estaEnListaDeseos($conn, $_SESSION['usuario']['id_usuario'], $producto['id_producto'])): ?>
                                                <div class="producto-deseos active">
                                                    <i class="bi bi-heart-fill"></i>
                                                </div>
                                            <?php endif; ?>
                                        </div>
                                        <div class="card-body d-flex flex-column">
                                            <h6 class="card-title"><?php echo htmlspecialchars($producto['nombre']); ?></h6>
                                            <p class="card-text small text-muted flex-grow-1">
                                                <?php if ($producto['categoria']): ?>
                                                    <span class="badge bg-secondary me-1"><?php echo htmlspecialchars($producto['categoria']); ?></span>
                                                <?php endif; ?>
                                                <?php if ($producto['color']): ?>
                                                    <span class="badge bg-info me-1">Color: <?php echo htmlspecialchars($producto['color']); ?></span>
                                                <?php endif; ?>
                                                <?php if ($producto['material']): ?>
                                                    <span class="badge bg-warning text-dark">Material: <?php echo htmlspecialchars($producto['material']); ?></span>
                                                <?php endif; ?>
                                            </p>
                                            <?php if ($producto['medidas']): ?>
                                                <p class="card-text small">
                                                    <i class="bi bi-rulers"></i> <?php echo htmlspecialchars($producto['medidas']); ?>
                                                </p>
                                            <?php endif; ?>
                                            <div class="mt-auto">
                                                <div class="d-flex justify-content-between align-items-center mb-2">
                                                    <h5 class="text-primary mb-0"><?php echo formatearPrecio($producto['precio_venta']); ?></h5>
                                                    <?php 
                                                    $disponible = obtenerInventarioProducto($conn, $producto['id_producto']);
                                                    if ($disponible > 0): 
                                                    ?>
                                                        <span class="badge bg-success">Disponible</span>
                                                    <?php else: ?>
                                                        <span class="badge bg-danger">Agotado</span>
                                                    <?php endif; ?>
                                                </div>
                                                
                                                <!-- Formularios de acción -->
                                                <form method="POST" class="d-inline">
                                                    <input type="hidden" name="accion" value="agregar_carrito">
                                                    <input type="hidden" name="id_producto" value="<?php echo $producto['id_producto']; ?>">
                                                    <div class="input-group input-group-sm">
                                                        <input type="number" name="cantidad" class="form-control" value="1" min="1" max="<?php echo $disponible; ?>">
                                                        <button type="submit" class="btn btn-primary" <?php echo $disponible <= 0 ? 'disabled' : ''; ?>>
                                                            <i class="bi bi-cart-plus"></i> Agregar
                                                        </button>
                                                    </div>
                                                </form>
                                                
                                                <?php if (estaLogueado()): ?>
                                                    <form method="POST" class="d-inline mt-2">
                                                        <input type="hidden" name="accion" value="agregar_deseos">
                                                        <input type="hidden" name="id_producto" value="<?php echo $producto['id_producto']; ?>">
                                                        <button type="submit" class="btn btn-outline-danger btn-sm">
                                                            <i class="bi bi-heart"></i> Deseos
                                                        </button>
                                                    </form>
                                                <?php endif; ?>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            <?php endforeach; ?>
                        </div>

                        <!-- Paginación -->
                        <?php 
                        $url_base = "muebleria.php?id=$id_muebleria";
                        if (!empty($categoria_filtro)) $url_base .= "&categoria=" . urlencode($categoria_filtro);
                        if (!empty($ordenar)) $url_base .= "&ordenar=" . urlencode($ordenar);
                        echo generarPaginacion($paginacion, $url_base);
                        ?>
                    <?php else: ?>
                        <div class="text-center py-5">
                            <i class="bi bi-box text-muted" style="font-size: 4rem;"></i>
                            <h5 class="mt-3">No se encontraron productos</h5>
                            <p class="text-muted">Intenta con otros filtros o vuelve más tarde.</p>
                        </div>
                    <?php endif; ?>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="bg-dark text-white py-4 mt-5">
        <div class="container">
            <div class="row">
                <div class="col-md-4">
                    <h5><?php echo htmlspecialchars($muebleria['nombre_negocio']); ?></h5>
                    <p><?php echo htmlspecialchars($muebleria['razon_social']); ?></p>
                </div>
                <div class="col-md-4">
                    <h5>Contacto</h5>
                    <p><i class="bi bi-telephone"></i> <?php echo htmlspecialchars($muebleria['telefono']); ?></p>
                    <p><i class="bi bi-envelope"></i> <?php echo htmlspecialchars($muebleria['propietario_email']); ?></p>
                </div>
                <div class="col-md-4">
                    <h5>MuebleClick</h5>
                    <p>Tu plataforma de confianza para encontrar los mejores muebles.</p>
                </div>
            </div>
            <hr class="my-4">
            <div class="text-center">
                <p>&copy; 2024 MuebleClick. Todos los derechos reservados.</p>
            </div>
        </div>
    </footer>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="assets/js/main.js"></script>
</body>
</html>
