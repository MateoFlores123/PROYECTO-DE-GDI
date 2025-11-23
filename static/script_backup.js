// script.js - MÉTODOS COMPLETOS Y CORREGIDOS

let expedientesData = [];
let proveidosData = [];
let preresolucionesData = [];
let administradosData = [];
let solicitudesData = [];
let isLoading = false;

// CACHÉ CLIENTE
let clientCache = {
    expedientes: null,
    solicitudes: null,
    proveidos: null,
    preresoluciones: null,
    administrados: null
};

function showTab(tabName) {
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

function loadTabData(tabName) {
    if (isLoading) return;
    
    switch(tabName) {
        case 'administrados':
            cargarAdministradosRapido();
            cargarSolicitudesRapido();
            cargarSelectsAdministrados();
            break;
        case 'expedientes':
            cargarExpedientesRapido();
            break;
        case 'proveidos':
            cargarProveidosRapido();
            break;
        case 'preresoluciones':
            cargarPreResolucionesRapido();
            break;
        case 'solicitudes':
            cargarSolicitudesRapido();
            break;
        case 'dashboard':
            cargarDashboardRapido();
            break;
        case 'nuevo':
            cargarSelectsNuevoDocumento();
            break;
    }
}

// MÉTODOS PARA CARGAR DATOS
// MÉTODOS MEJORADOS PARA CARGAR DATOS
function cargarExpedientesRapido() {
    if (isLoading) return;
    
    console.log("🔄 Cargando expedientes...");
    showLoading();
    
    // Siempre hacer fetch para asegurar datos frescos
    fetch('/expedientes')
        .then(response => {
            if (!response.ok) throw new Error('Error del servidor: ' + response.status);
            return response.json();
        })
        .then(data => {
            hideLoading();
            console.log(`✅ Expedientes recibidos: ${data.length} registros`);
            
            // Actualizar caché y datos
            clientCache.expedientes = data;
            expedientesData = data;
            
            // Forzar renderizado
            renderizarExpedientes(data);
            
            // Actualizar dashboard si está visible
            if (document.getElementById('expedientes').classList.contains('active')) {
                actualizarContadorExpedientes(data.length);
            }
        })
        .catch(error => {
            hideLoading();
            console.error('❌ Error cargando expedientes:', error);
            mostrarError('expedientes', error.message);
        });
}

function actualizarContadorExpedientes(cantidad) {
    console.log("📊 Actualizando contador expedientes:", cantidad);
    const contador = document.getElementById('total-expedientes');
    if (contador) {
        contador.textContent = cantidad;
        console.log("✅ Contador actualizado:", cantidad);
    }
    
    // También actualizar dashboard si está visible
    const dashboardCounter = document.querySelector('#dashboard .card:nth-child(1) .card-number');
    if (dashboardCounter) {
        dashboardCounter.textContent = cantidad;
    }
}
// Función para forzar actualización completa
function forzarActualizacionCompleta() {
    console.log("🔄 Forzando actualización completa...");
    
    // Limpiar todo el caché del cliente
    clientCache = {
        expedientes: null,
        solicitudes: null,
        proveidos: null,
        preresoluciones: null,
        administrados: null
    };
    
    // Recargar todos los datos
    cargarExpedientesRapido();
    cargarSolicitudesRapido();
    cargarProveidosRapido();
    cargarPreResolucionesRapido();
    cargarAdministradosRapido();
    cargarDashboardRapido();
    
    alert("🔄 Actualización completa iniciada");
}

// Agrega este botón en tu HTML o usa en la consola
function agregarBotonActualizacion() {
    const btn = document.createElement('button');
    btn.innerHTML = '🔄 Actualizar Todo';
    btn.className = 'btn btn-actualizar';
    btn.style.position = 'fixed';
    btn.style.top = '10px';
    btn.style.right = '10px';
    btn.style.zIndex = '1000';
    btn.onclick = forzarActualizacionCompleta;
    
    document.body.appendChild(btn);
}

// Inicialización mejorada
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 SISTEMA INICIADO - VERSIÓN CORREGIDA');
    
    // Agregar botón de actualización
    agregarBotonActualizacion();
    
    // Cargar dashboard automáticamente
    cargarDashboardRapido();
    
    // Precargar datos esenciales
    setTimeout(() => {
        console.log("🔄 Precargando datos en segundo plano...");
        cargarExpedientesRapido();
        cargarAdministradosRapido();
    }, 1000);
});

// Función de diagnóstico
function diagnosticoSistema() {
    console.log("🔍 DIAGNÓSTICO DEL SISTEMA:");
    console.log("📊 Caché del cliente:", clientCache);
    console.log("📊 Datos en memoria:", {
        expedientes: expedientesData.length,
        solicitudes: solicitudesData.length,
        proveidos: proveidosData.length,
        preresoluciones: preresolucionesData.length,
        administrados: administradosData.length
    });
    
    // Probar endpoints
    fetch('/expedientes')
        .then(r => r.json())
        .then(data => console.log("✅ Endpoint /expedientes:", data.length))
        .catch(e => console.error("❌ Endpoint /expedientes:", e));
}

function cargarProveidosRapido() {
    if (isLoading) return;
    
    if (clientCache.proveidos) {
        renderizarProveidos(clientCache.proveidos);
        return;
    }
    
    showLoading();
    
    const timeoutId = setTimeout(() => {
        hideLoading();
        mostrarError('proveidos', 'Timeout: No se pudieron cargar los proveídos');
    }, 5000);
    
    fetch('/proveidos')
        .then(response => {
            clearTimeout(timeoutId);
            if (!response.ok) throw new Error('Error del servidor');
            return response.json();
        })
        .then(data => {
            hideLoading();
            clientCache.proveidos = data;
            proveidosData = data;
            renderizarProveidos(data);
        })
        .catch(error => {
            clearTimeout(timeoutId);
            hideLoading();
            mostrarError('proveidos', error.message);
        });
}

function cargarPreResolucionesRapido() {
    if (isLoading) return;
    
    if (clientCache.preresoluciones) {
        renderizarPreResoluciones(clientCache.preresoluciones);
        return;
    }
    
    showLoading();
    
    const timeoutId = setTimeout(() => {
        hideLoading();
        mostrarError('preresoluciones', 'Timeout: No se pudieron cargar las pre-resoluciones');
    }, 5000);
    
    fetch('/preresoluciones')
        .then(response => {
            clearTimeout(timeoutId);
            if (!response.ok) throw new Error('Error del servidor');
            return response.json();
        })
        .then(data => {
            hideLoading();
            clientCache.preresoluciones = data;
            preresolucionesData = data;
            renderizarPreResoluciones(data);
        })
        .catch(error => {
            clearTimeout(timeoutId);
            hideLoading();
            mostrarError('preresoluciones', error.message);
        });
}

function cargarAdministradosRapido() {
    if (isLoading) return;
    
    if (clientCache.administrados) {
        renderizarAdministrados(clientCache.administrados);
        return;
    }
    
    showLoading();
    
    const timeoutId = setTimeout(() => {
        hideLoading();
        mostrarError('administrados', 'Timeout: No se pudieron cargar los administrados');
    }, 5000);
    
    fetch('/administrados')
        .then(response => {
            clearTimeout(timeoutId);
            if (!response.ok) throw new Error('Error del servidor');
            return response.json();
        })
        .then(data => {
            hideLoading();
            clientCache.administrados = data;
            administradosData = data;
            renderizarAdministrados(data);
        })
        .catch(error => {
            clearTimeout(timeoutId);
            hideLoading();
            mostrarError('administrados', error.message);
        });
}

function cargarSolicitudesRapido() {
    if (isLoading) return;
    
    if (clientCache.solicitudes) {
        renderizarSolicitudes(clientCache.solicitudes);
        return;
    }
    
    showLoading();
    
    const timeoutId = setTimeout(() => {
        hideLoading();
        mostrarError('solicitudes', 'Timeout: No se pudieron cargar las solicitudes');
    }, 5000);
    
    fetch('/solicitudes')
        .then(response => {
            clearTimeout(timeoutId);
            if (!response.ok) throw new Error('Error del servidor');
            return response.json();
        })
        .then(data => {
            hideLoading();
            clientCache.solicitudes = data;
            solicitudesData = data;
            renderizarSolicitudes(data);
        })
        .catch(error => {
            clearTimeout(timeoutId);
            hideLoading();
            mostrarError('solicitudes', error.message);
        });
}

