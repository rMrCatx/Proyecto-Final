// contacto.js - Funcionalidad para la página de contacto

document.addEventListener('DOMContentLoaded', function() {
    // Elementos del formulario
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const formSpinner = document.getElementById('formSpinner');
    const formMessage = document.getElementById('formMessage');
    
    // Elementos de error
    const nombreError = document.getElementById('nombreError');
    const emailError = document.getElementById('emailError');
    const asuntoError = document.getElementById('asuntoError');
    const mensajeError = document.getElementById('mensajeError');
    
    // Botón de mapa
    const viewMapBtn = document.getElementById('viewMapBtn');
    
    // FAQ
    const faqItems = document.querySelectorAll('.faq-item');
    
    // Validación en tiempo real
    const nombreInput = document.getElementById('nombre');
    const emailInput = document.getElementById('email');
    const asuntoSelect = document.getElementById('asunto');
    const mensajeTextarea = document.getElementById('mensaje');
    
    // Validar nombre
    if (nombreInput) {
        nombreInput.addEventListener('input', function() {
            if (nombreInput.value.trim().length < 2) {
                nombreError.textContent = 'El nombre debe tener al menos 2 caracteres';
                nombreInput.style.borderColor = '#ef4444';
            } else {
                nombreError.textContent = '';
                nombreInput.style.borderColor = '#10B981';
            }
        });
    }
    
    // Validar email
    if (emailInput) {
        emailInput.addEventListener('input', function() {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailInput.value)) {
                emailError.textContent = 'Ingresa un email válido';
                emailInput.style.borderColor = '#ef4444';
            } else {
                emailError.textContent = '';
                emailInput.style.borderColor = '#10B981';
            }
        });
    }
    
    // Validar asunto
    if (asuntoSelect) {
        asuntoSelect.addEventListener('change', function() {
            if (asuntoSelect.value === '') {
                asuntoError.textContent = 'Por favor selecciona un asunto';
                asuntoSelect.style.borderColor = '#ef4444';
            } else {
                asuntoError.textContent = '';
                asuntoSelect.style.borderColor = '#10B981';
            }
        });
    }
    
    // Validar mensaje
    if (mensajeTextarea) {
        mensajeTextarea.addEventListener('input', function() {
            if (mensajeTextarea.value.trim().length < 10) {
                mensajeError.textContent = 'El mensaje debe tener al menos 10 caracteres';
                mensajeTextarea.style.borderColor = '#ef4444';
            } else {
                mensajeError.textContent = '';
                mensajeTextarea.style.borderColor = '#10B981';
            }
        });
    }
    
    // Envío del formulario
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validar todos los campos
            let isValid = true;
            
            if (nombreInput.value.trim().length < 2) {
                nombreError.textContent = 'El nombre debe tener al menos 2 caracteres';
                isValid = false;
            }
            
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailInput.value)) {
                emailError.textContent = 'Ingresa un email válido';
                isValid = false;
            }
            
            if (asuntoSelect.value === '') {
                asuntoError.textContent = 'Por favor selecciona un asunto';
                isValid = false;
            }
            
            if (mensajeTextarea.value.trim().length < 10) {
                mensajeError.textContent = 'El mensaje debe tener al menos 10 caracteres';
                isValid = false;
            }
            
            if (!isValid) {
                showFormMessage('Por favor corrige los errores en el formulario', 'error');
                return;
            }
            
            // Mostrar spinner y deshabilitar botón
            submitBtn.disabled = true;
            formSpinner.style.display = 'block';
            submitBtn.innerHTML = 'Enviando... <span class="spinner"></span>';
            
            // Simular envío
            setTimeout(function() {
                // Éxito
                showFormMessage('¡Mensaje enviado con éxito! Te responderemos en menos de 24 horas.', 'success');
                
                // Resetear formulario
                contactForm.reset();
                
                // Resetear estilos
                if (nombreInput) nombreInput.style.borderColor = '#e5e7eb';
                if (emailInput) emailInput.style.borderColor = '#e5e7eb';
                if (asuntoSelect) asuntoSelect.style.borderColor = '#e5e7eb';
                if (mensajeTextarea) mensajeTextarea.style.borderColor = '#e5e7eb';
                
                // Limpiar errores
                if (nombreError) nombreError.textContent = '';
                if (emailError) emailError.textContent = '';
                if (asuntoError) asuntoError.textContent = '';
                if (mensajeError) mensajeError.textContent = '';
                
                // Restaurar botón
                setTimeout(function() {
                    submitBtn.disabled = false;
                    formSpinner.style.display = 'none';
                    submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar Mensaje';
                }, 2000);
            }, 2000);
        });
    }
    
    // Función para mostrar mensajes del formulario
    function showFormMessage(message, type) {
        if (formMessage) {
            formMessage.textContent = message;
            formMessage.className = 'form-message ' + type;
            formMessage.style.display = 'block';
            
            // Ocultar mensaje después de 5 segundos
            setTimeout(function() {
                formMessage.style.display = 'none';
            }, 5000);
        }
    }
    
    // Botón de ver mapa
    if (viewMapBtn) {
        viewMapBtn.addEventListener('click', function() {
            const confirmar = confirm('¿Deseas abrir Google Maps para ver nuestra ubicación?');
            if (confirmar) {
                // Coordenadas de ejemplo (San Salvador)
                const lat = 13.6929;
                const lon = -89.2182;
                window.open(`https://www.google.com/maps?q=${lat},${lon}`, '_blank');
            }
        });
    }
    
    // FAQ - Funcionalidad de acordeón
    if (faqItems && faqItems.length > 0) {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            
            if (question) {
                question.addEventListener('click', function() {
                    // Cerrar otros items
                    faqItems.forEach(otherItem => {
                        if (otherItem !== item) {
                            otherItem.classList.remove('active');
                        }
                    });
                    
                    // Alternar el item actual
                    item.classList.toggle('active');
                });
            }
        });
    }
    
    // Efecto de escritura automática para el placeholder del mensaje
    if (mensajeTextarea) {
        const placeholderText = "Escribe tu mensaje aquí... ¿En qué podemos ayudarte hoy?";
        let i = 0;
        
        function typeWriter() {
            if (i < placeholderText.length) {
                mensajeTextarea.placeholder = placeholderText.substring(0, i + 1);
                i++;
                setTimeout(typeWriter, 50);
            }
        }
        
        // Iniciar efecto cuando el textarea recibe foco
        mensajeTextarea.addEventListener('focus', function() {
            if (i === 0) {
                typeWriter();
            }
        });
    }
    
    // Validar número de teléfono (si existe el campo)
    const telefonoInput = document.getElementById('telefono');
    if (telefonoInput) {
        telefonoInput.addEventListener('input', function() {
            // Limpiar formato
            let value = telefonoInput.value.replace(/\D/g, '');
            
            // Aplicar formato (503) 2222-0000
            if (value.length > 0) {
                if (value.length <= 4) {
                    telefonoInput.value = value;
                } else if (value.length <= 8) {
                    telefonoInput.value = value.substring(0, 4) + '-' + value.substring(4);
                } else {
                    telefonoInput.value = value.substring(0, 4) + '-' + value.substring(4, 8);
                }
            }
        });
    }
    
    // Efecto de carga para botones de navegación
    const navLinks = document.querySelectorAll('a[href^="http"], a[href$=".html"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href') && !this.getAttribute('target')) {
                // Solo para enlaces internos sin target _blank
                const linkText = this.textContent || 'Cargando...';
                this.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${linkText}`;
                this.style.pointerEvents = 'none';
            }
        });
    });
}); // ← CIERRE del DOMContentLoaded