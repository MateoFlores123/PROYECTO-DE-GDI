// modals.js - SISTEMA DE MODALES
let modalAbierto = null;

export function mostrarModal(html) {
    if (modalAbierto) {
        document.body.removeChild(modalAbierto);
    }
    
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = html;
    document.body.appendChild(modalContainer);
    
    modalAbierto = modalContainer;
    
    const modal = modalContainer.querySelector('.modal');
    modal.style.display = 'block';
    
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            cerrarModal();
        }
    });
}

export function cerrarModal() {
    if (modalAbierto) {
        document.body.removeChild(modalAbierto);
        modalAbierto = null;
    }
}

export function mostrarModalAdministrado(admin) {
    const modalHTML = `
        <div id="modal-editar" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2 class="modal-title">✏️ Editar Administrado</h2>
                    <span class="close" onclick="window.Modals.cerrarModal()">&times;</span>
                </div>
                <div class="modal-body">
                    <form id="form-editar-administrado">
                        <div class="form-group">
                            <label for="editar-d_r">DNI/RUC:</label>
                            <input type="text" id="editar-d_r" value="${admin.d_r || ''}" class="readonly-field" readonly>
                        </div>
                        <div class="form-group">
                            <label for="editar-noma">Nombre Completo:</label>
                            <input type="text" id="editar-noma" value="${admin.noma || ''}" required>
                        </div>
                        <div class="form-group">
                            <label for="editar-dir_d">Dirección:</label>
                            <input type="text" id="editar-dir_d" value="${admin.dir_d || ''}" required>
                        </div>
                        <div class="form-group">
                            <label for="editar-dir_a">Urbanización:</label>
                            <input type="text" id="editar-dir_a" value="${admin.dir_a || ''}" required>
                        </div>
                        <div class="form-group">
                            <label for="editar-dir_c">Ciudad:</label>
                            <input type="text" id="editar-dir_c" value="${admin.dir_c || ''}" required>
                        </div>
                        <div class="form-group">
                            <label for="editar-dir_n">Calle/Jr/Av:</label>
                            <input type="text" id="editar-dir_n" value="${admin.dir_n || ''}" required>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-cancelar" onclick="window.Modals.cerrarModal()">❌ Cancelar</button>
                    <button class="btn btn-guardar" onclick="window.Update.guardarAdministrado()">💾 Guardar Cambios</button>
                </div>
            </div>
        </div>
    `;
    
    mostrarModal(modalHTML);
}

export function mostrarModalSolicitud(solicitud) {
    const estado = solicitud.estd ? 'true' : 'false';
    const modalHTML = `
        <div id="modal-editar" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2 class="modal-title">✏️ Editar Solicitud</h2>
                    <span class="close" onclick="window.Modals.cerrarModal()">&times;</span>
                </div>
                <div class="modal-body">
                    <form id="form-editar-solicitud">
                        <div class="form-group">
                            <label for="editar-nums">N° Solicitud:</label>
                            <input type="text" id="editar-nums" value="${solicitud.nums || ''}" class="readonly-field" readonly>
                        </div>
                        <div class="form-group">
                            <label for="editar-tita">Título:</label>
                            <input type="text" id="editar-tita" value="${solicitud.tita || ''}" required>
                        </div>
                        <div class="form-group">
                            <label for="editar-estd">Estado:</label>
                            <select id="editar-estd" required>
                                <option value="true" ${estado === 'true' ? 'selected' : ''}>Activa</option>
                                <option value="false" ${estado === 'false' ? 'selected' : ''}>Inactiva</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="editar-asnt">Asunto:</label>
                            <textarea id="editar-asnt" required>${solicitud.asnt || ''}</textarea>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-cancelar" onclick="window.Modals.cerrarModal()">❌ Cancelar</button>
                    <button class="btn btn-guardar" onclick="window.Update.guardarSolicitud()">💾 Guardar Cambios</button>
                </div>
            </div>
        </div>
    `;
    
    mostrarModal(modalHTML);
}

export function mostrarModalExpediente(expediente) {
    const modalHTML = `
        <div id="modal-editar" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2 class="modal-title">✏️ Editar Expediente</h2>
                    <span class="close" onclick="window.Modals.cerrarModal()">&times;</span>
                </div>
                <div class="modal-body">
                    <form id="form-editar-expediente">
                        <div class="form-group">
                            <label for="editar-nuex">N° Expediente:</label>
                            <input type="text" id="editar-nuex" value="${expediente.nuex || ''}" class="readonly-field" readonly>
                        </div>
                        <div class="form-group">
                            <label for="editar-estd">Estado:</label>
                            <select id="editar-estd" required>
                                <option value="En revision" ${expediente.estd === 'En revision' ? 'selected' : ''}>En revisión</option>
                                <option value="Aprobado" ${expediente.estd === 'Aprobado' ? 'selected' : ''}>Aprobado</option>
                                <option value="Observado" ${expediente.estd === 'Observado' ? 'selected' : ''}>Observado</option>
                                <option value="Pendiente" ${expediente.estd === 'Pendiente' ? 'selected' : ''}>Pendiente</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="editar-aresp">Responsable:</label>
                            <input type="text" id="editar-aresp" value="${expediente.aresp || ''}" required>
                        </div>
                        <div class="form-group">
                            <label for="editar-asnt">Asunto:</label>
                            <textarea id="editar-asnt" required>${expediente.asnt || ''}</textarea>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-cancelar" onclick="window.Modals.cerrarModal()">❌ Cancelar</button>
                    <button class="btn btn-guardar" onclick="window.Update.guardarExpediente()">💾 Guardar Cambios</button>
                </div>
            </div>
        </div>
    `;
    
    mostrarModal(modalHTML);
}

// Inicialización de event listeners
export function init() {
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            cerrarModal();
        }
    });
}
