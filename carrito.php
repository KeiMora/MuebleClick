<?php
session_start();
require_once 'config/database.php';
require_once 'includes/functions.php';

// Redirigir si no está logueado (opcional, dependiendo de los requisitos)
// requiereLogin();

// Procesar acciones del carrito
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['accion'])) {
    switch ($_POST['accion']) {
        case 'actualizar':
            if (isset($_POST['cantidades']) && is_array($_POST['cantidades'])) {
                foreach ($_POST['cantidades'] as $id_producto => $cantidad) {
                    $cantidad = intval($cantidad);
                    if ($cantidad > 0) {
                        actualizarCarrito($id_producto, $cantidad);
                    } else {
                        eliminarDelCarrito($id_producto);
                    }
                }
                $_SESSION['mensaje_exito'] = 'Carrito actualizado correctamente.';
            }
            break;
            
        case 'eliminar':
            if (isset($_POST['id_producto'])) {
                $id_producto = intval($_POST['id_producto']);
                if (eliminarDelCarrito($id_producto)) {
                    $_SESSION['mensaje_exito'] = 'Producto eliminado del carrito.';
                }
            }
            break;
            
        case 'vaciar':
            vaciarCarrito();
            $_SESSION['mensaje_exito'] = 'Carrito vaciado correctamente.';
            break;
            
        case 'aplicar_cupon':
            if (isset($_POST['codigo_cupon'])) {
                $codigo_cupon = limpiarDatos($_POST['codigo_cupon']);
                // Validar cupón (aquí iría la lógica de validación)
                $_SESSION['cupon_aplicado'] = $codigo_cupon;
                $_SESSION['mensaje_exito'] = 'Cupón aplicado correctamente.';
            }
            break;
    }
    
    header('Location: carrito.php');
    exit;
}

// Obtener contenido del carrito
$carrito = obtenerCarrito($conn);
$items = $carrito['items'];
$total = $carrito['total'];

// Calcular descuentos
$descuento = 0;
if (isset($_SESSION['cupon_aplicado'])) {
    // Aquí iría la lógica para calcular el descuento basado en el cupón
    // Por ahora, usaremos un ejemplo simple
    if ($_SESSION['cupon_aplicado'] === 'BIENVENIDA10') {
        $descuento = $total * 0.10;
    }
}

