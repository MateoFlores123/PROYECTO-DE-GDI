// cache.js - GESTIÓN DE CACHÉ
const clientCache = {
    expedientes: null,
    solicitudes: null,
    proveidos: null,
    preresoluciones: null,
    administrados: null
};

export function init() {
    console.log('✅ Sistema de caché inicializado');
}

export function getCache(key) {
    return clientCache[key];
}

export function setCache(key, data) {
    clientCache[key] = data;
    console.log(`✅ Caché actualizado para: ${key} (${data?.length || 0} registros)`);
}

export function clearCache(key) {
    if (key) {
        clientCache[key] = null;
        console.log(`🔄 Caché limpiado para: ${key}`);
    } else {
        // Limpiar todo
        Object.keys(clientCache).forEach(k => clientCache[k] = null);
        console.log('🔄 Todo el caché limpiado');
    }
}

export function clearAll() {
    Object.keys(clientCache).forEach(key => {
        clientCache[key] = null;
    });
    console.log('🗑️ Todo el caché eliminado');
}

export function getCacheStatus() {
    const status = {};
    Object.keys(clientCache).forEach(key => {
        status[key] = clientCache[key] ? clientCache[key].length : 0;
    });
    return status;
}
