// fetchData.js - LLAMADAS A LA API
import * as Cache from './cache.js';
import * as Helpers from '../utils/helpers.js';

export async function fetchData(endpoint, options = {}) {
    const defaultOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        timeout: 10000
    };

    const config = { ...defaultOptions, ...options };

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), config.timeout);
        
        const response = await fetch(endpoint, {
            ...config,
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        if (error.name === 'AbortError') {
            throw new Error('Timeout: La solicitud tardó demasiado tiempo');
        }
        throw error;
    }
}

export async function fetchWithCache(endpoint, cacheKey) {
    const cached = Cache.getCache(cacheKey);
    if (cached) {
        console.log(`📦 Usando caché para: ${cacheKey}`);
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

export async function postData(endpoint, data) {
    const formData = new URLSearchParams();
    Object.keys(data).forEach(key => {
        formData.append(key, data[key]);
    });

    return await fetchData(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData
    });
}