// DASHBOARD - MÉTODO CORREGIDO
function cargarDashboardRapido() {
    console.log("📊 Cargando dashboard...");
    
    // Cargar todos los datos para el dashboard
    Promise.all([
        fetch('/expedientes').then(r => r.json()),
        fetch('/proveidos').then(r => r.json()),
        fetch('/preresoluciones').then(r => r.json()),
        fetch('/solicitudes').then(r => r.json())
    ]).then(([expedientes, proveidos, preresoluciones, solicitudes]) => {
        console.log("📊 Datos recibidos para dashboard:", {
            expedientes: expedientes.length,
            proveidos: proveidos.length,
            preresoluciones: preresoluciones.length,
            solicitudes: solicitudes.length
        });
        
        // Actualizar las tarjetas del dashboard
        document.getElementById('total-expedientes').textContent = expedientes.length;
        document.getElementById('total-proveidos').textContent = proveidos.length;
        document.getElementById('total-preresoluciones').textContent = preresoluciones.length;
        
        // Calcular pendientes (solicitudes en estado pendiente o en revisión)
        const pendientes = solicitudes.filter(s => 
            s.estd === true || 
            s.estd === 'Pendiente' || 
            s.estd === 'En revision'
        ).length;
        document.getElementById('pendientes').textContent = pendientes;
        
    }).catch(error => {
        console.error("❌ Error cargando dashboard:", error);
        // Valores por defecto en caso de error
        document.getElementById('total-expedientes').textContent = '0';
        document.getElementById('total-proveidos').textContent = '0';
        document.getElementById('total-preresoluciones').textContent = '0';
        document.getElementById('pendientes').textContent = '0';
    });
}

// MÉTODOS DE RENDERIZADO
function renderizarExpedientes(data) {
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
        const estadoClass = getEstadoClass(expediente.estd);
        html += `
            <tr>
                <td>${expediente.nuex || 'N/A'}</td>
                <td>${expediente.fecha || 'N/A'}</td>
                <td><span class="estado-badge ${estadoClass}">${expediente.estd || 'N/A'}</span></td>
                <td>${expediente.aresp || 'N/A'}</td>
                <td>${expediente.asnt || 'N/A'}</td>
                <td>
                    <button class="btn btn-editar" onclick="editarExpediente('${expediente.nuex}')">✏️ Editar</button>
                    <button class="btn btn-eliminar" onclick="eliminarExpediente('${expediente.nuex}', '${expediente.asnt}')">🗑️ Eliminar</button>
                </td>
            </tr>
        `;
    });
    
    tbody.innerHTML = html;
}


// Funciones para los formularios (si no las tienes)
function generarProveidoPara(nuex) {
    showTab('nuevo');
    setTimeout(() => {
        const select = document.getElementById('expediente-proveido');
        if (select) select.value = nuex;
    }, 100);
}

function generarSolicitudPara(d_r) {
    showTab('administrados');
    setTimeout(() => {
        const select = document.getElementById('administrado-solicitud');
        if (select) select.value = d_r;
    }, 100);
}

function verDetalleSolicitud(nums) {
    alert(`Detalle de solicitud: ${nums}\n\nEsta función mostrará los detalles completos de la solicitud.`);
}

function renderizarProveidos(data) {
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
                    <button class="btn btn-eliminar" onclick="eliminarProveido('${proveido.npro}', '${proveido.nuex}')">🗑️ Eliminar</button>
                    <button class="btn btn-descargar" onclick="descargarProveido('${proveido.npro}')">📥 Descargar</button>
                </td>
            </tr>
        `;
    });
    
    tbody.innerHTML = html;
}

function renderizarPreResoluciones(data) {
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
        const estadoClass = getEstadoClass(preresolucion.estd);
        html += `
            <tr>
                <td>${preresolucion.nupr || 'N/A'}</td>
                <td>${preresolucion.fecha || 'N/A'}</td>
                <td><span class="estado-badge ${estadoClass}">${preresolucion.estd || 'N/A'}</span></td>
                <td>${preresolucion.nuex || 'N/A'}</td>
                <td>${preresolucion.analista || 'N/A'}</td>
                <td>
                    <button class="btn btn-editar" onclick="editarPreResolucion('${preresolucion.nupr}')">✏️ Editar</button>
                    <button class="btn btn-eliminar" onclick="eliminarPreResolucion('${preresolucion.nupr}', '${preresolucion.nuex}')">🗑️ Eliminar</button>
                    <button class="btn btn-descargar" onclick="descargarPreResolucion('${preresolucion.nupr}')">📥 Descargar</button>
                </td>
            </tr>
        `;
    });
    
    tbody.innerHTML = html;
}

function renderizarAdministrados(data) {
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
                    <button class="btn btn-editar" onclick="editarAdministrado('${admin.d_r}')">✏️ Editar</button>
                    <button class="btn btn-eliminar" onclick="eliminarAdministrado('${admin.d_r}', '${admin.noma}')">🗑️ Eliminar</button>
                </td>
            </tr>
        `;
    });
    
    tbody.innerHTML = html;
}

function renderizarSolicitudes(data) {
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
                    <button class="btn btn-editar" onclick="editarSolicitud('${solicitud.nums}')">✏️ Editar</button>
                    <button class="btn btn-eliminar" onclick="eliminarSolicitud('${solicitud.nums}', '${solicitud.tita}')">🗑️ Eliminar</button>
                </td>
            </tr>
        `;
    });
    
    tbody.innerHTML = html;
}



// FUNCIONES AUXILIARES
function mostrarError(tipo, mensaje) {
    const tbody = document.getElementById(`cuerpo-${tipo}`);
    if (tbody) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 20px; color: #e74c3c;">
                    ❌ ${mensaje}
                    <br><button class="btn" onclick="cargar${tipo.charAt(0).toUpperCase() + tipo.slice(1)}Rapido()" style="margin-top: 10px;">🔄 Reintentar</button>
                </td>
            </tr>
        `;
    }
}

function showLoading() {
    isLoading = true;
    document.body.style.cursor = 'wait';
}

function hideLoading() {
    isLoading = false;
    document.body.style.cursor = 'default';
}

