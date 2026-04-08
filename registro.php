<?php
session_start();
require_once 'config/database.php';
require_once 'includes/functions.php';

// Si ya está logueado, redirigir al inicio
if (estaLogueado()) {
    header('Location: index.php');
    exit;
}

$error = '';
$exito = '';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $nombre = limpiarDatos($_POST['nombre']);
    $correo = limpiarDatos($_POST['correo']);
    $password = $_POST['password'];
    $password_confirm = $_POST['password_confirm'];
    $telefono = limpiarDatos($_POST['telefono']);
    
    // Validar CSRF token
    if (!verificarTokenCSRF($_POST['csrf_token'])) {
        $error = 'Solicitud inválida. Por favor, inténtalo de nuevo.';
    } elseif (empty($nombre) || empty($correo) || empty($password) || empty($password_confirm)) {
        $error = 'Por favor, completa todos los campos obligatorios.';
    } elseif (!validarEmail($correo)) {
        $error = 'El correo electrónico no es válido.';
    } elseif (strlen($password) < 8) {
        $error = 'La contraseña debe tener al menos 8 caracteres.';
    } elseif ($password !== $password_confirm) {
        $error = 'Las contraseñas no coinciden.';
    } else {
        $resultado = registrarUsuario($conn, $nombre, $correo, $password);
        if ($resultado['success']) {
            // Actualizar teléfono del cliente si se proporcionó
            if (!empty($telefono)) {
                $sql = "UPDATE Cliente SET telefono = ? WHERE id_usuario = ?";
                actualizarRegistro($sql, [$telefono, $resultado['id_usuario']]);
            }
            
            $_SESSION['mensaje_exito'] = '¡Cuenta creada exitosamente! Ahora puedes iniciar sesión.';
            header('Location: login.php');
            exit;
        } else {
            $error = $resultado['message'];
        }
    }
}

