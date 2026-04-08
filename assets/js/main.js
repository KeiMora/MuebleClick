// Funciones JavaScript principales para MuebleClick

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar tooltips de Bootstrap
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Inicializar popovers de Bootstrap
    var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });

    // Auto-ocultar alertas después de 5 segundos
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(function(alert) {
        setTimeout(function() {
            alert.style.transition = 'opacity 0.5s ease';
            alert.style.opacity = '0';
            setTimeout(function() {
                alert.remove();
            }, 500);
        }, 5000);
    });

    // Animación de entrada para elementos
    const animatedElements = document.querySelectorAll('.fade-in-up');
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate__animated', 'animate__fadeInUp');
            }
        });
    });

    animatedElements.forEach(function(element) {
        observer.observe(element);
    });
});

// Función para mostrar notificaciones
function mostrarNotificacion(mensaje, tipo = 'info') {
    const notificacion = document.createElement('div');
    notificacion.className = `alert alert-${tipo} alert-dismissible fade show position-fixed`;
    notificacion.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    notificacion.innerHTML = `
        ${mensaje}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notificacion);
    
    // Auto-ocultar después de 3 segundos
    setTimeout(function() {
        notificacion.style.transition = 'opacity 0.5s ease';
        notificacion.style.opacity = '0';
        setTimeout(function() {
            notificacion.remove();
        }, 500);
    }, 3000);
}

// Función para confirmar acciones
function confirmarAccion(mensaje, callback) {
    if (confirm(mensaje)) {
        callback();
    }
}

// Función para manejar el carrito de compras
const carrito = {
    // Agregar producto al carrito
    agregar: function(idProducto, cantidad = 1) {
        const formData = new FormData();
        formData.append('accion', 'agregar_carrito');
        formData.append('id_producto', idProducto);
        formData.append('cantidad', cantidad);
        
        fetch('carrito.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                mostrarNotificacion(data.message || 'Producto agregado al carrito', 'success');
                this.actualizarContador();
            } else {
                mostrarNotificacion(data.message || 'Error al agregar producto', 'danger');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            mostrarNotificacion('Error de conexión', 'danger');
        });
    },
    
    // Eliminar producto del carrito
    eliminar: function(idProducto) {
        const formData = new FormData();
        formData.append('accion', 'eliminar');
        formData.append('id_producto', idProducto);
        
        fetch('carrito.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                mostrarNotificacion(data.message || 'Producto eliminado del carrito', 'success');
                this.actualizarContador();
                // Recargar la página si estamos en la página del carrito
                if (window.location.pathname.includes('carrito.php')) {
                    location.reload();
                }
            } else {
                mostrarNotificacion(data.message || 'Error al eliminar producto', 'danger');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            mostrarNotificacion('Error de conexión', 'danger');
        });
    },
    
    // Actualizar contador del carrito en la navegación
    actualizarContador: function() {
        fetch('api/carrito_contador.php')
        .then(response => response.json())
        .then(data => {
            const badge = document.querySelector('.navbar .badge.bg-danger');
            if (badge && data.count > 0) {
                badge.textContent = data.count;
                badge.style.display = 'inline-block';
            } else if (badge) {
                badge.style.display = 'none';
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
};

// Función para manejar la lista de deseos
const listaDeseos = {
    // Agregar a lista de deseos
    agregar: function(idProducto) {
        const formData = new FormData();
        formData.append('accion', 'agregar_deseos');
        formData.append('id_producto', idProducto);
        
        fetch('deseos.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                mostrarNotificacion(data.message || 'Producto agregado a la lista de deseos', 'success');
                this.actualizarIcono(idProducto, true);
            } else {
                mostrarNotificacion(data.message || 'Error al agregar a la lista de deseos', 'info');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            mostrarNotificacion('Error de conexión', 'danger');
        });
    },
    
    // Eliminar de lista de deseos
    eliminar: function(idProducto) {
        const formData = new FormData();
        formData.append('accion', 'eliminar');
        formData.append('id_producto', idProducto);
        
        fetch('deseos.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                mostrarNotificacion(data.message || 'Producto eliminado de la lista de deseos', 'success');
                this.actualizarIcono(idProducto, false);
                // Recargar la página si estamos en la página de deseos
                if (window.location.pathname.includes('deseos.php')) {
                    location.reload();
                }
            } else {
                mostrarNotificacion(data.message || 'Error al eliminar de la lista de deseos', 'danger');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            mostrarNotificacion('Error de conexión', 'danger');
        });
    },
    
    // Actualizar icono de corazón
    actualizarIcono: function(idProducto, activo) {
        const iconos = document.querySelectorAll(`[data-producto-id="${idProducto}"] .bi-heart, [data-producto-id="${idProducto}"] .bi-heart-fill`);
        iconos.forEach(function(icono) {
            if (activo) {
                icono.classList.remove('bi-heart');
                icono.classList.add('bi-heart-fill', 'text-danger');
            } else {
                icono.classList.remove('bi-heart-fill', 'text-danger');
                icono.classList.add('bi-heart');
            }
        });
    }
};

// Función para búsqueda en tiempo real
function busquedaEnTiempoReal(inputId, resultadosId, url) {
    const input = document.getElementById(inputId);
    const resultadosDiv = document.getElementById(resultadosId);
    let timeout;
    
    if (!input || !resultadosDiv) return;
    
    input.addEventListener('input', function() {
        clearTimeout(timeout);
        const query = this.value.trim();
        
        if (query.length < 2) {
            resultadosDiv.innerHTML = '';
            resultadosDiv.style.display = 'none';
            return;
        }
        
        timeout = setTimeout(function() {
            fetch(`${url}?q=${encodeURIComponent(query)}`)
                .then(response => response.json())
                .then(data => {
                    if (data.success && data.results.length > 0) {
                        let html = '<div class="list-group">';
                        data.results.forEach(function(item) {
                            html += `
                                <a href="${item.url}" class="list-group-item list-group-item-action">
                                    <div class="d-flex align-items-center">
                                        <img src="${item.imagen}" alt="${item.nombre}" class="me-3" style="width: 50px; height: 50px; object-fit: cover;">
                                        <div>
                                            <h6 class="mb-1">${item.nombre}</h6>
                                            <small class="text-muted">${item.descripcion || ''}</small>
                                        </div>
                                    </div>
                                </a>
                            `;
                        });
                        html += '</div>';
                        resultadosDiv.innerHTML = html;
                        resultadosDiv.style.display = 'block';
                    } else {
                        resultadosDiv.innerHTML = '<div class="p-3 text-muted">No se encontraron resultados</div>';
                        resultadosDiv.style.display = 'block';
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    resultadosDiv.innerHTML = '<div class="p-3 text-danger">Error en la búsqueda</div>';
                    resultadosDiv.style.display = 'block';
                });
        }, 300);
    });
    
    // Ocultar resultados al hacer clic fuera
    document.addEventListener('click', function(e) {
        if (!input.contains(e.target) && !resultadosDiv.contains(e.target)) {
            resultadosDiv.style.display = 'none';
        }
    });
}

// Función para validación de formularios
function validarFormulario(formId) {
    const form = document.getElementById(formId);
    if (!form) return false;
    
    let valido = true;
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    
    inputs.forEach(function(input) {
        if (!input.value.trim()) {
            input.classList.add('is-invalid');
            valido = false;
        } else {
            input.classList.remove('is-invalid');
        }
        
        // Validación específica para email
        if (input.type === 'email' && input.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value)) {
                input.classList.add('is-invalid');
                valido = false;
            }
        }
        
        // Validación específica para teléfono
        if (input.name === 'telefono' && input.value) {
            const phoneRegex = /^[\d\s\-\+\(\)]+$/;
            if (!phoneRegex.test(input.value)) {
                input.classList.add('is-invalid');
                valido = false;
            }
        }
    });
    
    return valido;
}

// Función para mostrar loading en botones
function mostrarLoading(boton, textoOriginal = 'Cargando...') {
    const textoOriginalBtn = boton.textContent;
    boton.disabled = true;
    boton.innerHTML = `<span class="spinner"></span> ${textoOriginal}`;
    
    return function() {
        boton.disabled = false;
        boton.textContent = textoOriginalBtn;
    };
}

// Función para scroll suave
function scrollSuave(elementoId, offset = 0) {
    const elemento = document.getElementById(elementoId);
    if (elemento) {
        const top = elemento.offsetTop - offset;
        window.scrollTo({
            top: top,
            behavior: 'smooth'
        });
    }
}

// Función para lazy loading de imágenes
function lazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(function(img) {
        imageObserver.observe(img);
    });
}

// Inicializar lazy loading
lazyLoading();

// Función para manejar el tema (claro/oscuro)
const tema = {
    activo: localStorage.getItem('tema') || 'claro',
    
    toggle: function() {
        this.activo = this.activo === 'claro' ? 'oscuro' : 'claro';
        localStorage.setItem('tema', this.activo);
        this.aplicar();
    },
    
    aplicar: function() {
        if (this.activo === 'oscuro') {
            document.body.classList.add('tema-oscuro');
        } else {
            document.body.classList.remove('tema-oscuro');
        }
    }
};

// Aplicar tema guardado
tema.aplicar();

// Exportar funciones para uso global
window.carrito = carrito;
window.listaDeseos = listaDeseos;
window.busquedaEnTiempoReal = busquedaEnTiempoReal;
window.validarFormulario = validarFormulario;
window.mostrarLoading = mostrarLoading;
window.scrollSuave = scrollSuave;
window.mostrarNotificacion = mostrarNotificacion;
window.confirmarAccion = confirmarAccion;
window.tema = tema;