function getEstadoClass(estado) {
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

// CARGAR SELECTS PARA FORMULARIOS
function cargarSelectsAdministrados() {
    console.log("🔄 Cargando selects para administrados...");
    
    // Cargar administrados
    fetch('/administrados')
        .then(response => {
            if (!response.ok) throw new Error('Error cargando administrados');
            return response.json();
        })
        .then(administrados => {
            const select = document.getElementById('administrado-solicitud');
            if (select) {
                select.innerHTML = '<option value="">Seleccionar administrado...</option>';
                administrados.forEach(admin => {
                    const option = document.createElement('option');
                    option.value = admin.d_r;
                    option.textContent = `${admin.noma} (${admin.d_r})`;
                    select.appendChild(option);
                });
                console.log(`✅ ${administrados.length} administrados cargados en select`);
            }
        })
        .catch(error => {
            console.error('❌ Error cargando administrados:', error);
        });

    // Cargar mesa de partes
    fetch('/mesa_partes')
        .then(response => {
            if (!response.ok) throw new Error('Error cargando mesa de partes');
            return response.json();
        })
        .then(mesaPartes => {
            const select = document.getElementById('mesa-partes');
            if (select) {
                select.innerHTML = '<option value="">Seleccionar mesa de partes...</option>';
                mesaPartes.forEach(mesa => {
                    const option = document.createElement('option');
                    option.value = mesa.codm;
                    option.textContent = mesa.resp;
                    select.appendChild(option);
                });
                console.log(`✅ ${mesaPartes.length} mesas de partes cargadas`);
            }
        })
        .catch(error => {
            console.error('❌ Error cargando mesa de partes:', error);
        });
}

function cargarSelectsNuevoDocumento() {
    // Cargar expedientes para proveídos
    fetch('/expedientes')
        .then(response => response.json())
        .then(expedientes => {
            const selectProveido = document.getElementById('expediente-proveido');
            const selectPreresolucion = document.getElementById('expediente-preresolucion');
            
            [selectProveido, selectPreresolucion].forEach(select => {
                if (select) {
                    select.innerHTML = '<option value="">Seleccionar expediente...</option>';
                    expedientes.forEach(exp => {
                        const option = document.createElement('option');
                        option.value = exp.nuex;
                        option.textContent = `${exp.nuex} - ${exp.asnt || 'Sin asunto'}`;
                        select.appendChild(option);
                    });
                }
            });
        });

    // Cargar gerencias y subgerencias
    fetch('/gerencias')
        .then(response => response.json())
        .then(gerencias => {
            const select = document.getElementById('gerencia');
            if (select) {
                select.innerHTML = '<option value="">Seleccionar gerencia...</option>';
                gerencias.forEach(ger => {
                    const option = document.createElement('option');
                    option.value = ger.idger;
                    option.textContent = ger.nomg;
                    select.appendChild(option);
                });
            }
        });

    fetch('/subgerencias')
        .then(response => response.json())
        .then(subgerencias => {
            const select = document.getElementById('subgerencia');
            if (select) {
                select.innerHTML = '<option value="">Seleccionar subgerencia...</option>';
                subgerencias.forEach(sub => {
                    const option = document.createElement('option');
                    option.value = sub.nsub;
                    option.textContent = sub.arsg;
                    select.appendChild(option);
                });
            }
        });

    // Cargar analistas
    fetch('/analistas')
        .then(response => response.json())
        .then(analistas => {
            const select = document.getElementById('analista');
            if (select) {
                select.innerHTML = '<option value="">Seleccionar analista...</option>';
                analistas.forEach(ana => {
                    const option = document.createElement('option');
                    option.value = ana.dnia;
                    option.textContent = ana.noal;
                    select.appendChild(option);
                });
            }
        });
}

// FUNCIONES DE DESCARGA
// FUNCIONES MEJORADAS PARA DESCARGA E IMPRESIÓN
function descargarProveido(npro) {
    console.log(`📥 Descargando proveído: ${npro}`);
    
    // Buscar el proveído en los datos cacheados primero
    const proveido = proveidosData.find(p => p.npro === npro);
    
    if (proveido) {
        generarPDFProveido(proveido);
    } else {
        // Si no está en cache, buscar en el servidor
        fetch('/proveidos')
            .then(response => response.json())
            .then(proveidos => {
                const proveidoEncontrado = proveidos.find(p => p.npro === npro);
                if (proveidoEncontrado) {
                    generarPDFProveido(proveidoEncontrado);
                } else {
                    alert('❌ No se pudo encontrar el proveído');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('❌ Error al descargar el proveído');
            });
    }
}

function generarPDFProveido(proveido) {
    const contenido = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Proveído ${proveido.npro}</title>
    <style>
        body { 
            font-family: 'Arial', sans-serif; 
            margin: 20px; 
            line-height: 1.6;
        }
        .header { 
            text-align: center; 
            margin-bottom: 30px;
            border-bottom: 2px solid #333;
            padding-bottom: 20px;
        }
        .header h1 { 
            margin: 0; 
            font-size: 16px;
        }
        .header h2 { 
            margin: 5px 0; 
            font-size: 14px;
            color: #666;
        }
        .content { 
            margin: 20px 0; 
        }
        .numero-documento {
            text-align: center;
            font-size: 18px;
            font-weight: bold;
            margin: 20px 0;
        }
        .fecha {
            text-align: right;
            margin-bottom: 20px;
        }
        .instruccion {
            margin: 20px 0;
            padding: 15px;
            background: #f9f9f9;
            border-left: 4px solid #333;
        }
        .firma {
            margin-top: 60px;
            text-align: center;
        }
        .firma-line {
            border-top: 1px solid #333;
            width: 300px;
            margin: 40px auto 10px;
        }
        .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 12px;
            color: #666;
        }
        @media print {
            body { margin: 0; }
            .no-print { display: none; }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>GOBIERNO LOCAL</h1>
        <h2>MUNICIPALIDAD DISTRITAL DE UCHUMAYO</h2>
        <h3>"Año del Buen Servicio al Ciudadano"</h3>
    </div>
    
    <div class="numero-documento">
        PROVEIDO N° ${proveido.npro || 'N/A'}
    </div>
    
    <div class="fecha">
        UCHUMAYO, ${proveido.fed || ''}/${proveido.fem || ''}/${proveido.fea || ''}
    </div>
    
    <div class="content">
        <p><strong>Vistos:</strong> Expediente N° ${proveido.nuex || 'N/A'}</p>
        
        <div class="instruccion">
            <strong>CONSIDERANDO:</strong><br>
            ${proveido.ints || 'Instrucción no disponible'}
        </div>
    </div>
    
    <div class="firma">
        <div class="firma-line"></div>
        <p><strong>Cesar W. MAMANI CUTIFACA</strong><br>
        C.A.P. 3079<br>
        ABOGADO</p>
    </div>
    
    <div class="footer">
        Documento generado automáticamente por el Sistema de Pre-Resoluciones
    </div>
    
    <div class="no-print" style="margin-top: 20px; text-align: center;">
        <button onclick="window.print()" style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;">
            🖨️ Imprimir PDF
        </button>
    </div>
</body>
</html>`;

    const ventana = window.open('', '_blank');
    ventana.document.write(contenido);
    ventana.document.close();
    
    // Auto-imprimir después de cargar
    ventana.onload = function() {
        setTimeout(() => {
            ventana.print();
        }, 500);
    };
}

function descargarPreResolucion(nupr) {
    console.log(`📥 Descargando pre-resolución: ${nupr}`);
    
    // Buscar en cache primero
    const preresolucion = preresolucionesData.find(p => p.nupr === nupr);
    
    if (preresolucion) {
        generarPDFPreResolucion(preresolucion);
    } else {
        // Buscar en servidor
        fetch('/preresoluciones')
            .then(response => response.json())
            .then(preresoluciones => {
                const preresolucionEncontrada = preresoluciones.find(p => p.nupr === nupr);
                if (preresolucionEncontrada) {
                    generarPDFPreResolucion(preresolucionEncontrada);
                } else {
                    alert('❌ No se pudo encontrar la pre-resolución');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('❌ Error al descargar la pre-resolución');
            });
    }
}

function generarPDFPreResolucion(preresolucion) {
    const contenido = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Pre-Resolución ${preresolucion.nupr}</title>
    <style>
        body { 
            font-family: 'Arial', sans-serif; 
            margin: 20px; 
            line-height: 1.6;
        }
        .header { 
            text-align: center; 
            margin-bottom: 30px;
            border-bottom: 2px solid #333;
            padding-bottom: 20px;
        }
        .numero-resolucion {
            text-align: center;
            font-size: 20px;
            font-weight: bold;
            margin: 20px 0;
            text-transform: uppercase;
        }
        .datos-documento {
            margin: 20px 0;
            padding: 15px;
            background: #f5f5f5;
            border-radius: 5px;
        }
        .seccion {
            margin: 25px 0;
        }
        .seccion h3 {
            border-bottom: 1px solid #333;
            padding-bottom: 5px;
        }
        .articulos {
            margin: 20px 0;
        }
        .articulo {
            margin: 15px 0;
        }
        .firma {
            margin-top: 80px;
            text-align: center;
        }
        .firma-line {
            border-top: 1px solid #333;
            width: 300px;
            margin: 60px auto 10px;
        }
        .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 12px;
            color: #666;
        }
        @media print {
            body { margin: 0; }
            .no-print { display: none; }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>MUNICIPALIDAD DISTRITAL DE ASILLO</h1>
        <h2>RESOLUCIÓN DE GERENCIA</h2>
    </div>
    
    <div class="numero-resolucion">
        RESOLUCIÓN N° ${preresolucion.nupr || 'N/A'}
    </div>
    
    <div class="datos-documento">
        <p><strong>Expediente:</strong> ${preresolucion.nuex || 'N/A'}</p>
        <p><strong>Analista:</strong> ${preresolucion.analista || 'N/A'}</p>
        <p><strong>Fecha:</strong> ${preresolucion.fed || ''}/${preresolucion.fem || ''}/${preresolucion.fea || ''}</p>
        <p><strong>Estado:</strong> ${preresolucion.estd || 'N/A'}</p>
    </div>
    
    <div class="seccion">
        <h3>VISTO:</h3>
        <p>El expediente ${preresolucion.nuex || 'N/A'} y,</p>
    </div>
    
    <div class="seccion">
        <h3>CONSIDERANDO:</h3>
        <div class="fundamento">
            <p><strong>Fundamento de Hecho:</strong></p>
            <p>${preresolucion.fuhe || 'No especificado'}</p>
            
            <p><strong>Fundamento de Derecho:</strong></p>
            <p>${preresolucion.fude || 'No especificado'}</p>
        </div>
    </div>
    
    <div class="seccion">
        <h3>RESUELVE:</h3>
        <div class="articulos">
            <div class="articulo">
                <strong>ARTICULO PRIMERO.</strong> – Declarar ${preresolucion.estd || 'N/A'} la solicitud presentada.
            </div>
            <div class="articulo">
                <strong>ARTICULO SEGUNDO.</strong> – Comunicar la presente resolución a las áreas correspondientes.
            </div>
        </div>
    </div>
    
    <div class="firma">
        <div class="firma-line"></div>
        <p><strong>REGÍSTRESE, COMUNÍQUESE, CÚMPLASE</strong></p>
    </div>
    
    <div class="footer">
        Documento generado automáticamente por el Sistema de Pre-Resoluciones
    </div>
    
    <div class="no-print" style="margin-top: 20px; text-align: center;">
        <button onclick="window.print()" style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;">
            🖨️ Imprimir PDF
        </button>
    </div>
</body>
</html>`;

    const ventana = window.open('', '_blank');
    ventana.document.write(contenido);
    ventana.document.close();
    
    ventana.onload = function() {
        setTimeout(() => {
            ventana.print();
        }, 500);
    };
}

// Función para imprimir tablas completas
function imprimirTabla(tipoTabla) {
    const tablas = {
        'expedientes': { titulo: 'LISTA DE EXPEDIENTES', id: 'tabla-expedientes' },
        'proveidos': { titulo: 'LISTA DE PROVEÍDOS', id: 'tabla-proveidos' },
        'preresoluciones': { titulo: 'LISTA DE PRE-RESOLUCIONES', id: 'tabla-preresoluciones' },
        'administrados': { titulo: 'LISTA DE ADMINISTRADOS', id: 'tabla-administrados' },
        'solicitudes': { titulo: 'LISTA DE SOLICITUDES', id: 'tabla-solicitudes' }
    };
    
    const config = tablas[tipoTabla];
    if (!config) return;
    
    const tabla = document.getElementById(config.id);
    if (!tabla) return;
    
    const contenido = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${config.titulo}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { text-align: center; color: #2c3e50; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #34495e; color: white; }
        tr:nth-child(even) { background-color: #f2f2f2; }
        .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #7f8c8d; }
        @media print {
            body { margin: 0; }
            .no-print { display: none; }
        }
    </style>
</head>
<body>
    <h1>${config.titulo}</h1>
    <p><strong>Fecha de emisión:</strong> ${new Date().toLocaleDateString()}</p>
    ${tabla.outerHTML}
    <div class="footer">
        Documento generado por el Sistema de Pre-Resoluciones Municipal
    </div>
    <div class="no-print" style="text-align: center; margin-top: 20px;">
        <button onclick="window.print()" style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;">
            🖨️ Imprimir
        </button>
    </div>
</body>
</html>`;
    
    const ventana = window.open('', '_blank');
    ventana.document.write(contenido);
    ventana.document.close();
}

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 SISTEMA INICIADO - VERSIÓN COMPLETA');
    
    // Cargar dashboard automáticamente
    cargarDashboardRapido();
    
    // Precargar datos esenciales en segundo plano
    setTimeout(() => {
        fetch('/expedientes').then(r => r.json()).then(data => {
            clientCache.expedientes = data;
        }).catch(() => {});
        
        fetch('/administrados').then(r => r.json()).then(data => {
            clientCache.administrados = data;
        }).catch(() => {});
    }, 1000);
});

// CONSULTAS AVANZADAS - FUNCIONES COMPLETAS
function ejecutarConsulta(tipoConsulta) {
    console.log(`🔍 Ejecutando consulta: ${tipoConsulta}`);
    
    showLoading();
    
    fetch(`/consultas?type=${tipoConsulta}`)
        .then(response => {
            if (!response.ok) throw new Error('Error del servidor');
            return response.json();
        })
        .then(data => {
            hideLoading();
            mostrarResultadosConsulta(data, tipoConsulta);
        })
        .catch(error => {
            hideLoading();
            console.error('❌ Error en consulta:', error);
            mostrarErrorConsulta(error.message);
        });
}

function mostrarResultadosConsulta(data, tipoConsulta) {
    const contenedor = document.getElementById('resultados-consulta');
    if (!contenedor) return;
    
    if (!data || data.length === 0) {
        contenedor.innerHTML = `
            <div class="sin-resultados">
                <p>📭 No se encontraron resultados para esta consulta</p>
            </div>
        `;
        return;
    }
    
    // Obtener nombres de columnas del primer objeto
    const columnas = Object.keys(data[0]);
    
    let html = `
        <div class="consulta-header">
            <h4>${obtenerTituloConsulta(tipoConsulta)}</h4>
            <div class="consulta-meta">
                <span class="resultados-count">${data.length} resultados encontrados</span>
                <button class="btn btn-small" onclick="exportarConsultaCSV(data, '${tipoConsulta}')">📊 Exportar CSV</button>
            </div>
        </div>
        <div class="table-container">
            <table class="consulta-table">
                <thead>
                    <tr>
                        ${columnas.map(col => `<th>${formatearNombreColumna(col)}</th>`).join('')}
                    </tr>
                </thead>
                <tbody>
                    ${data.map(fila => `
                        <tr>
                            ${columnas.map(col => `
                                <td>${formatearValor(fila[col])}</td>
                            `).join('')}
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
    
    contenedor.innerHTML = html;
}

function mostrarErrorConsulta(mensaje) {
    const contenedor = document.getElementById('resultados-consulta');
    if (contenedor) {
        contenedor.innerHTML = `
            <div class="error-consulta">
                <div class="error-icon">❌</div>
                <h4>Error en la consulta</h4>
                <p>${mensaje}</p>
                <button class="btn" onclick="location.reload()">🔄 Reintentar</button>
            </div>
        `;
    }
}

function obtenerTituloConsulta(tipoConsulta) {
    const titulos = {
        'fecha_preresolucion_numero': '📅 Fechas de Pre-Resoluciones',
        'encargados_fecha_preresolucion': '👤 Analistas y Fechas de Pre-Resoluciones',
        'fecha_mesa_partes_solicitud': '📋 Fechas en Mesa de Partes',
        'preresolucion_ordenada_fecha_solicitud': '📊 Pre-Resoluciones Ordenadas por Fecha de Solicitud',
        'preresoluciones_con_gerencia': '🏢 Pre-Resoluciones por Gerencia',
        'solicitudes_estado_analista': '📝 Solicitudes con Estado y Analista',
        'solicitudes_por_mesa_partes': '📦 Solicitudes por Mesa de Partes',
        'preresoluciones_por_normativa': '⚖️ Pre-Resoluciones por Normativa',
        'preresoluciones_por_mes_anio': '📅 Pre-Resoluciones por Mes y Año',
        'preresoluciones_pendientes_por_analista': '⏳ Pre-Resoluciones Pendientes por Analista'
    };
    
    return titulos[tipoConsulta] || 'Consulta Avanzada';
}

function formatearNombreColumna(columna) {
    const nombres = {
        'nupr': 'N° Pre-Resolución',
        'fed': 'Día',
        'fem': 'Mes',
        'fea': 'Año',
        'fecha': 'Fecha',
        'noal': 'Analista',
        'nums': 'N° Solicitud',
        'fpdi': 'Día Ingreso',
        'fpme': 'Mes Ingreso',
        'fpañ': 'Año Ingreso',
        'tita': 'Título',
        'estd': 'Estado',
        'noma': 'Administrado',
        'nuex': 'Expediente',
        'nomg': 'Gerencia',
        'arsg': 'Subgerencia',
        'resp': 'Responsable',
        'fuhe': 'Fundamento Hecho',
        'fude': 'Fundamento Derecho',
        'dnia': 'DNI Analista',
        'codm': 'Código Mesa',
        'cantidad': 'Cantidad',
        'mes': 'Mes',
        'anio': 'Año',
        'normativa': 'Normativa'
    };
    
    return nombres[columna] || columna.replace(/_/g, ' ').toUpperCase();
}

function formatearValor(valor) {
    if (valor === null || valor === undefined) return '-';
    if (typeof valor === 'boolean') return valor ? 'Sí' : 'No';
    if (typeof valor === 'object') return JSON.stringify(valor);
    
    return valor.toString();
}

function filtrarResultadosConsulta() {
    const filtro = document.getElementById('filtro-consulta').value.toLowerCase();
    const tabla = document.querySelector('.consulta-table');
    
    if (!tabla) return;
    
    const filas = tabla.querySelectorAll('tbody tr');
    
    filas.forEach(fila => {
        const textoFila = fila.textContent.toLowerCase();
        if (textoFila.includes(filtro)) {
            fila.style.display = '';
        } else {
            fila.style.display = 'none';
        }
    });
}

function exportarConsultaCSV(data, tipoConsulta) {
    if (!data || data.length === 0) {
        alert('No hay datos para exportar');
        return;
    }
    
    const columnas = Object.keys(data[0]);
    const cabecera = columnas.map(col => formatearNombreColumna(col)).join(',');
    
    const filas = data.map(fila => 
        columnas.map(col => {
            const valor = formatearValorCSV(fila[col]);
            return `"${valor}"`;
        }).join(',')
    );
    
    const csvContent = [cabecera, ...filas].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    const fecha = new Date().toISOString().split('T')[0];
    link.setAttribute('href', url);
    link.setAttribute('download', `consulta_${tipoConsulta}_${fecha}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function formatearValorCSV(valor) {
    if (valor === null || valor === undefined) return '';
    if (typeof valor === 'boolean') return valor ? 'Sí' : 'No';
    if (typeof valor === 'object') return JSON.stringify(valor);
    
    return valor.toString().replace(/"/g, '""');
}

// También asegúrate de que esta función esté en tu loadTabData
function loadTabData(tabName) {
    if (isLoading) return;
    
    switch(tabName) {
        case 'administrados':
            cargarAdministradosRapido();
            cargarSolicitudesRapido();
            cargarSelectsAdministrados();
            break;
        case 'expedientes':
            cargarExpedientesRapido();
            break;
        case 'proveidos':
            cargarProveidosRapido();
            break;
        case 'preresoluciones':
            cargarPreResolucionesRapido();
            break;
        case 'solicitudes':
            cargarSolicitudesRapido();
            break;
        case 'dashboard':
            cargarDashboardRapido();
            break;
        case 'nuevo':
            cargarSelectsNuevoDocumento();
            break;
        case 'consultas':
            // Limpiar resultados al entrar a consultas
            document.getElementById('resultados-consulta').innerHTML = 
                '<p class="placeholder">Seleccione una consulta para ver los resultados</p>';
            break;
    }
}
// Función de diagnóstico temporal
function probarConsultas() {
    console.log('🔧 Probando consultas...');
    
    // Probar una consulta específica
    fetch('/consultas?type=fecha_preresolucion_numero')
        .then(response => {
            console.log('📡 Estado respuesta:', response.status);
            return response.json();
        })
        .then(data => {
            console.log('📊 Datos recibidos:', data);
            if (data && data.length > 0) {
                console.log('✅ Consulta funcionando. Primer registro:', data[0]);
            } else {
                console.log('⚠️ Consulta vacía o sin datos');
            }
        })
        .catch(error => {
            console.error('❌ Error en consulta:', error);
        });
}

// Ejecutar diagnóstico al cargar la página (temporal)
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(probarConsultas, 2000);
});

// FUNCIONES DE BÚSQUEDA Y FILTRADO
function filtrarExpedientes() {
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

function filtrarProveidos() {
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

function filtrarPreResoluciones() {
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

function filtrarAdministrados() {
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

function filtrarSolicitudes() {
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

// FUNCIONES CORREGIDAS PARA INSERCIONES
function agregarAdministrado(event) {
    event.preventDefault(); 
    
    console.log("📝 Intentando agregar administrado...");
    
    // Obtener valores del formulario CORREGIDO
    const d_r = document.getElementById('d_r')?.value.trim() || '';
    const noma = document.getElementById('noma')?.value.trim() || '';
    const dir_d = document.getElementById('dir_d')?.value.trim() || '';
    const dir_a = document.getElementById('dir_a')?.value.trim() || '';
    const dir_c = document.getElementById('dir_c')?.value.trim() || '';
    const dir_n = document.getElementById('dir_n')?.value.trim() || '';

    console.log("🔍 Valores obtenidos del formulario:", {
        d_r, noma, dir_d, dir_a, dir_c, dir_n
    });

    // Validaciones
    if (!d_r || !noma || !dir_d || !dir_a || !dir_c || !dir_n) {
        alert('❌ Todos los campos son obligatorios');
        console.log("❌ Campos faltantes:", {
            d_r: !!d_r, noma: !!noma, dir_d: !!dir_d, 
            dir_a: !!dir_a, dir_c: !!dir_c, dir_n: !!dir_n
        });
        return false;
    }

    if (d_r.length < 8 || d_r.length > 11) {
        alert('❌ El DNI/RUC debe tener entre 8 y 11 caracteres');
        return false;
    }

    // Mostrar loading
    const btn = event.target.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = '⏳ Agregando...';
    btn.disabled = true;

    // Enviar via AJAX - FORMA CORRECTA
    const datos = new URLSearchParams();
    datos.append('d_r', d_r);
    datos.append('noma', noma);
    datos.append('dir_d', dir_d);
    datos.append('dir_a', dir_a);
    datos.append('dir_c', dir_c);
    datos.append('dir_n', dir_n);

    console.log("📤 Enviando datos:", Object.fromEntries(datos));

    fetch('/agregar_administrado', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: datos
    })
    .then(response => {
        console.log("📥 Respuesta recibida, status:", response.status);
        if (!response.ok) throw new Error(`Error del servidor: ${response.status}`);
        return response.json();
    })
    .then(data => {
        console.log("✅ Respuesta del servidor:", data);
        if (data.success) {
            alert('✅ Administrado agregado correctamente');
            
            // Limpiar formulario
            document.getElementById('form-administrado').reset();
            
            // Actualizar la lista
            clientCache.administrados = null;
            setTimeout(() => cargarAdministradosRapido(), 500);
            
            // Recargar select de administrados
            setTimeout(() => cargarSelectsAdministrados(), 1000);
        } else {
            throw new Error('Error en la base de datos');
        }
    })
    .catch(error => {
        console.error('❌ Error agregando administrado:', error);
        alert('❌ Error al agregar administrado: ' + error.message);
    })
    .finally(() => {
        // Restaurar botón
        btn.innerHTML = originalText;
        btn.disabled = false;
    });

    return false;
}

function agregarSolicitud(event) {
    event.preventDefault();
    
    console.log("📄 Intentando agregar solicitud...");
    
    // Obtener valores CORREGIDOS
    const administrado = document.getElementById('administrado-solicitud')?.value || '';
    const mesaPartes = document.getElementById('mesa-partes')?.value || '';
    const titulo = document.getElementById('tita-solicitud')?.value.trim() || '';
    const asunto = document.getElementById('asnt-solicitud')?.value.trim() || '';

    console.log("🔍 Valores obtenidos para solicitud:", {
        administrado, mesaPartes, titulo, asunto
    });

    // Validaciones
    if (!administrado || !mesaPartes || !titulo || !asunto) {
        alert('❌ Todos los campos son obligatorios');
        return false;
    }

    // Mostrar loading
    const btn = event.target.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = '⏳ Generando...';
    btn.disabled = true;

    // Enviar via AJAX - FORMA CORRECTA
    const datos = new URLSearchParams();
    datos.append('d_r', administrado);
    datos.append('codm', mesaPartes);
    datos.append('tita', titulo);
    datos.append('asnt', asunto);

    console.log("📤 Enviando datos de solicitud:", Object.fromEntries(datos));

    fetch('/agregar_solicitud', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: datos
    })
    .then(response => {
        console.log("📥 Respuesta recibida, status:", response.status);
        if (!response.ok) throw new Error(`Error del servidor: ${response.status}`);
        return response.json();
    })
    .then(data => {
        console.log("✅ Respuesta del servidor:", data);
        if (data.success) {
            alert(`✅ Solicitud generada correctamente\n📂 Expediente creado: ${data.expediente}`);
            
            // Limpiar formulario
            document.getElementById('form-solicitud').reset();
            
            // Actualizar listas
            clientCache.solicitudes = null;
            clientCache.expedientes = null;
            
            // Recargar datos
            setTimeout(() => {
                cargarSolicitudesRapido();
                cargarExpedientesRapido();
                cargarDashboardRapido(); // Actualizar dashboard también
            }, 500);
        } else {
            throw new Error('Error al generar la solicitud');
        }
    })
    .catch(error => {
        console.error('❌ Error agregando solicitud:', error);
        alert('❌ Error al generar solicitud: ' + error.message);
    })
    .finally(() => {
        // Restaurar botón
        btn.innerHTML = originalText;
        btn.disabled = false;
    });

    return false;
}

// Función corregida para crear proveído
function crearProveido(event) {
    event.preventDefault();
    
    console.log("📋 Intentando crear proveído...");
    
    // Obtener valores del formulario
    const expediente = document.getElementById('expediente-proveido')?.value || '';
    const instruccion = document.getElementById('instruccion')?.value.trim() || '';
    const gerencia = document.getElementById('gerencia')?.value || '';
    const subgerencia = document.getElementById('subgerencia')?.value || '';

    console.log("🔍 Valores obtenidos para proveído:", {
        expediente, instruccion, gerencia, subgerencia
    });

    // Validaciones
    if (!expediente || !instruccion || !gerencia || !subgerencia) {
        alert('❌ Todos los campos son obligatorios');
        return false;
    }

    // Mostrar loading
    const btn = event.target.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = '⏳ Creando...';
    btn.disabled = true;

    // Enviar via AJAX
    const datos = new URLSearchParams();
    datos.append('nuex', expediente);
    datos.append('ints', instruccion);
    datos.append('idger', gerencia);
    datos.append('nsub', subgerencia);

    console.log("📤 Enviando datos de proveído:", Object.fromEntries(datos));

    fetch('/crear_proveido', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: datos
    })
    .then(response => {
        console.log("📥 Respuesta recibida, status:", response.status);
        if (!response.ok) throw new Error(`Error del servidor: ${response.status}`);
        return response.json();
    })
    .then(data => {
        console.log("✅ Respuesta del servidor:", data);
        if (data.success) {
            alert('✅ Proveído creado correctamente');
            document.getElementById('form-proveido').reset();
            clientCache.proveidos = null;
            setTimeout(() => cargarProveidosRapido(), 500);
        } else {
            throw new Error('Error al crear proveído');
        }
    })
    .catch(error => {
        console.error('❌ Error creando proveído:', error);
        alert('❌ Error al crear proveído: ' + error.message);
    })
    .finally(() => {
        btn.innerHTML = originalText;
        btn.disabled = false;
    });

    return false;
}

// Función corregida para crear pre-resolución
function crearPreResolucion(event) {
    event.preventDefault();
    
    console.log("⚖️ Intentando crear pre-resolución...");
    
    // Obtener valores del formulario
    const expediente = document.getElementById('expediente-preresolucion')?.value || '';
    const estado = document.getElementById('estado')?.value || '';
    const fundamentoHecho = document.getElementById('fundamento-hecho')?.value.trim() || '';
    const fundamentoDerecho = document.getElementById('fundamento-derecho')?.value.trim() || '';
    const analista = document.getElementById('analista')?.value || '';

    console.log("🔍 Valores obtenidos para pre-resolución:", {
        expediente, estado, fundamentoHecho, fundamentoDerecho, analista
    });

    // Validaciones
    if (!expediente || !estado || !fundamentoHecho || !fundamentoDerecho || !analista) {
        alert('❌ Todos los campos son obligatorios');
        return false;
    }

    // Mostrar loading
    const btn = event.target.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = '⏳ Creando...';
    btn.disabled = true;

    // Enviar via AJAX
    const datos = new URLSearchParams();
    datos.append('nuex', expediente);
    datos.append('estd', estado);
    datos.append('fuhe', fundamentoHecho);
    datos.append('fude', fundamentoDerecho);
    datos.append('dnia', analista);

    console.log("📤 Enviando datos de pre-resolución:", Object.fromEntries(datos));

    fetch('/crear_preresolucion', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: datos
    })
    .then(response => {
        console.log("📥 Respuesta recibida, status:", response.status);
        if (!response.ok) throw new Error(`Error del servidor: ${response.status}`);
        return response.json();
    })
    .then(data => {
        console.log("✅ Respuesta del servidor:", data);
        if (data.success) {
            alert('✅ Pre-Resolución creada correctamente');
            document.getElementById('form-preresolucion').reset();
            clientCache.preresoluciones = null;
            setTimeout(() => cargarPreResolucionesRapido(), 500);
        } else {
            throw new Error('Error al crear pre-resolución');
        }
    })
    .catch(error => {
        console.error('❌ Error creando pre-resolución:', error);
        alert('❌ Error al crear pre-resolución: ' + error.message);
    })
    .finally(() => {
        btn.innerHTML = originalText;
        btn.disabled = false;
    });

    return false;
}
// Funciones para abrir modales de edición
function editarAdministrado(d_r) {
    console.log(`✏️ Editando administrado: ${d_r}`);
    
    // Buscar en los datos ya cargados
    const administrado = administradosData.find(admin => admin.d_r === d_r);
    
    if (administrado) {
        console.log("✅ Administrado encontrado:", administrado);
        mostrarModalAdministrado(administrado);
    } else {
        console.log("❌ Administrado no encontrado en datos cargados");
        alert('❌ No se pudo encontrar el administrado. Por favor, recargue la lista primero.');
        cargarAdministradosRapido();
    }
}

function editarSolicitud(nums) {
    console.log(`✏️ Editando solicitud: ${nums}`);
    
    fetch(`/obtener_solicitud/${nums}`)
        .then(response => response.json())
        .then(solicitud => {
            if (solicitud && solicitud.nums) {
                mostrarModalSolicitud(solicitud);
            } else {
                alert('❌ No se pudo cargar la información de la solicitud');
            }
        })
        .catch(error => {
            console.error('❌ Error cargando solicitud:', error);
            alert('❌ Error al cargar la información de la solicitud');
        });
}

// REEMPLAZAR completamente la función editarExpediente
// REEMPLAZAR COMPLETAMENTE esta función en script_backup.js
function editarExpediente(nuex) {
    console.log(`✏️ Editando expediente: ${nuex}`);
    console.log("📊 Expedientes en memoria:", expedientesData);
    
    // Buscar en los datos ya cargados
    const expediente = expedientesData.find(exp => {
        console.log("Buscando:", exp.nuex, "===", nuex);
        return exp.nuex === nuex;
    });
    
    if (expediente) {
        console.log("✅ Expediente encontrado:", expediente);
        mostrarModalExpediente(expediente);
    } else {
        console.log("❌ Expediente no encontrado en datos cargados");
        alert('❌ No se pudo encontrar el expediente. Por favor, recargue la lista de expedientes primero.');
        
        // Recargar automáticamente
        cargarExpedientesRapido();
    }
}

// REEMPLAZAR también las otras funciones de edición para evitar errores 404
function editarProveido(npro) {
    console.log(`✏️ Editando proveído: ${npro}`);
    
    const proveido = proveidosData.find(p => p.npro === npro);
    
    if (proveido) {
        console.log("✅ Proveído encontrado en datos cargados:", proveido);
        // Aquí puedes crear la función mostrarModalProveido si necesitas
        alert(`Edición de proveídos en desarrollo\nProveído: ${npro}`);
    } else {
        alert('❌ No se pudo encontrar el proveído. Intente recargar la lista primero.');
    }
}

function editarPreResolucion(nupr) {
    console.log(`✏️ Editando pre-resolución: ${nupr}`);
    
    const preresolucion = preresolucionesData.find(p => p.nupr === nupr);
    
    if (preresolucion) {
        console.log("✅ Pre-resolución encontrada en datos cargados:", preresolucion);
        // Aquí puedes crear la función mostrarModalPreResolucion si necesitas
        alert(`Edición de pre-resoluciones en desarrollo\nPre-Resolución: ${nupr}`);
    } else {
        alert('❌ No se pudo encontrar la pre-resolución. Intente recargar la lista primero.');
    }
}


// Funciones para eliminar registros
// Función mejorada para eliminar con advertencia fuerte
function eliminarAdministrado(d_r, nombre) {
    // Primero verificar qué se va a eliminar
    fetch(`/verificar_dependencias_administrado/${d_r}`)
        .then(response => response.json())
        .then(dependencias => {
            let mensaje = `⚠️ ELIMINACIÓN EN CASCADA - ADVERTENCIA ⚠️\n\n`;
            mensaje += `Está a punto de eliminar al administrado:\n`;
            mensaje += `📝 ${nombre} (${d_r})\n\n`;
            
            if (dependencias.solicitudes > 0) {
                mensaje += `🔴 Se eliminarán también:\n`;
                mensaje += `   • ${dependencias.solicitudes} solicitud(es)\n`;
                mensaje += `   • Todos los expedientes relacionados\n`;
                mensaje += `   • Todos los proveídos relacionados\n`;
                mensaje += `   • Todas las pre-resoluciones relacionadas\n\n`;
            }
            
            mensaje += `❌ ESTA ACCIÓN NO SE PUEDE DESHACER\n`;
            mensaje += `📊 Se registrará en el sistema de auditoría\n\n`;
            mensaje += `¿CONFIRMA que desea proceder con la eliminación?`;

            if (confirm(mensaje)) {
                // Proceder con eliminación en cascada
                const datos = new URLSearchParams();
                datos.append('d_r', d_r);

                fetch('/eliminar_administrado', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: datos
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        alert('✅ ' + data.message);
                        // Limpiar caché y recargar
                        clientCache.administrados = null;
                        clientCache.solicitudes = null;
                        clientCache.expedientes = null;
                        clientCache.proveidos = null;
                        clientCache.preresoluciones = null;
                        
                        // Recargar todo
                        cargarAdministradosRapido();
                        cargarSolicitudesRapido();
                        cargarExpedientesRapido();
                        cargarProveidosRapido();
                        cargarPreResolucionesRapido();
                        cargarDashboardRapido();
                    } else {
                        alert('❌ ' + (data.message || 'Error al eliminar'));
                    }
                })
                .catch(error => {
                    console.error('❌ Error eliminando administrado:', error);
                    alert('❌ Error al eliminar administrado');
                });
            }
        })
        .catch(error => {
            console.error('❌ Error verificando dependencias:', error);
            // Si falla la verificación, proceder con eliminación normal
            eliminarDirectamenteAdministrado(d_r, nombre);
        });
}

// Función de respaldo si falla la verificación
function eliminarDirectamenteAdministrado(d_r, nombre) {
    const mensaje = `¿Está seguro de eliminar al administrado?\n${nombre} (${d_r})\n\nEsta acción eliminará TODOS los registros relacionados.`;
    
    if (confirm(mensaje)) {
        const datos = new URLSearchParams();
        datos.append('d_r', d_r);

        fetch('/eliminar_administrado', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: datos
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('✅ ' + data.message);
                clientCache.administrados = null;
                cargarAdministradosRapido();
                cargarDashboardRapido();
            } else {
                alert('❌ ' + (data.message || 'Error al eliminar'));
            }
        })
        .catch(error => {
            console.error('❌ Error eliminando administrado:', error);
            alert('❌ Error al eliminar administrado');
        });
    }
}
// Para solicitudes
function eliminarSolicitud(nums, titulo) {
    let mensaje = `⚠️ ELIMINACIÓN EN CASCADA - ADVERTENCIA ⚠️\n\n`;
    mensaje += `Está a punto de eliminar la solicitud:\n`;
    mensaje += `📋 ${titulo} (${nums})\n\n`;
    mensaje += `🔴 Se eliminarán también:\n`;
    mensaje += `   • El expediente relacionado\n`;
    mensaje += `   • Todos los proveídos del expediente\n`;
    mensaje += `   • Todas las pre-resoluciones del expediente\n\n`;
    mensaje += `❌ ESTA ACCIÓN NO SE PUEDE DESHACER\n`;
    mensaje += `📊 Se registrará en el sistema de auditoría\n\n`;
    mensaje += `¿CONFIRMA que desea proceder con la eliminación?`;

    if (confirm(mensaje)) {
        const datos = new URLSearchParams();
        datos.append('nums', nums);

        fetch('/eliminar_solicitud', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: datos
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('✅ ' + data.message);
                clientCache.solicitudes = null;
                clientCache.expedientes = null;
                clientCache.proveidos = null;
                clientCache.preresoluciones = null;
                
                cargarSolicitudesRapido();
                cargarExpedientesRapido();
                cargarProveidosRapido();
                cargarPreResolucionesRapido();
                cargarDashboardRapido();
            } else {
                alert('❌ ' + (data.message || 'Error al eliminar'));
            }
        })
        .catch(error => {
            console.error('❌ Error eliminando solicitud:', error);
            alert('❌ Error al eliminar solicitud');
        });
    }
}

// Para expedientes
function eliminarExpediente(nuex, descripcion) {
    let mensaje = `⚠️ ELIMINACIÓN EN CASCADA - ADVERTENCIA ⚠️\n\n`;
    mensaje += `Está a punto de eliminar el expediente:\n`;
    mensaje += `📁 ${descripcion} (${nuex})\n\n`;
    mensaje += `🔴 Se eliminarán también:\n`;
    mensaje += `   • Todos los proveídos del expediente\n`;
    mensaje += `   • Todas las pre-resoluciones del expediente\n\n`;
    mensaje += `❌ ESTA ACCIÓN NO SE PUEDE DESHACER\n`;
    mensaje += `📊 Se registrará en el sistema de auditoría\n\n`;
    mensaje += `¿CONFIRMA que desea proceder con la eliminación?`;

    if (confirm(mensaje)) {
        const datos = new URLSearchParams();
        datos.append('nuex', nuex);

        fetch('/eliminar_expediente', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: datos
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('✅ ' + data.message);
                clientCache.expedientes = null;
                clientCache.proveidos = null;
                clientCache.preresoluciones = null;
                
                cargarExpedientesRapido();
                cargarProveidosRapido();
                cargarPreResolucionesRapido();
                cargarDashboardRapido();
            } else {
                alert('❌ ' + (data.message || 'Error al eliminar'));
            }
        })
        .catch(error => {
            console.error('❌ Error eliminando expediente:', error);
            alert('❌ Error al eliminar expediente');
        });
    }
}

