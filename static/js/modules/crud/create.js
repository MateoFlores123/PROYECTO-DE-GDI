// create.js - CREAR REGISTROS
import * as Cache from '../api/cache.js';
import * as Read from './read.js';
import * as Helpers from '../utils/helpers.js';

export function agregarAdministrado(event) {
    event.preventDefault(); 
    
    console.log("📝 Intentando agregar administrado...");
    
    const d_r = document.getElementById('d_r')?.value.trim() || '';
    const noma = document.getElementById('noma')?.value.trim() || '';
    const dir_d = document.getElementById('dir_d')?.value.trim() || '';
    const dir_a = document.getElementById('dir_a')?.value.trim() || '';
    const dir_c = document.getElementById('dir_c')?.value.trim() || '';
    const dir_n = document.getElementById('dir_n')?.value.trim() || '';

    console.log("🔍 Valores obtenidos:", { d_r, noma, dir_d, dir_a, dir_c, dir_n });

    // Validaciones
    if (!d_r || !noma || !dir_d || !dir_a || !dir_c || !dir_n) {
        alert('❌ Todos los campos son obligatorios');
        return false;
    }

    if (d_r.length < 8 || d_r.length > 11) {
        alert('❌ El DNI/RUC debe tener entre 8 y 11 caracteres');
        return false;
    }

    const btn = event.target.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = '⏳ Agregando...';
    btn.disabled = true;

    const datos = new URLSearchParams();
    datos.append('d_r', d_r);
    datos.append('noma', noma);
    datos.append('dir_d', dir_d);
    datos.append('dir_a', dir_a);
    datos.append('dir_c', dir_c);
    datos.append('dir_n', dir_n);

    fetch('/agregar_administrado', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: datos
    })
    .then(response => {
        if (!response.ok) throw new Error(`Error del servidor: ${response.status}`);
        return response.json();
    })
    .then(data => {
        if (data.success) {
            alert('✅ Administrado agregado correctamente');
            document.getElementById('form-administrado').reset();
            Cache.clearCache('administrados');
            setTimeout(() => Read.cargarAdministradosRapido(), 500);
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
        btn.innerHTML = originalText;
        btn.disabled = false;
    });

    return false;
}

export function agregarSolicitud(event) {
    event.preventDefault();
    
    console.log("📄 Intentando agregar solicitud...");
    
    const administrado = document.getElementById('administrado-solicitud')?.value || '';
    const mesaPartes = document.getElementById('mesa-partes')?.value || '';
    const titulo = document.getElementById('tita-solicitud')?.value.trim() || '';
    const asunto = document.getElementById('asnt-solicitud')?.value.trim() || '';

    console.log("🔍 Valores obtenidos:", { administrado, mesaPartes, titulo, asunto });

    if (!administrado || !mesaPartes || !titulo || !asunto) {
        alert('❌ Todos los campos son obligatorios');
        return false;
    }

    const btn = event.target.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = '⏳ Generando...';
    btn.disabled = true;

    const datos = new URLSearchParams();
    datos.append('d_r', administrado);
    datos.append('codm', mesaPartes);
    datos.append('tita', titulo);
    datos.append('asnt', asunto);

    fetch('/agregar_solicitud', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: datos
    })
    .then(response => {
        if (!response.ok) throw new Error(`Error del servidor: ${response.status}`);
        return response.json();
    })
    .then(data => {
        if (data.success) {
            alert(`✅ Solicitud generada correctamente\n📂 Expediente creado: ${data.expediente}`);
            document.getElementById('form-solicitud').reset();
            Cache.clearCache('solicitudes');
            Cache.clearCache('expedientes');
            setTimeout(() => {
                Read.cargarSolicitudesRapido();
                Read.cargarExpedientesRapido();
                Read.cargarDashboardRapido();
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
        btn.innerHTML = originalText;
        btn.disabled = false;
    });

    return false;
}

export function crearProveido(event) {
    event.preventDefault();
    
    console.log("📋 Intentando crear proveído...");
    
    const expediente = document.getElementById('expediente-proveido')?.value || '';
    const instruccion = document.getElementById('instruccion')?.value.trim() || '';
    const gerencia = document.getElementById('gerencia')?.value || '';
    const subgerencia = document.getElementById('subgerencia')?.value || '';

    console.log("🔍 Valores obtenidos:", { expediente, instruccion, gerencia, subgerencia });

    if (!expediente || !instruccion || !gerencia || !subgerencia) {
        alert('❌ Todos los campos son obligatorios');
        return false;
    }

    const btn = event.target.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = '⏳ Creando...';
    btn.disabled = true;

    const datos = new URLSearchParams();
    datos.append('nuex', expediente);
    datos.append('ints', instruccion);
    datos.append('idger', gerencia);
    datos.append('nsub', subgerencia);

    fetch('/crear_proveido', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: datos
    })
    .then(response => {
        if (!response.ok) throw new Error(`Error del servidor: ${response.status}`);
        return response.json();
    })
    .then(data => {
        if (data.success) {
            alert('✅ Proveído creado correctamente');
            document.getElementById('form-proveido').reset();
            Cache.clearCache('proveidos');
            setTimeout(() => Read.cargarProveidosRapido(), 500);
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

export function crearPreResolucion(event) {
    event.preventDefault();
    
    console.log("⚖️ Intentando crear pre-resolución...");
    
    const expediente = document.getElementById('expediente-preresolucion')?.value || '';
    const estado = document.getElementById('estado')?.value || '';
    const fundamentoHecho = document.getElementById('fundamento-hecho')?.value.trim() || '';
    const fundamentoDerecho = document.getElementById('fundamento-derecho')?.value.trim() || '';
    const analista = document.getElementById('analista')?.value || '';

    console.log("🔍 Valores obtenidos:", { expediente, estado, fundamentoHecho, fundamentoDerecho, analista });

    if (!expediente || !estado || !fundamentoHecho || !fundamentoDerecho || !analista) {
        alert('❌ Todos los campos son obligatorios');
        return false;
    }

    const btn = event.target.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = '⏳ Creando...';
    btn.disabled = true;

    const datos = new URLSearchParams();
    datos.append('nuex', expediente);
    datos.append('estd', estado);
    datos.append('fuhe', fundamentoHecho);
    datos.append('fude', fundamentoDerecho);
    datos.append('dnia', analista);

    fetch('/crear_preresolucion', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: datos
    })
    .then(response => {
        if (!response.ok) throw new Error(`Error del servidor: ${response.status}`);
        return response.json();
    })
    .then(data => {
        if (data.success) {
            alert('✅ Pre-Resolución creada correctamente');
            document.getElementById('form-preresolucion').reset();
            Cache.clearCache('preresoluciones');
            setTimeout(() => Read.cargarPreResolucionesRapido(), 500);
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

// Funciones auxiliares para selects
export function cargarSelectsAdministrados() {
    console.log("🔄 Cargando selects para administrados...");
    
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

export function cargarSelectsNuevoDocumento() {
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
