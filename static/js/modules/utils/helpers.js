// helpers.js - FUNCIONES AUXILIARES
export let isLoading = false;

export function showLoading() {
    isLoading = true;
    document.body.style.cursor = 'wait';
}

export function hideLoading() {
    isLoading = false;
    document.body.style.cursor = 'default';
}

export function getEstadoClass(estado) {
    if (!estado) return 'estado-pendiente';
    
    if (typeof estado === 'boolean') {
        return estado ? 'estado-aprobado' : 'estado-rechazado';
    }
    
    const est = estado.toString().toLowerCase();
    if (est.includes('aprob')) return 'estado-aprobado';
    if (est.includes('pend') || est.includes('revis')) return 'estado-pendiente';
    if (est.includes('rechaz')) return 'estado-rechazado';
    if (est.includes('observ')) return 'estado-observado';
    return 'estado-pendiente';
}

export function formatearFecha(fecha) {
    if (!fecha) return 'N/A';
    try {
        return new Date(fecha).toLocaleDateString('es-ES');
    } catch {
        return fecha;
    }
}

export function validarDNI(dni) {
    return dni && dni.length >= 8 && dni.length <= 11;
}

export function mostrarNotificacion(mensaje, tipo = 'info') {
    const notificacion = document.createElement('div');
    notificacion.className = `notificacion notificacion-${tipo}`;
    notificacion.innerHTML = `
        <span class="notificacion-icono">${tipo === 'exito' ? '✅' : tipo === 'error' ? '❌' : 'ℹ️'}</span>
        <span class="notificacion-mensaje">${mensaje}</span>
        <button class="notificacion-cerrar" onclick="this.parentElement.remove()">&times;</button>
    `;
    
    document.body.appendChild(notificacion);
    
    setTimeout(() => {
        if (notificacion.parentElement) {
            notificacion.remove();
        }
    }, 5000);
}

export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

export function generarIdUnico() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