$csrf_token = generarTokenCSRF();
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registrarse - MuebleClick</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css">
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body class="bg-light">
    <!-- Navegación -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
        <div class="container">
            <a class="navbar-brand" href="index.php">
                <i class="bi bi-shop"></i> MuebleClick
            </a>
            <div class="navbar-nav ms-auto">
                <a class="nav-link" href="index.php">Inicio</a>
                <a class="nav-link" href="login.php">Iniciar Sesión</a>
            </div>
        </div>
    </nav>

    <!-- Contenido Principal -->
    <div class="container mt-5">
        <div class="row justify-content-center">
            <div class="col-md-8 col-lg-6">
                <div class="card shadow">
                    <div class="card-body p-4">
                        <div class="text-center mb-4">
                            <i class="bi bi-person-plus text-primary" style="font-size: 4rem;"></i>
                            <h3 class="mt-3">Crear Cuenta</h3>
                            <p class="text-muted">Únete a MuebleClick y descubre los mejores muebles</p>
                        </div>

                        <?php if ($error): ?>
                            <div class="alert alert-danger" role="alert">
                                <i class="bi bi-exclamation-triangle"></i> <?php echo $error; ?>
                            </div>
                        <?php endif; ?>

                        <form method="POST" action="">
                            <input type="hidden" name="csrf_token" value="<?php echo $csrf_token; ?>">
                            
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label for="nombre" class="form-label">Nombre Completo *</label>
                                    <div class="input-group">
                                        <span class="input-group-text"><i class="bi bi-person"></i></span>
                                        <input type="text" class="form-control" id="nombre" name="nombre" 
                                               value="<?php echo isset($_POST['nombre']) ? htmlspecialchars($_POST['nombre']) : ''; ?>"
                                               placeholder="Tu nombre" required>
                                    </div>
                                </div>

                                <div class="col-md-6 mb-3">
                                    <label for="telefono" class="form-label">Teléfono</label>
                                    <div class="input-group">
                                        <span class="input-group-text"><i class="bi bi-telephone"></i></span>
                                        <input type="tel" class="form-control" id="telefono" name="telefono" 
                                               value="<?php echo isset($_POST['telefono']) ? htmlspecialchars($_POST['telefono']) : ''; ?>"
                                               placeholder="55-1234-5678">
                                    </div>
                                </div>
                            </div>

                            <div class="mb-3">
                                <label for="correo" class="form-label">Correo Electrónico *</label>
                                <div class="input-group">
                                    <span class="input-group-text"><i class="bi bi-envelope"></i></span>
                                    <input type="email" class="form-control" id="correo" name="correo" 
                                           value="<?php echo isset($_POST['correo']) ? htmlspecialchars($_POST['correo']) : ''; ?>"
                                           placeholder="tu@email.com" required>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label for="password" class="form-label">Contraseña *</label>
                                    <div class="input-group">
                                        <span class="input-group-text"><i class="bi bi-lock"></i></span>
                                        <input type="password" class="form-control" id="password" name="password" 
                                               placeholder="Mínimo 8 caracteres" required minlength="8">
                                        <button class="btn btn-outline-secondary" type="button" id="togglePassword">
                                            <i class="bi bi-eye"></i>
                                        </button>
                                    </div>
                                </div>

                                <div class="col-md-6 mb-3">
                                    <label for="password_confirm" class="form-label">Confirmar Contraseña *</label>
                                    <div class="input-group">
                                        <span class="input-group-text"><i class="bi bi-lock-fill"></i></span>
                                        <input type="password" class="form-control" id="password_confirm" name="password_confirm" 
                                               placeholder="Repite tu contraseña" required minlength="8">
                                        <button class="btn btn-outline-secondary" type="button" id="togglePasswordConfirm">
                                            <i class="bi bi-eye"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <!-- Validación de contraseña -->
                            <div class="mb-3">
                                <small class="text-muted">La contraseña debe contener:</small>
                                <div class="row mt-2">
                                    <div class="col-6">
                                        <small id="length" class="text-muted">
                                            <i class="bi bi-circle"></i> Mínimo 8 caracteres
                                        </small>
                                    </div>
                                    <div class="col-6">
                                        <small id="match" class="text-muted">
                                            <i class="bi bi-circle"></i> Las contraseñas coinciden
                                        </small>
                                    </div>
                                </div>
                            </div>

                            <div class="mb-3 form-check">
                                <input type="checkbox" class="form-check-input" id="terminos" name="terminos" required>
                                <label class="form-check-label" for="terminos">
                                    Acepto los <a href="#" data-bs-toggle="modal" data-bs-target="#terminosModal">términos y condiciones</a> 
                                    y la <a href="#" data-bs-toggle="modal" data-bs-target="#privacidadModal">política de privacidad</a>
                                </label>
                            </div>

                            <div class="mb-3 form-check">
                                <input type="checkbox" class="form-check-input" id="newsletter" name="newsletter">
                                <label class="form-check-label" for="newsletter">
                                    Deseo recibir ofertas y novedades por correo electrónico
                                </label>
                            </div>

                            <div class="d-grid">
                                <button type="submit" class="btn btn-primary btn-lg">
                                    <i class="bi bi-person-plus"></i> Crear Cuenta
                                </button>
                            </div>
                        </form>

                        <hr class="my-4">

                        <div class="text-center">
                            <p class="mb-2">¿Ya tienes una cuenta?</p>
                            <a href="login.php" class="btn btn-outline-primary">
                                <i class="bi bi-box-arrow-in-right"></i> Iniciar Sesión
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal Términos y Condiciones -->
    <div class="modal fade" id="terminosModal" tabindex="-1">
        <div class="modal-dialog modal-dialog-scrollable">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Términos y Condiciones</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <h6>1. Aceptación de los Términos</h6>
                    <p>Al registrarte en MuebleClick, aceptas estos términos y condiciones en su totalidad.</p>
                    
                    <h6>2. Uso del Sitio</h6>
                    <p>Te comprometes a utilizar el sitio de manera responsable y conforme a la legislación aplicable.</p>
                    
                    <h6>3. Cuentas de Usuario</h6>
                    <p>Eres responsable de mantener la confidencialidad de tu contraseña y cuenta.</p>
                    
                    <h6>4. Privacidad</h6>
                    <p>Tu información personal será tratada conforme a nuestra política de privacidad.</p>
                    
                    <h6>5. Propiedad Intelectual</h6>
                    <p>Todo el contenido del sitio es propiedad de MuebleClick o de sus licenciantes.</p>
                    
                    <h6>6. Modificaciones</h6>
                    <p>Nos reservamos el derecho de modificar estos términos en cualquier momento.</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal Política de Privacidad -->
    <div class="modal fade" id="privacidadModal" tabindex="-1">
        <div class="modal-dialog modal-dialog-scrollable">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Política de Privacidad</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <h6>1. Información que Recopilamos</h6>
                    <p>Recopilamos información personal que nos proporcionas al registrarte y utilizar nuestros servicios.</p>
                    
                    <h6>2. Uso de la Información</h6>
                    <p>Utilizamos tu información para proporcionar servicios, mejorar nuestra plataforma y comunicarnos contigo.</p>
                    
                    <h6>3. Compartir Información</h6>
                    <p>No vendemos ni compartimos tu información personal con terceros, excepto cuando es necesario para nuestros servicios.</p>
                    
                    <h6>4. Seguridad</h6>
                    <p>Implementamos medidas de seguridad adecuadas para proteger tu información personal.</p>
                    
                    <h6>5. Cookies</h6>
                    <p>Utilizamos cookies para mejorar tu experiencia en nuestro sitio.</p>
                    
                    <h6>6. Contacto</h6>
                    <p>Para cualquier pregunta sobre nuestra política de privacidad, contáctanos en privacy@muebleclick.com</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Footer -->
    <footer class="bg-dark text-white py-4 mt-5">
        <div class="container">
            <div class="text-center">
                <p>&copy; 2024 MuebleClick. Todos los derechos reservados.</p>
            </div>
        </div>
    </footer>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        // Toggle password visibility
        document.getElementById('togglePassword').addEventListener('click', function() {
            const passwordInput = document.getElementById('password');
            const icon = this.querySelector('i');
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.classList.remove('bi-eye');
                icon.classList.add('bi-eye-slash');
            } else {
                passwordInput.type = 'password';
                icon.classList.remove('bi-eye-slash');
                icon.classList.add('bi-eye');
            }
        });

        document.getElementById('togglePasswordConfirm').addEventListener('click', function() {
            const passwordInput = document.getElementById('password_confirm');
            const icon = this.querySelector('i');
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.classList.remove('bi-eye');
                icon.classList.add('bi-eye-slash');
            } else {
                passwordInput.type = 'password';
                icon.classList.remove('bi-eye-slash');
                icon.classList.add('bi-eye');
            }
        });

        // Validación de contraseña en tiempo real
        const password = document.getElementById('password');
        const passwordConfirm = document.getElementById('password_confirm');
        const lengthCheck = document.getElementById('length');
        const matchCheck = document.getElementById('match');

        function validatePassword() {
            // Validar longitud
            if (password.value.length >= 8) {
                lengthCheck.classList.remove('text-muted');
                lengthCheck.classList.add('text-success');
                lengthCheck.querySelector('i').classList.remove('bi-circle');
                lengthCheck.querySelector('i').classList.add('bi-check-circle');
            } else {
                lengthCheck.classList.remove('text-success');
                lengthCheck.classList.add('text-muted');
                lengthCheck.querySelector('i').classList.remove('bi-check-circle');
                lengthCheck.querySelector('i').classList.add('bi-circle');
            }

            // Validar coincidencia
            if (password.value === passwordConfirm.value && password.value.length > 0) {
                matchCheck.classList.remove('text-muted');
                matchCheck.classList.add('text-success');
                matchCheck.querySelector('i').classList.remove('bi-circle');
                matchCheck.querySelector('i').classList.add('bi-check-circle');
            } else {
                matchCheck.classList.remove('text-success');
                matchCheck.classList.add('text-muted');
                matchCheck.querySelector('i').classList.remove('bi-check-circle');
                matchCheck.querySelector('i').classList.add('bi-circle');
            }
        }

        password.addEventListener('input', validatePassword);
        passwordConfirm.addEventListener('input', validatePassword);
    </script>
</body>
</html>
