<?php
session_start();
require_once 'config/database.php';
require_once 'includes/functions.php';

// Redirigir si no está logueado
requiereLogin();

// Procesar acciones de lista de deseos
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['accion'])) {
    $id_producto = intval($_POST['id_producto']);
    $id_cliente = $_SESSION['usuario']['id_usuario'];
    
    switch ($_POST['accion']) {
        case 'eliminar':
            if (eliminarDeListaDeseos($conn, $id_cliente, $id_producto)) {
                $_SESSION['mensaje_exito'] = 'Producto eliminado de tu lista de deseos.';
            }
            break;
            
        case 'agregar_carrito':
            $cantidad = isset($_POST['cantidad']) ? intval($_POST['cantidad']) : 1;
            if (agregarAlCarrito($id_producto, $cantidad)) {
                $_SESSION['mensaje_exito'] = 'Producto agregado al carrito correctamente.';
            }
            break;
            
        case 'mover_todos_carrito':
            $productos_deseos = obtenerListaDeseos($conn, $id_cliente);
            $agregados = 0;
            foreach ($productos_deseos as $producto) {
                if (agregarAlCarrito($producto['id_producto'], 1)) {
                    $agregados++;
                }
            }
            $_SESSION['mensaje_exito'] = "Se agregaron $agregados productos al carrito.";
            break;
    }
    
    header('Location: deseos.php');
    exit;
}

