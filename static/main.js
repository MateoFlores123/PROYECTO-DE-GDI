// main.js - ARCHIVO PRINCIPAL
import * as Cache from './modules/api/cache.js';
import * as Tabs from './modules/ui/tabs.js';
import * as Read from './modules/crud/read.js';
import * as Create from './modules/crud/create.js';
import * as Update from './modules/crud/update.js';
import * as Delete from './modules/crud/delete.js';
import * as Modals from './modules/ui/modals.js';
import * as Filters from './modules/utils/filters.js';
import * as Exports from './modules/utils/exports.js';
import * as Helpers from './modules/utils/helpers.js';

// DEBUG: Verificar que las funciones estén disponibles
console.log("🔍 Debug - Funciones globales disponibles:");
console.log("- actualizarContadorExpedientes:", typeof window.actualizarContadorExpedientes);
console.log("- cargarExpedientesRapido:", typeof window.cargarExpedientesRapido);
console.log("- showTab:", typeof window.showTab);

// Función de diagnóstico
window.diagnosticoFunciones = function() {
    const funcionesRequeridas = [
        'actualizarContadorExpedientes',
        'cargarExpedientesRapido', 
        'showTab',
        'filtrarExpedientes'
    ];
    
    console.log("🔍 DIAGNÓSTICO DE FUNCIONES GLOBALES:");
    funcionesRequeridas.forEach(funcName => {
        const disponible = typeof window[funcName] !== 'undefined';
        console.log(`   ${funcName}: ${disponible ? '✅ DISPONIBLE' : '❌ NO DISPONIBLE'}`);
    });
};

// Ejecutar diagnóstico al cargar
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        window.diagnosticoFunciones();
    }, 1000);
});

// Hacer disponibles globalmente para los event listeners del HTML
window.Cache = Cache;
window.Tabs = Tabs;
window.Read = Read;
window.Create = Create;
window.Update = Update;
window.Delete = Delete;
window.Modals = Modals;
window.Filters = Filters;
window.Exports = Exports;
window.Helpers = Helpers;

// Variables globales
window.expedientesData = [];
window.proveidosData = [];
window.preresolucionesData = [];
window.administradosData = [];
window.solicitudesData = [];
window.isLoading = false;

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 SISTEMA INICIADO - VERSIÓN MODULAR');
    
    // Inicializar módulos
    Cache.init();
    Modals.init();
    
    // Cargar dashboard automáticamente
    Read.cargarDashboardRapido();
    
    // Precargar datos esenciales
    setTimeout(() => {
        console.log("🔄 Precargando datos en segundo plano...");
        Read.cargarExpedientesRapido();
        Read.cargarAdministradosRapido();
    }, 1000);
    
    // Agregar botón de actualización
    agregarBotonActualizacion();
});

// Función global para forzar actualización
window.forzarActualizacionCompleta = function() {
    console.log("🔄 Forzando actualización completa...");
    Cache.clearAll();
    Read.cargarExpedientesRapido();
    Read.cargarSolicitudesRapido();
    Read.cargarProveidosRapido();
    Read.cargarPreResolucionesRapido();
    Read.cargarAdministradosRapido();
    Read.cargarDashboardRapido();
    alert("🔄 Actualización completa iniciada");
};

function agregarBotonActualizacion() {
    const btn = document.createElement('button');
    btn.innerHTML = '🔄 Actualizar Todo';
    btn.className = 'btn btn-actualizar';
    btn.style.position = 'fixed';
    btn.style.top = '10px';
    btn.style.right = '10px';
    btn.style.zIndex = '1000';
    btn.onclick = window.forzarActualizacionCompleta;
    
    document.body.appendChild(btn);
}

// Funciones globales para HTML
window.showTab = Tabs.showTab;
window.loadTabData = Tabs.loadTabData;

// Asignar funciones de filtrado globalmente
window.filtrarExpedientes = Filters.filtrarExpedientes;
window.filtrarProveidos = Filters.filtrarProveidos;
window.filtrarPreResoluciones = Filters.filtrarPreResoluciones;
window.filtrarAdministrados = Filters.filtrarAdministrados;
window.filtrarSolicitudes = Filters.filtrarSolicitudes;

// Funciones de formularios globales
window.agregarAdministrado = Create.agregarAdministrado;
window.agregarSolicitud = Create.agregarSolicitud;
window.crearProveido = Create.crearProveido;
window.crearPreResolucion = Create.crearPreResolucion;

// Funciones de edición globales
window.editarAdministrado = Update.editarAdministrado;
window.editarSolicitud = Update.editarSolicitud;
window.editarExpediente = Update.editarExpediente;
window.editarProveido = function(npro) {
    console.log(`✏️ Editando proveído: ${npro}`);
    // Implementar cuando esté listo
    alert('Edición de proveídos en desarrollo');
};
window.editarPreResolucion = function(nupr) {
    console.log(`✏️ Editando pre-resolución: ${nupr}`);
    // Implementar cuando esté listo
    alert('Edición de pre-resoluciones en desarrollo');
};

// Funciones de guardado globales
window.guardarAdministrado = Update.guardarAdministrado;
window.guardarSolicitud = Update.guardarSolicitud;
window.guardarExpediente = Update.guardarExpediente;

// Funciones de eliminación globales
window.eliminarAdministrado = Delete.eliminarAdministrado;
window.eliminarSolicitud = Delete.eliminarSolicitud;
window.eliminarExpediente = Delete.eliminarExpediente;
window.eliminarProveido = Delete.eliminarProveido;
window.eliminarPreResolucion = Delete.eliminarPreResolucion;

// Funciones de exportación globales
window.descargarProveido = Exports.descargarProveido;
window.descargarPreResolucion = Exports.descargarPreResolucion;
window.imprimirTabla = Exports.imprimirTabla;

// main.js - AGREGAR ESTO AL FINAL

// Hacer disponibles las funciones globalmente para los event listeners
window.actualizarContadorExpedientes = function(cantidad) {
    console.log("📊 Actualizando contador expedientes:", cantidad);
    const contador = document.getElementById('total-expedientes');
    if (contador) {
        contador.textContent = cantidad;
        console.log("✅ Contador actualizado:", cantidad);
    } else {
        console.log("❌ Elemento total-expedientes no encontrado");
    }
};

// También agregar las otras funciones de contador por si acaso
window.actualizarContadorProveidos = function(cantidad) {
    const contador = document.getElementById('total-proveidos');
    if (contador) contador.textContent = cantidad;
};

window.actualizarContadorPreResoluciones = function(cantidad) {
    const contador = document.getElementById('total-preresoluciones');
    if (contador) contador.textContent = cantidad;
};

window.actualizarContadorPendientes = function(cantidad) {
    const contador = document.getElementById('pendientes');
    if (contador) contador.textContent = cantidad;
};