// Función para hacer los mensajes más visibles
function mostrarAdvertenciaEliminacion(titulo, detalles) {
    // Podrías usar un modal personalizado aquí en lugar de confirm()
    // Por ahora usamos confirm con emojis para mayor visibilidad
    return confirm(`🚨🚨🚨 ELIMINACIÓN IRREVERSIBLE 🚨🚨🚨\n\n${titulo}\n\n${detalles}\n\n⚠️  ESTA ACCIÓN NO SE PUEDE DESHACER  ⚠️\n\n¿CONFIRMA LA ELIMINACIÓN?`);
}

// script_edicion.js - SISTEMA COMPLETO DE EDICIÓN
let modalAbierto = null;

function editarSolicitud(nums) {
    console.log(`✏️ Editando solicitud: ${nums}`);
    
    fetch(`/obtener_solicitud/${nums}`)
        .then(response => response.json())
        .then(solicitud => {
            if (solicitud && solicitud.nums) {
                mostrarModalSolicitud(solicitud);
            } else {
                alert('❌ No se pudo cargar la información de la solicitud');
            }
        })
        .catch(error => {
            console.error('❌ Error cargando solicitud:', error);
            alert('❌ Error al cargar la información de la solicitud');
        });
}



// Funciones para mostrar modales
function mostrarModalAdministrado(admin) {
    const modalHTML = `
        <div id="modal-editar" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2 class="modal-title">✏️ Editar Administrado</h2>
                    <span class="close" onclick="cerrarModal()">&times;</span>
                </div>
                <div class="modal-body">
                    <form id="form-editar-administrado">
                        <div class="form-group">
                            <label for="editar-d_r">DNI/RUC:</label>
                            <input type="text" id="editar-d_r" value="${admin.d_r || ''}" readonly class="readonly-field">
                            <small>Este campo no se puede modificar</small>
                        </div>
                        <div class="form-group">
                            <label for="editar-noma">Nombre Completo:</label>
                            <input type="text" id="editar-noma" value="${admin.noma || ''}" required placeholder="Nombre completo del administrado">
                        </div>
                        <div class="form-group">
                            <label for="editar-dir_d">Dirección Distrito:</label>
                            <input type="text" id="editar-dir_d" value="${admin.dir_d || ''}" required placeholder="Distrito">
                        </div>
                        <div class="form-group">
                            <label for="editar-dir_a">Urbanización:</label>
                            <input type="text" id="editar-dir_a" value="${admin.dir_a || ''}" required placeholder="Urbanización">
                        </div>
                        <div class="form-group">
                            <label for="editar-dir_c">Ciudad:</label>
                            <input type="text" id="editar-dir_c" value="${admin.dir_c || ''}" required placeholder="Ciudad">
                        </div>
                        <div class="form-group">
                            <label for="editar-dir_n">Calle/Jr/Av:</label>
                            <input type="text" id="editar-dir_n" value="${admin.dir_n || ''}" required placeholder="Calle, Jirón o Avenida">
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-cancelar" onclick="cerrarModal()">❌ Cancelar</button>
                    <button class="btn btn-guardar" onclick="guardarAdministrado()">💾 Guardar Cambios</button>
                </div>
            </div>
        </div>
    `;
    
    mostrarModal(modalHTML);
}