// Obtener lista de deseos del usuario
$id_cliente = $_SESSION['usuario']['id_usuario'];
$productos_deseos = obtenerListaDeseos($conn, $id_cliente);
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mi Lista de Deseos - MuebleClick</title>
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
                        <a class="nav-link active" href="deseos.php">
                            <i class="bi bi-heart"></i> Deseos
                        </a>
                    </li>
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
                </ul>
            </div>
        </div>
    </nav>

    <!-- Contenido Principal -->
    <div class="container py-5">
        <div class="row">
            <div class="col-lg-12">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h2>
                        <i class="bi bi-heart-fill text-danger"></i> Mi Lista de Deseos
                        <?php if (!empty($productos_deseos)): ?>
                            <small class="text-muted">(<?php echo count($productos_deseos); ?> productos)</small>
                        <?php endif; ?>
                    </h2>
                    <?php if (!empty($productos_deseos)): ?>
                        <form method="POST" class="d-inline">
                            <input type="hidden" name="accion" value="mover_todos_carrito">
                            <button type="submit" class="btn btn-success" onclick="return confirm('¿Agregar todos los productos al carrito?')">
                                <i class="bi bi-cart-plus"></i> Agregar todos al carrito
                            </button>
                        </form>
                    <?php endif; ?>
                </div>

                <?php echo mostrarMensaje(); ?>

                <?php if (!empty($productos_deseos)): ?>
                    <div class="row">
                        <?php foreach ($productos_deseos as $producto): ?>
                            <div class="col-lg-3 col-md-6 mb-4">
                                <div class="card producto-card h-100">
                                    <div class="producto-imagen-container">
                                        <img src="assets/images/mueblerias/<?php echo $producto['id_muebleria']; ?>/productos/<?php echo $producto['id_producto']; ?>.jpg" 
                                             class="card-img-top producto-imagen" 
                                             alt="<?php echo htmlspecialchars($producto['nombre']); ?>"
                                             onerror="this.src='assets/images/default-product.jpg'">
                                        <div class="producto-deseos active">
                                            <i class="bi bi-heart-fill"></i>
                                        </div>
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
                                        <small class="text-muted">
                                            <i class="bi bi-calendar"></i> Agregado: <?php echo date('d/m/Y', strtotime($producto['fecha_agregado'])); ?>
                                        </small>
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
                                            
                                            <!-- Acciones -->
                                            <div class="btn-group w-100" role="group">
                                                <form method="POST" class="d-inline">
                                                    <input type="hidden" name="accion" value="agregar_carrito">
                                                    <input type="hidden" name="id_producto" value="<?php echo $producto['id_producto']; ?>">
                                                    <button type="submit" class="btn btn-primary btn-sm flex-fill" <?php echo $disponible <= 0 ? 'disabled' : ''; ?>>
                                                        <i class="bi bi-cart-plus"></i> Carrito
                                                    </button>
                                                </form>
                                                
                                                <form method="POST" class="d-inline">
                                                    <input type="hidden" name="accion" value="eliminar">
                                                    <input type="hidden" name="id_producto" value="<?php echo $producto['id_producto']; ?>">
                                                    <button type="submit" class="btn btn-outline-danger btn-sm" title="Eliminar de deseos">
                                                        <i class="bi bi-trash"></i>
                                                    </button>
                                                </form>
                                            </div>
                                            
                                            <a href="muebleria.php?id=<?php echo $producto['id_muebleria']; ?>" 
                                               class="btn btn-outline-primary btn-sm w-100 mt-2">
                                                <i class="bi bi-eye"></i> Ver Detalles
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        <?php endforeach; ?>
                    </div>

                    <!-- Acciones adicionales -->
                    <div class="mt-4">
                        <a href="index.php" class="btn btn-outline-primary">
                            <i class="bi bi-arrow-left"></i> Seguir explorando
                        </a>
                        <a href="carrito.php" class="btn btn-success">
                            <i class="bi bi-cart3"></i> Ver Carrito
                        </a>
                    </div>
                <?php else: ?>
                    <div class="text-center py-5">
                        <i class="bi bi-heart text-muted" style="font-size: 5rem;"></i>
                        <h3 class="mt-4">Tu lista de deseos está vacía</h3>
                        <p class="text-muted">Agrega productos que te interesen y recíbelos aquí.</p>
                        <a href="index.php" class="btn btn-primary btn-lg">
                            <i class="bi bi-shop"></i> Explorar Mueblerías
                        </a>
                    </div>
                <?php endif; ?>
            </div>
        </div>
    </div>

    <!-- Productos recomendados -->
    <?php if (empty($productos_deseos)): ?>
        <section class="py-5 bg-light">
            <div class="container">
                <h3 class="text-center mb-4">Productos que podrían gustarte</h3>
                <div class="row">
                    <?php
                    // Obtener productos aleatorios para recomendar
                    $sql = "SELECT p.* FROM Productos p 
                            WHERE p.tipo_producto = 'producto_final' 
                            ORDER BY RAND() LIMIT 8";
                    $productos_recomendados = obtenerRegistros($sql);
                    
                    foreach ($productos_recomendados as $producto):
                    ?>
                        <div class="col-lg-3 col-md-6 mb-4">
                            <div class="card h-100">
                                <img src="assets/images/mueblerias/<?php echo $producto['id_muebleria']; ?>/productos/<?php echo $producto['id_producto']; ?>.jpg" 
                                     class="card-img-top" alt="<?php echo htmlspecialchars($producto['nombre']); ?>"
                                     onerror="this.src='assets/images/default-product.jpg'">
                                <div class="card-body">
                                    <h6 class="card-title"><?php echo htmlspecialchars($producto['nombre']); ?></h6>
                                    <p class="card-text">
                                        <strong class="text-primary"><?php echo formatearPrecio($producto['precio_venta']); ?></strong>
                                    </p>
                                    <a href="muebleria.php?id=<?php echo $producto['id_muebleria']; ?>" 
                                       class="btn btn-outline-primary btn-sm w-100">
                                        <i class="bi bi-eye"></i> Ver Detalles
                                    </a>
                                </div>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
            </div>
        </section>
    <?php endif; ?>

    <!-- Footer -->
    <footer class="bg-dark text-white py-4 mt-5">
        <div class="container">
            <div class="text-center">
                <p>&copy; 2024 MuebleClick. Todos los derechos reservados.</p>
            </div>
        </div>
    </footer>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="assets/js/main.js"></script>
</body>
</html>
