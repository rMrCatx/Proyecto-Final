// JavaScript Principal para el Blog del Politécnico
// Funcionalidades compartidas entre todas las páginas

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar componentes comunes
    initCommonComponents();
    
    // Cargar datos iniciales si es necesario
    if (typeof loadInitialData === 'function') {
        loadInitialData();
    }
});

function initCommonComponents() {
    // Inicializar sistema de comentarios si existe
    if (typeof initComments === 'function') {
        initComments();
    }
    
    // Inicializar sistema de likes si existe
    if (typeof initLikes === 'function') {
        initLikes();
    }
    
    // Inicializar tooltips
    initTooltips();
    
    // Inicializar modales
    initModals();
    
    // Inicializar formularios
    initForms();
}

// Sistema de Tooltips
function initTooltips() {
    const tooltips = document.querySelectorAll('[data-tooltip]');
    
    tooltips.forEach(element => {
        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
    });
}

function showTooltip(event) {
    const tooltipText = event.target.getAttribute('data-tooltip');
    if (!tooltipText) return;
    
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = tooltipText;
    
    document.body.appendChild(tooltip);
    
    const rect = event.target.getBoundingClientRect();
    tooltip.style.position = 'fixed';
    tooltip.style.top = (rect.top - tooltip.offsetHeight - 10) + 'px';
    tooltip.style.left = (rect.left + (rect.width - tooltip.offsetWidth) / 2) + 'px';
    tooltip.style.zIndex = '10000';
}

function hideTooltip() {
    const tooltip = document.querySelector('.tooltip');
    if (tooltip) {
        tooltip.remove();
    }
}

// Sistema de Modales
function initModals() {
    const modalTriggers = document.querySelectorAll('[data-modal]');
    
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', openModal);
    });
    
    // Cerrar modales con Escape
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeAllModals();
        }
    });
}

function openModal(event) {
    const modalId = event.target.getAttribute('data-modal');
    const modal = document.getElementById(modalId);
    
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function closeAllModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.style.display = 'none';
    });
    document.body.style.overflow = 'auto';
}

// Sistema de Formularios
function initForms() {
    const forms = document.querySelectorAll('form:not([data-no-validate])');
    
    forms.forEach(form => {
        form.addEventListener('submit', validateForm);
    });
}

function validateForm(event) {
    const form = event.target;
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            highlightError(field);
        } else {
            removeError(field);
        }
    });
    
    if (!isValid) {
        event.preventDefault();
        alert('Por favor, complete todos los campos obligatorios.');
    }
}

function highlightError(field) {
    field.style.borderColor = '#EF4444';
    field.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
}

function removeError(field) {
    field.style.borderColor = '';
    field.style.boxShadow = '';
}

// Sistema de Comentarios (simulado)
function initComments() {
    const commentForms = document.querySelectorAll('.comment-form');
    
    commentForms.forEach(form => {
        form.addEventListener('submit', submitComment);
    });
}

function submitComment(event) {
    event.preventDefault();
    
    const form = event.target;
    const name = form.querySelector('[name="name"]')?.value || 'Anónimo';
    const comment = form.querySelector('[name="comment"]')?.value;
    
    if (!comment.trim()) {
        alert('Por favor, escribe un comentario.');
        return;
    }
    
    // Crear elemento de comentario
    const commentList = form.closest('.comments-section')?.querySelector('.comments-list');
    if (commentList) {
        const commentElement = document.createElement('div');
        commentElement.className = 'comment';
        commentElement.innerHTML = `
            <div class="comment-header">
                <strong>${name}</strong>
                <span class="comment-date">Justo ahora</span>
            </div>
            <div class="comment-body">
                <p>${comment}</p>
            </div>
            <div class="comment-actions">
                <button class="like-btn" onclick="toggleLike(this)">
                    <i class="far fa-thumbs-up"></i> <span>0</span>
                </button>
                <button class="reply-btn" onclick="toggleReplyForm(this)">Responder</button>
            </div>
        `;
        
        commentList.appendChild(commentElement);
        
        // Resetear formulario
        form.reset();
        
        // Mostrar mensaje de éxito
        const successMsg = document.createElement('div');
        successMsg.className = 'success-message';
        successMsg.textContent = '¡Comentario publicado!';
        successMsg.style.cssText = 'background-color: #10B981; color: white; padding: 10px; border-radius: 5px; margin-top: 10px; text-align: center;';
        
        form.appendChild(successMsg);
        
        // Remover mensaje después de 3 segundos
        setTimeout(() => {
            successMsg.remove();
        }, 3000);
    }
}