function mostrarModalSolicitud(solicitud) {
    const estado = solicitud.estd ? 'true' : 'false';
    const modalHTML = `
        <div id="modal-editar" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2 class="modal-title">✏️ Editar Solicitud</h2>
                    <span class="close" onclick="cerrarModal()">&times;</span>
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
                    <button class="btn btn-cancelar" onclick="cerrarModal()">❌ Cancelar</button>
                    <button class="btn btn-guardar" onclick="guardarSolicitud()">💾 Guardar Cambios</button>
                </div>
            </div>
        </div>
    `;
    
    mostrarModal(modalHTML);
}

function mostrarModalExpediente(expediente) {
    console.log("📝 Mostrando modal para expediente:", expediente);
    
    // Formatear fecha para input type="date"
    let fechaFormateada = '';
    if (expediente.fecha) {
        try {
            // Intentar diferentes formatos de fecha
            if (expediente.fecha.includes('T')) {
                fechaFormateada = expediente.fecha.split('T')[0];
            } else if (expediente.fecha.includes('/')) {
                // Convertir de formato DD/MM/YYYY a YYYY-MM-DD
                const partes = expediente.fecha.split('/');
                if (partes.length === 3) {
                    fechaFormateada = `${partes[2]}-${partes[1].padStart(2, '0')}-${partes[0].padStart(2, '0')}`;
                }
            } else {
                fechaFormateada = expediente.fecha;
            }
        } catch (error) {
            console.warn("⚠️ Error formateando fecha:", error);
        }
    }
    
    const modalHTML = `
        <div id="modal-editar" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2 class="modal-title">✏️ Editar Expediente</h2>
                    <span class="close" onclick="cerrarModal()">&times;</span>
                </div>
                <div class="modal-body">
                    <form id="form-editar-expediente">
                        <div class="form-group">
                            <label for="editar-nuex">N° Expediente:</label>
                            <input type="text" id="editar-nuex" value="${expediente.nuex || ''}" readonly class="readonly-field">
                            <small>Este campo no se puede modificar</small>
                        </div>
                        <div class="form-group">
                            <label for="editar-fecha">Fecha:</label>
                            <input type="date" id="editar-fecha" value="${fechaFormateada}">
                        </div>
                        <div class="form-group">
                            <label for="editar-estd">Estado:</label>
                            <select id="editar-estd" required>
                                <option value="">Seleccionar estado...</option>
                                <option value="En revision" ${expediente.estd === 'En revision' ? 'selected' : ''}>En revisión</option>
                                <option value="Aprobado" ${expediente.estd === 'Aprobado' ? 'selected' : ''}>Aprobado</option>
                                <option value="Observado" ${expediente.estd === 'Observado' ? 'selected' : ''}>Observado</option>
                                <option value="Pendiente" ${expediente.estd === 'Pendiente' ? 'selected' : ''}>Pendiente</option>
                                <option value="Finalizado" ${expediente.estd === 'Finalizado' ? 'selected' : ''}>Finalizado</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="editar-aresp">Responsable:</label>
                            <input type="text" id="editar-aresp" value="${expediente.aresp || ''}" required placeholder="Nombre del responsable">
                        </div>
                        <div class="form-group">
                            <label for="editar-asnt">Asunto:</label>
                            <textarea id="editar-asnt" rows="4" required placeholder="Descripción del asunto">${expediente.asnt || ''}</textarea>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-cancelar" onclick="cerrarModal()">❌ Cancelar</button>
                    <button class="btn btn-guardar" onclick="guardarExpediente()">💾 Guardar Cambios</button>
                </div>
            </div>
        </div>
    `;
    
    mostrarModal(modalHTML);
    
    // Verificar que todos los elementos se crearon correctamente
    setTimeout(() => {
        console.log("🔍 Verificando elementos del modal:");
        console.log("- editar-nuex:", document.getElementById('editar-nuex'));
        console.log("- editar-fecha:", document.getElementById('editar-fecha'));
        console.log("- editar-estd:", document.getElementById('editar-estd'));
        console.log("- editar-aresp:", document.getElementById('editar-aresp'));
        console.log("- editar-asnt:", document.getElementById('editar-asnt'));
    }, 100);
}

