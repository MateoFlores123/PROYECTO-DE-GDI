// fetchData.js - LLAMADAS A LA API MEJORADAS
import * as Cache from './cache.js';
import * as Helpers from '../utils/helpers.js';

/**
 * Función principal para hacer fetch con manejo de errores mejorado
 * @param {string} endpoint - URL del endpoint
 * @param {object} options - Opciones para fetch
 * @returns {Promise} - Promesa con los datos
 */
export async function fetchData(endpoint, options = {}) {
    const defaultOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        timeout: 10000 // 10 segundos timeout por defecto
    };

    const config = { ...defaultOptions, ...options };

    try {
        console.log(`🌐 Fetching: ${endpoint}`);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), config.timeout);
        
        const response = await fetch(endpoint, {
            ...config,
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
        }

        const data = await response.json();
        console.log(`✅ Fetch exitoso: ${endpoint}`, data.length !== undefined ? `(${data.length} registros)` : '');
        
        return data;
    } catch (error) {
        console.error(`❌ Error en fetch: ${endpoint}`, error);
        
        if (error.name === 'AbortError') {
            throw new Error(`Timeout: La solicitud a ${endpoint} tardó demasiado tiempo`);
        }
        
        if (error.message.includes('Failed to fetch')) {
            throw new Error('Error de conexión: No se pudo conectar al servidor');
        }
        
        throw error;
    }
}

/**
 * Fetch con caché automática
 * @param {string} endpoint - URL del endpoint
 * @param {string} cacheKey - Clave para el caché
 * @returns {Promise} - Promesa con los datos (del caché o del servidor)
 */
export async function fetchWithCache(endpoint, cacheKey) {
    const cached = Cache.getCache(cacheKey);
    if (cached) {
        console.log(`📦 Usando caché para: ${cacheKey} (${cached.length} registros)`);
        return cached;
    }

    Helpers.showLoading();
    
    try {
        const data = await fetchData(endpoint);
        Cache.setCache(cacheKey, data);
        return data;
    } finally {
        Helpers.hideLoading();
    }
}

/**
 * Función para enviar datos POST
 * @param {string} endpoint - URL del endpoint
 * @param {object} data - Datos a enviar
 * @returns {Promise} - Promesa con la respuesta
 */
export async function postData(endpoint, data) {
    console.log(`📤 POST a: ${endpoint}`, data);
    
    const formData = new URLSearchParams();
    Object.keys(data).forEach(key => {
        if (data[key] !== null && data[key] !== undefined) {
            formData.append(key, data[key]);
        }
    });

    return await fetchData(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData
    });
}

/**
 * Función para enviar datos PUT
 * @param {string} endpoint - URL del endpoint
 * @param {object} data - Datos a enviar
 * @returns {Promise} - Promesa con la respuesta
 */
export async function putData(endpoint, data) {
    console.log(`🔄 PUT a: ${endpoint}`, data);
    
    const formData = new URLSearchParams();
    Object.keys(data).forEach(key => {
        if (data[key] !== null && data[key] !== undefined) {
            formData.append(key, data[key]);
        }
    });

    return await fetchData(endpoint, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData
    });
}

/**
 * Función para eliminar datos
 * @param {string} endpoint - URL del endpoint
 * @returns {Promise} - Promesa con la respuesta
 */
export async function deleteData(endpoint) {
    console.log(`🗑️ DELETE a: ${endpoint}`);
    
    return await fetchData(endpoint, {
        method: 'DELETE'
    });
}

/**
 * Función para obtener un registro específico por ID
 * @param {string} endpoint - URL base del endpoint
 * @param {string} id - ID del registro
 * @returns {Promise} - Promesa con los datos del registro
 */
export async function fetchById(endpoint, id) {
    if (!id) {
        throw new Error('ID no proporcionado');
    }
    
    const url = `${endpoint}/${id}`;
    return await fetchData(url);
}

/**
 * Función para búsqueda con parámetros
 * @param {string} endpoint - URL del endpoint
 * @param {object} params - Parámetros de búsqueda
 * @returns {Promise} - Promesa con los resultados
 */
export async function searchData(endpoint, params = {}) {
    const queryParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
            queryParams.append(key, params[key]);
        }
    });
    
    const url = queryParams.toString() ? `${endpoint}?${queryParams}` : endpoint;
    return await fetchData(url);
}

/**
 * Función para múltiples requests simultáneos
 * @param {Array} requests - Array de promesas de fetch
 * @returns {Promise} - Promesa con todos los resultados
 */
export async function fetchMultiple(requests) {
    if (!Array.isArray(requests) || requests.length === 0) {
        throw new Error('Se requiere un array de requests');
    }
    
    console.log(`🔄 Ejecutando ${requests.length} requests simultáneos`);
    Helpers.showLoading();
    
    try {
        const results = await Promise.allSettled(requests);
        
        // Procesar resultados
        const successful = results.filter(result => result.status === 'fulfilled');
        const failed = results.filter(result => result.status === 'rejected');
        
        if (failed.length > 0) {
            console.warn(`⚠️ ${failed.length} requests fallaron:`, failed);
        }
        
        console.log(`✅ ${successful.length}/${requests.length} requests exitosos`);
        
        return successful.map(result => result.value);
    } finally {
        Helpers.hideLoading();
    }
}

/**
 * Función para verificar el estado del servidor
 * @returns {Promise<boolean>} - True si el servidor está activo
 */
export async function checkServerStatus() {
    try {
        const response = await fetch('/health', {
            method: 'HEAD',
            timeout: 5000
        });
        return response.ok;
    } catch (error) {
        console.error('❌ Servidor no disponible:', error);
        return false;
    }
}

/**
 * Función para reintentar una petición fallida
 * @param {Function} fetchFunction - Función de fetch a reintentar
 * @param {number} maxRetries - Número máximo de reintentos
 * @param {number} delay - Delay entre reintentos en ms
 * @returns {Promise} - Promesa con el resultado
 */
export async function retryFetch(fetchFunction, maxRetries = 3, delay = 1000) {
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await fetchFunction();
        } catch (error) {
            lastError = error;
            console.warn(`🔄 Reintento ${attempt}/${maxRetries} fallido:`, error.message);
            
            if (attempt < maxRetries) {
                await new Promise(resolve => setTimeout(resolve, delay * attempt));
            }
        }
    }
    
    throw lastError;
}

// Exportar funciones específicas para endpoints comunes
export const APIEndpoints = {
    expedientes: '/expedientes',
    solicitudes: '/solicitudes',
    proveidos: '/proveidos',
    preresoluciones: '/preresoluciones',
    administrados: '/administrados',
    gerencias: '/gerencias',
    subgerencias: '/subgerencias',
    analistas: '/analistas',
    mesa_partes: '/mesa_partes',
    consultas: '/consultas'
};
