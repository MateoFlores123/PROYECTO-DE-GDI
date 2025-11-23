// tabs.js - NAVEGACIÓN POR PESTAÑAS
import * as Read from '../crud/read.js';
import * as Create from '../crud/create.js';

export function showTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    document.getElementById(tabName).classList.add('active');
    event.currentTarget.classList.add('active');
    
    setTimeout(() => loadTabData(tabName), 10);
}

export function loadTabData(tabName) {
    if (window.isLoading) return;
    
    switch(tabName) {
        case 'administrados':
            Read.cargarAdministradosRapido();
            Read.cargarSolicitudesRapido();
            Create.cargarSelectsAdministrados();
            break;
        case 'expedientes':
            Read.cargarExpedientesRapido();
            break;
        case 'proveidos':
            Read.cargarProveidosRapido();
            break;
        case 'preresoluciones':
            Read.cargarPreResolucionesRapido();
            break;
        case 'solicitudes':
            Read.cargarSolicitudesRapido();
            break;
        case 'dashboard':
            Read.cargarDashboardRapido();
            break;
        case 'nuevo':
            Create.cargarSelectsNuevoDocumento();
            break;
        case 'consultas':
            document.getElementById('resultados-consulta').innerHTML = 
                '<p class="placeholder">Seleccione una consulta para ver los resultados</p>';
            break;
    }
}
