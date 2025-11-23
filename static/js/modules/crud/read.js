// read.js - CARGAR Y LEER DATOS (ACTUALIZADO)
import * as Cache from '../api/cache.js';
import * as Render from '../ui/render.js';
import * as Helpers from '../utils/helpers.js';
import { fetchWithCache, APIEndpoints } from '../api/fetchData.js';

export function cargarExpedientesRapido() {
    if (window.isLoading) return;
    
    console.log("🔄 Cargando expedientes...");
    Helpers.showLoading();
    
    fetch('/expedientes')
        .then(response => {
            if (!response.ok) throw new Error('Error del servidor: ' + response.status);
            return response.json();
        })
        .then(data => {
            Helpers.hideLoading();
            console.log(`✅ Expedientes recibidos: ${data.length} registros`);
            
            Cache.setCache('expedientes', data);
            window.expedientesData = data;
            
            Render.renderizarExpedientes(data);
            
            // COMENTAR TEMPORALMENTE ESTA LÍNEA
            // actualizarContadorExpedientes(data.length);
            
            // En su lugar, actualizar directamente
            const contador = document.getElementById('total-expedientes');
            if (contador) {
                contador.textContent = data.length;
                console.log("📊 Contador actualizado directamente:", data.length);
            }
        })
        .catch(error => {
            Helpers.hideLoading();
            console.error('❌ Error cargando expedientes:', error);
            Render.mostrarError('expedientes', error.message);
        });
}

export function cargarAdministradosRapido() {
    if (window.isLoading) return;
    
    fetchWithCache(APIEndpoints.administrados, 'administrados')
        .then(data => {
            window.administradosData = data;
            Render.renderizarAdministrados(data);
        })
        .catch(error => {
            Render.mostrarError('administrados', error.message);
        });
}

export function cargarSolicitudesRapido() {
    if (window.isLoading) return;
    
    fetchWithCache(APIEndpoints.solicitudes, 'solicitudes')
        .then(data => {
            window.solicitudesData = data;
            Render.renderizarSolicitudes(data);
        })
        .catch(error => {
            Render.mostrarError('solicitudes', error.message);
        });
}

export function cargarProveidosRapido() {
    if (window.isLoading) return;
    
    fetchWithCache(APIEndpoints.proveidos, 'proveidos')
        .then(data => {
            window.proveidosData = data;
            Render.renderizarProveidos(data);
        })
        .catch(error => {
            Render.mostrarError('proveidos', error.message);
        });
}

export function cargarPreResolucionesRapido() {
    if (window.isLoading) return;
    
    fetchWithCache(APIEndpoints.preresoluciones, 'preresoluciones')
        .then(data => {
            window.preresolucionesData = data;
            Render.renderizarPreResoluciones(data);
        })
        .catch(error => {
            Render.mostrarError('preresoluciones', error.message);
        });
}

export function cargarDashboardRapido() {
    console.log("📊 Cargando dashboard...");
    
    Promise.all([
        fetchWithCache(APIEndpoints.expedientes, 'expedientes'),
        fetchWithCache(APIEndpoints.proveidos, 'proveidos'),
        fetchWithCache(APIEndpoints.preresoluciones, 'preresoluciones'),
        fetchWithCache(APIEndpoints.solicitudes, 'solicitudes')
    ]).then(([expedientes, proveidos, preresoluciones, solicitudes]) => {
        document.getElementById('total-expedientes').textContent = expedientes.length;
        document.getElementById('total-proveidos').textContent = proveidos.length;
        document.getElementById('total-preresoluciones').textContent = preresoluciones.length;
        
        const pendientes = solicitudes.filter(s => 
            s.estd === true || 
            s.estd === 'Pendiente' || 
            s.estd === 'En revision'
        ).length;
        document.getElementById('pendientes').textContent = pendientes;
        
    }).catch(error => {
        console.error("❌ Error cargando dashboard:", error);
        document.getElementById('total-expedientes').textContent = '0';
        document.getElementById('total-proveidos').textContent = '0';
        document.getElementById('total-preresoluciones').textContent = '0';
        document.getElementById('pendientes').textContent = '0';
    });
}