function toggleLike(button) {
    const countSpan = button.querySelector('span');
    const icon = button.querySelector('i');
    let count = parseInt(countSpan.textContent);
    
    if (button.classList.contains('liked')) {
        count--;
        button.classList.remove('liked');
        icon.className = 'far fa-thumbs-up';
    } else {
        count++;
        button.classList.add('liked');
        icon.className = 'fas fa-thumbs-up';
    }
    
    countSpan.textContent = count;
}

function toggleReplyForm(button) {
    const comment = button.closest('.comment');
    const existingForm = comment.querySelector('.reply-form');
    
    if (existingForm) {
        existingForm.remove();
        return;
    }
    
    const replyForm = document.createElement('div');
    replyForm.className = 'reply-form';
    replyForm.innerHTML = `
        <form class="comment-form" onsubmit="submitReply(event, this)">
            <textarea name="reply" placeholder="Escribe tu respuesta..." required></textarea>
            <div style="display: flex; gap: 10px; margin-top: 10px;">
                <button type="submit" class="btn-primary">Responder</button>
                <button type="button" class="btn-secondary" onclick="this.closest('.reply-form').remove()">Cancelar</button>
            </div>
        </form>
    `;
    
    const commentActions = button.closest('.comment-actions');
    commentActions.parentNode.insertBefore(replyForm, commentActions.nextSibling);
}

function submitReply(event, form) {
    event.preventDefault();
    
    const reply = form.querySelector('[name="reply"]').value;
    const originalComment = form.closest('.comment');
    
    const replyElement = document.createElement('div');
    replyElement.className = 'comment reply';
    replyElement.innerHTML = `
        <div class="comment-header">
            <strong>Tú</strong>
            <span class="comment-date">Justo ahora</span>
        </div>
        <div class="comment-body">
            <p>${reply}</p>
        </div>
    `;
    
    const commentActions = originalComment.querySelector('.comment-actions');
    originalComment.insertBefore(replyElement, commentActions);
    
    form.remove();
}

// Sistema de Búsqueda
function initSearch() {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    
    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') performSearch();
        });
    }
}

function performSearch() {
    const query = document.getElementById('search-input')?.value.trim();
    if (!query) return;
    
    // En una aplicación real, aquí haríamos una petición al servidor
    // Por ahora simulamos resultados
    alert(`Buscando: "${query}"\n\nEsta funcionalidad está simulada. En una aplicación real, se mostrarían resultados reales.`);
}

// Utilidades
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background-color: ${type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#3B82F6'};
        color: white;
        border-radius: 5px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Estilos CSS para las funcionalidades
const dynamicStyles = document.createElement('style');
dynamicStyles.textContent = `
    .tooltip {
        background-color: #1f2937;
        color: white;
        padding: 8px 12px;
        border-radius: 4px;
        font-size: 0.9rem;
        max-width: 200px;
        text-align: center;
        box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    }
    
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background-color: #3B82F6;
        color: white;
        border-radius: 5px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    }
    
    .notification-success {
        background-color: #10B981;
    }
    
    .notification-error {
        background-color: #EF4444;
    }
    
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .comment {
        padding: 15px;
        margin-bottom: 15px;
        background-color: #f9fafb;
        border-radius: 8px;
        border-left: 4px solid #8B5CF6;
    }
    
    .comment.reply {
        margin-left: 30px;
        background-color: #f3f4f6;
        border-left-color: #10B981;
    }
    
    .comment-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;
    }
    
    .comment-date {
        color: #6b7280;
        font-size: 0.9rem;
    }
    
    .comment-actions {
        display: flex;
        gap: 15px;
        margin-top: 10px;
    }
    
    .like-btn, .reply-btn {
        background: none;
        border: none;
        color: #6b7280;
        cursor: pointer;
        font-size: 0.9rem;
    }
    
    .like-btn:hover, .reply-btn:hover {
        color: #8B5CF6;
    }
    
    .like-btn.liked {
        color: #10B981;
    }
    
    .reply-form {
        margin-top: 15px;
        padding: 15px;
        background-color: #f8fafc;
        border-radius: 8px;
        border: 1px solid #e5e7eb;
    }
    
    .reply-form textarea {
        width: 100%;
        min-height: 80px;
        padding: 10px;
        border: 1px solid #d1d5db;
        border-radius: 5px;
        resize: vertical;
    }
`;

document.head.appendChild(dynamicStyles);