function probarEndpointActualizar() {
    console.log("🔍 Probando endpoint /actualizar_expediente...");
    
    const datosTest = new URLSearchParams();
    datosTest.append('nuex', 'TEST123');
    datosTest.append('estd', 'Aprobado');
    datosTest.append('aresp', 'Responsable Test');
    datosTest.append('asnt', 'Asunto de prueba');
    
    fetch('/actualizar_expediente', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: datosTest
    })
    .then(response => {
        console.log("📊 Respuesta del servidor:");
        console.log("- Status:", response.status);
        console.log("- OK:", response.ok);
        console.log("- Headers:", response.headers);
        
        // Leer la respuesta como texto primero
        return response.text();
    })
    .then(texto => {
        console.log("📄 Respuesta en texto:", texto);
        
        try {
            // Intentar parsear como JSON
            const data = JSON.parse(texto);
            console.log("✅ JSON parseado:", data);
        } catch (e) {
            console.log("❌ No es JSON válido:", texto);
        }
    })
    .catch(error => {
        console.error("❌ Error en la petición:", error);
    });
}

// Ejecutar en consola: probarEndpointActualizar()

function guardarAdministrado() {
    console.log("💾 Guardando administrado...");
    
    try {
        const d_r = document.getElementById('editar-d_r').value;
        const noma = document.getElementById('editar-noma').value;
        const dir_d = document.getElementById('editar-dir_d').value;
        const dir_a = document.getElementById('editar-dir_a').value;
        const dir_c = document.getElementById('editar-dir_c').value;
        const dir_n = document.getElementById('editar-dir_n').value;

        if (!d_r || !noma || !dir_d || !dir_a || !dir_c || !dir_n) {
            alert('❌ Todos los campos son obligatorios');
            return;
        }

        console.log("📦 Datos a guardar:", { d_r, noma, dir_d, dir_a, dir_c, dir_n });

        const btnGuardar = document.querySelector('#modal-editar .btn-guardar');
        const originalText = btnGuardar.innerHTML;
        btnGuardar.innerHTML = '⏳ Guardando...';
        btnGuardar.disabled = true;

        const datos = new URLSearchParams();
        datos.append('d_r', d_r);
        datos.append('noma', noma);
        datos.append('dir_d', dir_d);
        datos.append('dir_a', dir_a);
        datos.append('dir_c', dir_c);
        datos.append('dir_n', dir_n);

        fetch('/actualizar_administrado', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: datos
        })
        .then(response => response.json())
        .then(data => {
            if (data && data.success === true) {
                alert('✅ Administrado actualizado correctamente');
                cerrarModal();
                cargarAdministradosRapido();
            } else {
                throw new Error(data.message || 'Error del servidor');
            }
        })
        .catch(error => {
            console.log("⚠️ Error en servidor, usando actualización local:", error.message);
            actualizarAdministradoLocal(d_r, { noma, dir_d, dir_a, dir_c, dir_n });
        })
        .finally(() => {
            btnGuardar.innerHTML = originalText;
            btnGuardar.disabled = false;
        });

    } catch (error) {
        console.error('❌ Error:', error);
        alert('❌ Error: ' + error.message);
    }
}


