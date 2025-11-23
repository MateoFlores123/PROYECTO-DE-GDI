// delete.js - ELIMINAR REGISTROS
import * as Cache from '../api/cache.js';
import * as Read from './read.js';

export function eliminarAdministrado(d_r, nombre) {
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
                        Cache.clearAll();
                        Read.cargarAdministradosRapido();
                        Read.cargarSolicitudesRapido();
                        Read.cargarExpedientesRapido();
                        Read.cargarProveidosRapido();
                        Read.cargarPreResolucionesRapido();
                        Read.cargarDashboardRapido();
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
            eliminarDirectamenteAdministrado(d_r, nombre);
        });
}

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
                Cache.clearCache('administrados');
                Read.cargarAdministradosRapido();
                Read.cargarDashboardRapido();
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

export function eliminarSolicitud(nums, titulo) {
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
                Cache.clearCache('solicitudes');
                Cache.clearCache('expedientes');
                Cache.clearCache('proveidos');
                Cache.clearCache('preresoluciones');
                Read.cargarSolicitudesRapido();
                Read.cargarExpedientesRapido();
                Read.cargarProveidosRapido();
                Read.cargarPreResolucionesRapido();
                Read.cargarDashboardRapido();
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

export function eliminarExpediente(nuex, descripcion) {
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
                Cache.clearCache('expedientes');
                Cache.clearCache('proveidos');
                Cache.clearCache('preresoluciones');
                Read.cargarExpedientesRapido();
                Read.cargarProveidosRapido();
                Read.cargarPreResolucionesRapido();
                Read.cargarDashboardRapido();
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

export function eliminarProveido(npro, expediente) {
    const mensaje = `¿Está seguro de eliminar el proveído?\nN° ${npro}\nExpediente: ${expediente}\n\n❌ Esta acción no se puede deshacer.`;
    
    if (confirm(mensaje)) {
        const datos = new URLSearchParams();
        datos.append('npro', npro);

        fetch('/eliminar_proveido', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: datos
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('✅ Proveído eliminado correctamente');
                Cache.clearCache('proveidos');
                Read.cargarProveidosRapido();
            } else {
                alert('❌ Error al eliminar proveído');
            }
        })
        .catch(error => {
            console.error('❌ Error eliminando proveído:', error);
            alert('❌ Error al eliminar proveído');
        });
    }
}

export function eliminarPreResolucion(nupr, expediente) {
    const mensaje = `¿Está seguro de eliminar la pre-resolución?\nN° ${nupr}\nExpediente: ${expediente}\n\n❌ Esta acción no se puede deshacer.`;
    
    if (confirm(mensaje)) {
        const datos = new URLSearchParams();
        datos.append('nupr', nupr);

        fetch('/eliminar_preresolucion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: datos
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('✅ Pre-resolución eliminada correctamente');
                Cache.clearCache('preresoluciones');
                Read.cargarPreResolucionesRapido();
            } else {
                alert('❌ Error al eliminar pre-resolución');
            }
        })
        .catch(error => {
            console.error('❌ Error eliminando pre-resolución:', error);
            alert('❌ Error al eliminar pre-resolución');
        });
    }
}
