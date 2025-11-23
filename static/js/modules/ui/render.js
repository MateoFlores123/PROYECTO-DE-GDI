// render.js - RENDERIZADO DE TABLAS
import * as Helpers from '../utils/helpers.js';
import * as Update from '../crud/update.js';
import * as Delete from '../crud/delete.js';
import * as Exports from '../utils/exports.js';

export function renderizarExpedientes(data) {
    const tbody = document.getElementById('cuerpo-expedientes');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (!data || data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 20px;">No hay expedientes</td></tr>';
        return;
    }
    
    const datosLimitados = data.slice(0, 50);
    
    let html = '';
    datosLimitados.forEach(expediente => {
        const estadoClass = Helpers.getEstadoClass(expediente.estd);
        html += `
            <tr>
                <td>${expediente.nuex || 'N/A'}</td>
                <td>${expediente.fecha || 'N/A'}</td>
                <td><span class="estado-badge ${estadoClass}">${expediente.estd || 'N/A'}</span></td>
                <td>${expediente.aresp || 'N/A'}</td>
                <td>${expediente.asnt || 'N/A'}</td>
                <td>
                    <button class="btn btn-editar" onclick="window.Update.editarExpediente('${expediente.nuex}')">✏️ Editar</button>
                    <button class="btn btn-eliminar" onclick="window.Delete.eliminarExpediente('${expediente.nuex}', '${expediente.asnt}')">🗑️ Eliminar</button>
                </td>
            </tr>
        `;
    });
    
    tbody.innerHTML = html;
}

export function renderizarProveidos(data) {
    const tbody = document.getElementById('cuerpo-proveidos');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (!data || data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 20px;">No hay proveídos</td></tr>';
        return;
    }
    
    const datosLimitados = data.slice(0, 50);
    
    let html = '';
    datosLimitados.forEach(proveido => {
        html += `
            <tr>
                <td>${proveido.npro || 'N/A'}</td>
                <td>${proveido.fecha || 'N/A'}</td>
                <td>${proveido.nuex || 'N/A'}</td>
                <td>${(proveido.ints || 'N/A').substring(0, 50)}${(proveido.ints || '').length > 50 ? '...' : ''}</td>
                <td>
                    <button class="btn btn-editar" onclick="editarProveido('${proveido.npro}')">✏️ Editar</button>
                    <button class="btn btn-eliminar" onclick="window.Delete.eliminarProveido('${proveido.npro}', '${proveido.nuex}')">🗑️ Eliminar</button>
                    <button class="btn btn-descargar" onclick="window.Exports.descargarProveido('${proveido.npro}')">📥 Descargar</button>
                </td>
            </tr>
        `;
    });
    
    tbody.innerHTML = html;
}

export function renderizarPreResoluciones(data) {
    const tbody = document.getElementById('cuerpo-preresoluciones');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (!data || data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 20px;">No hay pre-resoluciones</td></tr>';
        return;
    }
    
    const datosLimitados = data.slice(0, 50);
    
    let html = '';
    datosLimitados.forEach(preresolucion => {
        const estadoClass = Helpers.getEstadoClass(preresolucion.estd);
        html += `
            <tr>
                <td>${preresolucion.nupr || 'N/A'}</td>
                <td>${preresolucion.fecha || 'N/A'}</td>
                <td><span class="estado-badge ${estadoClass}">${preresolucion.estd || 'N/A'}</span></td>
                <td>${preresolucion.nuex || 'N/A'}</td>
                <td>${preresolucion.analista || 'N/A'}</td>
                <td>
                    <button class="btn btn-editar" onclick="editarPreResolucion('${preresolucion.nupr}')">✏️ Editar</button>
                    <button class="btn btn-eliminar" onclick="window.Delete.eliminarPreResolucion('${preresolucion.nupr}', '${preresolucion.nuex}')">🗑️ Eliminar</button>
                    <button class="btn btn-descargar" onclick="window.Exports.descargarPreResolucion('${preresolucion.nupr}')">📥 Descargar</button>
                </td>
            </tr>
        `;
    });
    
    tbody.innerHTML = html;
}