function actualizarAdministradoLocal(d_r, nuevosDatos) {
    console.log("🔄 Actualizando administrado localmente:", d_r, nuevosDatos);
    
    const adminIndex = administradosData.findIndex(admin => admin.d_r === d_r);
    if (adminIndex !== -1) {
        administradosData[adminIndex] = {
            ...administradosData[adminIndex],
            ...nuevosDatos
        };
        
        renderizarAdministrados(administradosData);
        alert('✅ Administrado actualizado ');
        cerrarModal();
    } else {
        alert('❌ No se pudo encontrar el administrado para actualizar');
    }
}

function guardarSolicitud() {
    const nums = document.getElementById('editar-nums').value;
    const tita = document.getElementById('editar-tita').value;
    const estd = document.getElementById('editar-estd').value;
    const asnt = document.getElementById('editar-asnt').value;

    if (!tita || !asnt) {
        alert('❌ Todos los campos son obligatorios');
        return;
    }

    const datos = new URLSearchParams();
    datos.append('nums', nums);
    datos.append('tita', tita);
    datos.append('estd', estd);
    datos.append('asnt', asnt);

    fetch('/actualizar_solicitud', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: datos
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('✅ Solicitud actualizada correctamente');
            cerrarModal();
            clientCache.solicitudes = null;
            cargarSolicitudesRapido();
        } else {
            alert('❌ Error al actualizar solicitud');
        }
    })
    .catch(error => {
        console.error('❌ Error actualizando solicitud:', error);
        alert('❌ Error al actualizar solicitud');
    });
}

