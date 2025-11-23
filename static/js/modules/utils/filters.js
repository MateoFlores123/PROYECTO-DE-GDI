// filters.js - FILTROS Y BÚSQUEDAS
export function filtrarExpedientes() {
    const filtro = document.getElementById('filtro-expediente').value.toLowerCase();
    const filtroEstado = document.getElementById('filtro-estado-expediente').value.toLowerCase();
    const tbody = document.getElementById('cuerpo-expedientes');
    
    if (!tbody) return;
    
    const filas = tbody.getElementsByTagName('tr');
    
    for (let fila of filas) {
        if (fila.cells.length < 3) continue;
        
        const textoExpediente = fila.cells[0].textContent.toLowerCase();
        const textoAsunto = fila.cells[4].textContent.toLowerCase();
        const textoEstado = fila.cells[2].textContent.toLowerCase();
        
        const coincideTexto = textoExpediente.includes(filtro) || textoAsunto.includes(filtro);
        const coincideEstado = !filtroEstado || textoEstado.includes(filtroEstado);
        
        fila.style.display = (coincideTexto && coincideEstado) ? '' : 'none';
    }
}

export function filtrarProveidos() {
    const filtro = document.getElementById('filtro-proveido').value.toLowerCase();
    const tbody = document.getElementById('cuerpo-proveidos');
    
    if (!tbody) return;
    
    const filas = tbody.getElementsByTagName('tr');
    
    for (let fila of filas) {
        if (fila.cells.length < 4) continue;
        
        const textoProveido = fila.cells[0].textContent.toLowerCase();
        const textoExpediente = fila.cells[2].textContent.toLowerCase();
        const textoInstruccion = fila.cells[3].textContent.toLowerCase();
        
        const coincide = textoProveido.includes(filtro) || 
                        textoExpediente.includes(filtro) || 
                        textoInstruccion.includes(filtro);
        
        fila.style.display = coincide ? '' : 'none';
    }
}

export function filtrarPreResoluciones() {
    const filtro = document.getElementById('filtro-preresolucion').value.toLowerCase();
    const filtroEstado = document.getElementById('filtro-estado-preresolucion').value.toLowerCase();
    const tbody = document.getElementById('cuerpo-preresoluciones');
    
    if (!tbody) return;
    
    const filas = tbody.getElementsByTagName('tr');
    
    for (let fila of filas) {
        if (fila.cells.length < 5) continue;
        
        const textoPreresolucion = fila.cells[0].textContent.toLowerCase();
        const textoExpediente = fila.cells[3].textContent.toLowerCase();
        const textoAnalista = fila.cells[4].textContent.toLowerCase();
        const textoEstado = fila.cells[2].textContent.toLowerCase();
        
        const coincideTexto = textoPreresolucion.includes(filtro) || 
                             textoExpediente.includes(filtro) || 
                             textoAnalista.includes(filtro);
        const coincideEstado = !filtroEstado || textoEstado.includes(filtroEstado);
        
        fila.style.display = (coincideTexto && coincideEstado) ? '' : 'none';
    }
}

export function filtrarAdministrados() {
    const filtro = document.getElementById('filtro-administrado').value.toLowerCase();
    const tbody = document.getElementById('cuerpo-administrados');
    
    if (!tbody) return;
    
    const filas = tbody.getElementsByTagName('tr');
    
    for (let fila of filas) {
        if (fila.cells.length < 6) continue;
        
        const textoDni = fila.cells[0].textContent.toLowerCase();
        const textoNombre = fila.cells[1].textContent.toLowerCase();
        const textoDireccion = fila.cells[2].textContent.toLowerCase();
        
        const coincide = textoDni.includes(filtro) || 
                        textoNombre.includes(filtro) || 
                        textoDireccion.includes(filtro);
        
        fila.style.display = coincide ? '' : 'none';
    }
}

export function filtrarSolicitudes() {
    const filtro = document.getElementById('filtro-solicitud').value.toLowerCase();
    const tbody = document.getElementById('cuerpo-solicitudes');
    
    if (!tbody) return;
    
    const filas = tbody.getElementsByTagName('tr');
    
    for (let fila of filas) {
        if (fila.cells.length < 6) continue;
        
        const textoSolicitud = fila.cells[0].textContent.toLowerCase();
        const textoAdministrado = fila.cells[1].textContent.toLowerCase();
        const textoTitulo = fila.cells[2].textContent.toLowerCase();
        const textoExpediente = fila.cells[5].textContent.toLowerCase();
        
        const coincide = textoSolicitud.includes(filtro) || 
                        textoAdministrado.includes(filtro) || 
                        textoTitulo.includes(filtro) || 
                        textoExpediente.includes(filtro);
        
        fila.style.display = coincide ? '' : 'none';
    }
}