export function renderizarAdministrados(data) {
    const tbody = document.getElementById('cuerpo-administrados');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (!data || data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 20px;">No hay administrados</td></tr>';
        return;
    }
    
    const datosLimitados = data.slice(0, 50);
    
    let html = '';
    datosLimitados.forEach(admin => {
        html += `
            <tr>
                <td>${admin.d_r || 'N/A'}</td>
                <td>${admin.noma || 'N/A'}</td>
                <td>${admin.dir_d || 'N/A'}</td>
                <td>${admin.dir_a || 'N/A'}</td>
                <td>${admin.dir_c || 'N/A'}</td>
                <td>${admin.dir_n || 'N/A'}</td>
                <td>
                    <button class="btn btn-editar" onclick="window.Update.editarAdministrado('${admin.d_r}')">✏️ Editar</button>
                    <button class="btn btn-eliminar" onclick="window.Delete.eliminarAdministrado('${admin.d_r}', '${admin.noma}')">🗑️ Eliminar</button>
                </td>
            </tr>
        `;
    });
    
    tbody.innerHTML = html;
}

export function renderizarSolicitudes(data) {
    const tbody = document.getElementById('cuerpo-solicitudes');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (!data || data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 20px;">No hay solicitudes</td></tr>';
        return;
    }
    
    const datosLimitados = data.slice(0, 50);
    
    let html = '';
    datosLimitados.forEach(solicitud => {
        const estadoClass = solicitud.estd ? 'estado-aprobado' : 'estado-pendiente';
        const estadoTexto = solicitud.estd ? 'Activa' : 'Inactiva';
        html += `
            <tr>
                <td>${solicitud.nums || 'N/A'}</td>
                <td>${solicitud.nombre_admin || 'N/A'}</td>
                <td>${solicitud.tita || 'N/A'}</td>
                <td>${solicitud.fecha || 'N/A'}</td>
                <td><span class="estado-badge ${estadoClass}">${estadoTexto}</span></td>
                <td>${solicitud.expediente || 'N/A'}</td>
                <td>
                    <button class="btn btn-editar" onclick="window.Update.editarSolicitud('${solicitud.nums}')">✏️ Editar</button>
                    <button class="btn btn-eliminar" onclick="window.Delete.eliminarSolicitud('${solicitud.nums}', '${solicitud.tita}')">🗑️ Eliminar</button>
                </td>
            </tr>
        `;
    });
    
    tbody.innerHTML = html;
}

export function mostrarError(tipo, mensaje) {
    const tbody = document.getElementById(`cuerpo-${tipo}`);
    if (tbody) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 20px; color: #e74c3c;">
                    ❌ ${mensaje}
                    <br><button class="btn" onclick="location.reload()" style="margin-top: 10px;">🔄 Reintentar</button>
                </td>
            </tr>
        `;
    }
}

// Agregar esta función al final de render.js

export function actualizarContadorExpedientes(cantidad) {
    const contador = document.getElementById('total-expedientes');
    if (contador) {
        contador.textContent = cantidad;
    }
    
    // También actualizar el contador en el dashboard si está visible
    const dashboardCounter = document.querySelector('#dashboard .card:nth-child(1) .card-number');
    if (dashboardCounter) {
        dashboardCounter.textContent = cantidad;
    }
}

// Agregar estas funciones en render.js

export function actualizarContadorProveidos(cantidad) {
    const contador = document.getElementById('total-proveidos');
    if (contador) {
        contador.textContent = cantidad;
    }
}

export function actualizarContadorPreResoluciones(cantidad) {
    const contador = document.getElementById('total-preresoluciones');
    if (contador) {
        contador.textContent = cantidad;
    }
}

export function actualizarContadorPendientes(cantidad) {
    const contador = document.getElementById('pendientes');
    if (contador) {
        contador.textContent = cantidad;
    }
}
