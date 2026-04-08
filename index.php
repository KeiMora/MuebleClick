<?php
session_start();
require_once 'config/database.php';
require_once 'includes/functions.php';

// Obtener todas las mueblerías activas
$mueblerias = obtenerMuebleriasActivas($conn);
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MuebleClick - Tu Plataforma de Muebles</title>
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
                        <a class="nav-link" href="#mueblerias">Mueblerías</a>
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
                        <li class="nav-item">
                            <a class="nav-link" href="registro.php">Registrarse</a>
                        </li>
                    <?php endif; ?>
                </ul>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section class="hero-section">
        <div class="container">
            <div class="row align-items-center">
                <div class="col-lg-6">
                    <h1 class="display-4 fw-bold text-white mb-4">Descubre los Mejores Muebles</h1>
                    <p class="lead text-white mb-4">Explora nuestro catálogo de las mejores mueblerías y encuentra el mueble perfecto para tu hogar.</p>
                    <a href="#mueblerias" class="btn btn-light btn-lg">Ver Mueblerías</a>
                </div>
                <div class="col-lg-6">
                    <div class="hero-image">
                        <img src="assets/images/hero-furniture.jpg" alt="Muebles" class="img-fluid rounded">
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Estadísticas -->
    <section class="py-5 bg-light">
        <div class="container">
            <div class="row text-center">
                <div class="col-md-3">
                    <div class="stat-item">
                        <h3 class="text-primary"><?php echo count($mueblerias); ?></h3>
                        <p>Mueblerías</p>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="stat-item">
                        <h3 class="text-primary">500+</h3>
                        <p>Productos</p>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="stat-item">
                        <h3 class="text-primary">24/7</h3>
                        <p>Soporte</p>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="stat-item">
                        <h3 class="text-primary">Envío</h3>
                        <p>a todo México</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Mueblerías -->
    <section id="mueblerias" class="py-5">
        <div class="container">
            <h2 class="text-center mb-5">Nuestras Mueblerías Asociadas</h2>
            <div class="row">
                <?php foreach ($mueblerias as $muebleria): ?>
                    <div class="col-lg-4 col-md-6 mb-4">
                        <div class="card muebleria-card h-100">
                            <img src="assets/images/mueblerias/<?php echo $muebleria['id_muebleria']; ?>/logo.jpg" 
                                 class="card-img-top" alt="<?php echo htmlspecialchars($muebleria['nombre_negocio']); ?>"
                                 onerror="this.src='assets/images/default-muebleria.jpg'">
                            <div class="card-body">
                                <h5 class="card-title"><?php echo htmlspecialchars($muebleria['nombre_negocio']); ?></h5>
                                <p class="card-text"><?php echo htmlspecialchars($muebleria['razon_social']); ?></p>
                                <p class="card-text">
                                    <i class="bi bi-geo-alt"></i> <?php echo htmlspecialchars($muebleria['direccion_principal']); ?>
                                </p>
                                <p class="card-text">
                                    <i class="bi bi-telephone"></i> <?php echo htmlspecialchars($muebleria['telefono']); ?>
                                </p>
                            </div>
                            <div class="card-footer bg-transparent">
                                <a href="muebleria.php?id=<?php echo $muebleria['id_muebleria']; ?>" 
                                   class="btn btn-primary w-100">Ver Catálogo</a>
                            </div>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="bg-dark text-white py-4 mt-5">
        <div class="container">
            <div class="row">
                <div class="col-md-4">
                    <h5>MuebleClick</h5>
                    <p>Tu plataforma de confianza para encontrar los mejores muebles.</p>
                </div>
                <div class="col-md-4">
                    <h5>Enlaces Rápidos</h5>
                    <ul class="list-unstyled">
                        <li><a href="index.php" class="text-white">Inicio</a></li>
                        <li><a href="nosotros.php" class="text-white">Nosotros</a></li>
                        <li><a href="contacto.php" class="text-white">Contacto</a></li>
                    </ul>
                </div>
                <div class="col-md-4">
                    <h5>Contacto</h5>
                    <p><i class="bi bi-envelope"></i> info@muebleclick.com</p>
                    <p><i class="bi bi-phone"></i> +52 123 456 7890</p>
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