$total_final = $total - $descuento;
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Carrito de Compras - MuebleClick</title>
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
                        <a class="nav-link active" href="carrito.php">
                            <i class="bi bi-cart3"></i> Carrito
                            <?php if (count($items) > 0): ?>
                                <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                    <?php echo count($items); ?>
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

    <!-- Contenido Principal -->
    <div class="container py-5">
        <div class="row">
            <div class="col-lg-8">
                <h2 class="mb-4">
                    <i class="bi bi-cart3"></i> Mi Carrito de Compras
                    <?php if (count($items) > 0): ?>
                        <small class="text-muted">(<?php echo count($items); ?> productos)</small>
                    <?php endif; ?>
                </h2>

                <?php echo mostrarMensaje(); ?>

                <?php if (!empty($items)): ?>
                    <form method="POST" action="" id="formActualizarCarrito">
                        <input type="hidden" name="accion" value="actualizar">
                        
                        <!-- Lista de productos -->
                        <div class="card mb-4">
                            <div class="card-body">
                                <?php foreach ($items as $item): ?>
                                    <div class="row align-items-center mb-3 pb-3 border-bottom">
                                        <div class="col-md-2">
                                            <img src="assets/images/mueblerias/<?php echo $item['producto']['id_muebleria']; ?>/productos/<?php echo $item['producto']['id_producto']; ?>.jpg" 
                                                 alt="<?php echo htmlspecialchars($item['producto']['nombre']); ?>"
                                                 class="img-fluid rounded"
                                                 onerror="this.src='assets/images/default-product.jpg'">
                                        </div>
                                        <div class="col-md-4">
                                            <h6 class="mb-1"><?php echo htmlspecialchars($item['producto']['nombre']); ?></h6>
                                            <small class="text-muted">
                                                <?php echo htmlspecialchars($item['producto']['muebleria_nombre']); ?>
                                                <?php if ($item['producto']['color']): ?>
                                                    | Color: <?php echo htmlspecialchars($item['producto']['color']); ?>
                                                <?php endif; ?>
                                            </small>
                                        </div>
                                        <div class="col-md-2">
                                            <div class="input-group input-group-sm">
                                                <input type="number" name="cantidades[<?php echo $item['producto']['id_producto']; ?>]" 
                                                       class="form-control" value="<?php echo $item['cantidad']; ?>" 
                                                       min="1" max="99">
                                                <button type="submit" class="btn btn-outline-primary" title="Actualizar">
                                                    <i class="bi bi-arrow-clockwise"></i>
                                                </button>
                                            </div>
                                            <small class="text-muted">Precio: <?php echo formatearPrecio($item['producto']['precio_venta']); ?></small>
                                        </div>
                                        <div class="col-md-2 text-center">
                                            <strong><?php echo formatearPrecio($item['subtotal']); ?></strong>
                                        </div>
                                        <div class="col-md-2 text-end">
                                            <form method="POST" class="d-inline">
                                                <input type="hidden" name="accion" value="eliminar">
                                                <input type="hidden" name="id_producto" value="<?php echo $item['producto']['id_producto']; ?>">
                                                <button type="submit" class="btn btn-outline-danger btn-sm" title="Eliminar">
                                                    <i class="bi bi-trash"></i>
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                <?php endforeach; ?>
                            </div>
                        </div>

                        <!-- Acciones -->
                        <div class="d-flex justify-content-between">
                            <a href="index.php" class="btn btn-outline-primary">
                                <i class="bi bi-arrow-left"></i> Seguir Comprando
                            </a>
                            <form method="POST" class="d-inline">
                                <input type="hidden" name="accion" value="vaciar">
                                <button type="submit" class="btn btn-outline-danger" onclick="return confirm('¿Estás seguro de vaciar el carrito?')">
                                    <i class="bi bi-trash"></i> Vaciar Carrito
                                </button>
                            </form>
                        </div>
                    </form>
                <?php else: ?>
                    <div class="text-center py-5">
                        <i class="bi bi-cart-x text-muted" style="font-size: 5rem;"></i>
                        <h3 class="mt-4">Tu carrito está vacío</h3>
                        <p class="text-muted">¡Agrega algunos productos para comenzar!</p>
                        <a href="index.php" class="btn btn-primary btn-lg">
                            <i class="bi bi-shop"></i> Ver Mueblerías
                        </a>
                    </div>
                <?php endif; ?>
            </div>

            <!-- Resumen del pedido -->
            <div class="col-lg-4">
                <?php if (!empty($items)): ?>
                    <div class="card position-sticky" style="top: 20px;">
                        <div class="card-header">
                            <h5 class="mb-0">Resumen del Pedido</h5>
                        </div>
                        <div class="card-body">
                            <!-- Cupón -->
                            <form method="POST" class="mb-4">
                                <input type="hidden" name="accion" value="aplicar_cupon">
                                <div class="input-group">
                                    <input type="text" name="codigo_cupon" class="form-control" 
                                           placeholder="Código de cupón" 
                                           value="<?php echo isset($_SESSION['cupon_aplicado']) ? htmlspecialchars($_SESSION['cupon_aplicado']) : ''; ?>">
                                    <button type="submit" class="btn btn-outline-primary">Aplicar</button>
                                </div>
                            </form>

                            <!-- Totales -->
                            <div class="mb-3">
                                <div class="d-flex justify-content-between mb-2">
                                    <span>Subtotal:</span>
                                    <strong><?php echo formatearPrecio($total); ?></strong>
                                </div>
                                <?php if ($descuento > 0): ?>
                                    <div class="d-flex justify-content-between mb-2 text-success">
                                        <span>Descuento:</span>
                                        <strong>-<?php echo formatearPrecio($descuento); ?></strong>
                                    </div>
                                <?php endif; ?>
                                <div class="d-flex justify-content-between mb-2">
                                    <span>Envío:</span>
                                    <strong class="text-success">GRATIS</strong>
                                </div>
                                <hr>
                                <div class="d-flex justify-content-between">
                                    <h5>Total:</h5>
                                    <h5 class="text-primary"><?php echo formatearPrecio($total_final); ?></h5>
                                </div>
                            </div>

                            <!-- Botón de checkout -->
                            <?php if (estaLogueado()): ?>
                                <a href="checkout.php" class="btn btn-primary btn-lg w-100">
                                    <i class="bi bi-credit-card"></i> Proceder al Pago
                                </a>
                            <?php else: ?>
                                <div class="alert alert-info">
                                    <i class="bi bi-info-circle"></i> 
                                    <a href="login.php" class="alert-link">Inicia sesión</a> para continuar con tu compra.
                                </div>
                                <a href="login.php" class="btn btn-primary btn-lg w-100">
                                    <i class="bi bi-box-arrow-in-right"></i> Iniciar Sesión
                                </a>
                            <?php endif; ?>

                            <!-- Información adicional -->
                            <div class="mt-3 text-center">
                                <small class="text-muted">
                                    <i class="bi bi-shield-check"></i> Compra 100% segura<br>
                                    <i class="bi bi-truck"></i> Envío gratis en pedidos mayores a $2,000
                                </small>
                            </div>
                        </div>
                    </div>
                <?php endif; ?>
            </div>
        </div>
    </div>

    <!-- Productos recomendados -->
    <?php if (!empty($items)): ?>
        <section class="py-5 bg-light">
            <div class="container">
                <h3 class="text-center mb-4">Te puede interesar</h3>
                <div class="row">
                    <?php
                    // Obtener productos relacionados (ejemplo: misma categoría o misma mueblería)
                    $productos_recomendados = [];
                    if (!empty($items)) {
                        $primer_producto = $items[0]['producto'];
                        $sql = "SELECT p.* FROM Productos p 
                                WHERE p.id_muebleria = ? AND p.tipo_producto = 'producto_final' 
                                AND p.id_producto NOT IN (" . implode(',', array_column($items, 'producto')) . ")
                                ORDER BY RAND() LIMIT 4";
                        $productos_recomendados = obtenerRegistros($sql, [$primer_producto['id_muebleria']]);
                    }
                    
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
                                    <form method="POST" action="muebleria.php?id=<?php echo $producto['id_muebleria']; ?>">
                                        <input type="hidden" name="accion" value="agregar_carrito">
                                        <input type="hidden" name="id_producto" value="<?php echo $producto['id_producto']; ?>">
                                        <button type="submit" class="btn btn-outline-primary btn-sm w-100">
                                            <i class="bi bi-cart-plus"></i> Agregar
                                        </button>
                                    </form>
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
    <script>
        // Auto-enviar formulario cuando se cambia la cantidad
        document.querySelectorAll('input[name^="cantidades"]').forEach(input => {
            input.addEventListener('change', function() {
                document.getElementById('formActualizarCarrito').submit();
            });
        });
    </script>
</body>
</html>