// REEMPLAZAR la función guardarExpediente con esta versión corregida
function guardarExpediente() {
    console.log("💾 Iniciando guardado de expediente...");
    
    try {
        // Obtener valores con verificación segura
        const getValue = (id) => {
            const element = document.getElementById(id);
            if (!element) {
                console.error(`❌ Elemento ${id} no encontrado`);
                return null;
            }
            return element.value;
        };

        const nuex = getValue('editar-nuex');
        const fecha = getValue('editar-fecha');
        const estd = getValue('editar-estd');
        const aresp = getValue('editar-aresp');
        const asnt = getValue('editar-asnt');

        // Verificar que se obtuvieron todos los valores necesarios
        if (!nuex || !estd || !aresp || !asnt) {
            alert('❌ Error: Faltan campos obligatorios. Por favor complete todos los campos.');
            return;
        }

        console.log("📦 Datos a enviar:", { nuex, fecha, estd, aresp, asnt });

        // Mostrar loading
        const btnGuardar = document.querySelector('#modal-editar .btn-guardar');
        if (!btnGuardar) {
            alert('❌ Error: No se pudo encontrar el botón de guardar');
            return;
        }

        const originalText = btnGuardar.innerHTML;
        btnGuardar.innerHTML = '⏳ Guardando...';
        btnGuardar.disabled = true;

        // Preparar datos para enviar
        const datos = new URLSearchParams();
        datos.append('nuex', nuex);
        if (fecha) datos.append('fecha', fecha);
        datos.append('estd', estd);
        datos.append('aresp', aresp);
        datos.append('asnt', asnt);

        console.log("📤 Enviando datos al servidor...");

        // Hacer la petición
        fetch('/actualizar_expediente', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: datos
        })
        .then(response => {
            console.log("📥 Respuesta HTTP:", response.status, response.statusText);
            
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status} ${response.statusText}`);
            }
            
            return response.json();
        })
        .then(data => {
            console.log("✅ Respuesta del servidor:", data);
            
            if (data && data.success === true) {
                alert('✅ Expediente actualizado correctamente');
                cerrarModal();
                
                // Recargar los datos
                setTimeout(() => {
                    cargarExpedientesRapido();
                    console.log("🔄 Lista de expedientes recargada");
                }, 500);
                
            } else {
                // El servidor respondió pero con success: false
                const mensajeError = data.message || 'Error desconocido del servidor';
                throw new Error(mensajeError);
            }
        })
        .catch(error => {
            console.error('❌ Error en el proceso de guardado:', error);
            
            let mensajeUsuario = 'Error al actualizar expediente: ';
            
            if (error.name === 'TypeError' && error.message.includes('JSON')) {
                mensajeUsuario += 'El servidor respondió con un formato incorrecto';
            } else if (error.message.includes('HTTP')) {
                mensajeUsuario += error.message;
            } else {
                mensajeUsuario += error.message;
            }
            
            alert('❌ ' + mensajeUsuario);
        })
        .finally(() => {
            // Restaurar botón
            btnGuardar.innerHTML = originalText;
            btnGuardar.disabled = false;
            console.log("🔚 Proceso de guardado finalizado");
        });

    } catch (error) {
        console.error('❌ Error crítico en guardarExpediente:', error);
        alert('❌ Error crítico: ' + error.message);
    }
}
// FUNCIONES AUXILIARES DEL MODAL
function mostrarModal(html) {
    // Cerrar modal anterior si existe
    const modalAnterior = document.getElementById('modal-editar');
    if (modalAnterior) {
        modalAnterior.remove();
    }
    
    // Crear nuevo modal
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = html;
    document.body.appendChild(modalContainer);
    
    // Mostrar modal
    const modal = document.getElementById('modal-editar');
    modal.style.display = 'block';
    
    // Cerrar modal al hacer click fuera
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            cerrarModal();
        }
    });
    
    // Cerrar con tecla Escape
    document.addEventListener('keydown', function closeOnEscape(event) {
        if (event.key === 'Escape') {
            cerrarModal();
            document.removeEventListener('keydown', closeOnEscape);
        }
    });
}

function cerrarModal() {
    const modal = document.getElementById('modal-editar');
    if (modal) {
        modal.style.display = 'none';
        modal.remove();
    }
}

// Agregar event listeners para tecla Escape
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        cerrarModal();
    }
});

// Agregar event listeners para tecla Escape
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        cerrarModal();
    }
});
