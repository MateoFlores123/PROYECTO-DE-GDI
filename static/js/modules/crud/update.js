// update.js - EDITAR REGISTROS
import * as Cache from '../api/cache.js';
import * as Read from './read.js';
import * as Modals from '../ui/modals.js';

export function editarAdministrado(d_r) {
    console.log(`✏️ Editando administrado: ${d_r}`);
    
    fetch(`/obtener_administrado/${d_r}`)
        .then(response => response.json())
        .then(administrado => {
            if (administrado && administrado.d_r) {
                Modals.mostrarModalAdministrado(administrado);
            } else {
                alert('❌ No se pudo cargar la información del administrado');
            }
        })
        .catch(error => {
            console.error('❌ Error cargando administrado:', error);
            alert('❌ Error al cargar la información del administrado');
        });
}

export function editarSolicitud(nums) {
    console.log(`✏️ Editando solicitud: ${nums}`);
    
    fetch(`/obtener_solicitud/${nums}`)
        .then(response => response.json())
        .then(solicitud => {
            if (solicitud && solicitud.nums) {
                Modals.mostrarModalSolicitud(solicitud);
            } else {
                alert('❌ No se pudo cargar la información de la solicitud');
            }
        })
        .catch(error => {
            console.error('❌ Error cargando solicitud:', error);
            alert('❌ Error al cargar la información de la solicitud');
        });
}

export function editarExpediente(nuex) {
    console.log(`✏️ Editando expediente: ${nuex}`);
    
    fetch(`/obtener_expediente/${nuex}`)
        .then(response => response.json())
        .then(expediente => {
            if (expediente && expediente.nuex) {
                Modals.mostrarModalExpediente(expediente);
            } else {
                alert('❌ No se pudo cargar la información del expediente');
            }
        })
        .catch(error => {
            console.error('❌ Error cargando expediente:', error);
            alert('❌ Error al cargar la información del expediente');
        });
}

export function guardarAdministrado() {
    const d_r = document.getElementById('editar-d_r').value;
    const noma = document.getElementById('editar-noma').value;
    const dir_d = document.getElementById('editar-dir_d').value;
    const dir_a = document.getElementById('editar-dir_a').value;
    const dir_c = document.getElementById('editar-dir_c').value;
    const dir_n = document.getElementById('editar-dir_n').value;

    if (!noma || !dir_d || !dir_a || !dir_c || !dir_n) {
        alert('❌ Todos los campos son obligatorios');
        return;
    }

    const datos = new URLSearchParams();
    datos.append('d_r', d_r);
    datos.append('noma', noma);
    datos.append('dir_d', dir_d);
    datos.append('dir_a', dir_a);
    datos.append('dir_c', dir_c);
    datos.append('dir_n', dir_n);

    fetch('/actualizar_administrado', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: datos
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('✅ Administrado actualizado correctamente');
            Modals.cerrarModal();
            Cache.clearCache('administrados');
            Read.cargarAdministradosRapido();
        } else {
            alert('❌ Error al actualizar administrado');
        }
    })
    .catch(error => {
        console.error('❌ Error actualizando administrado:', error);
        alert('❌ Error al actualizar administrado');
    });
}

export function guardarSolicitud() {
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
            Modals.cerrarModal();
            Cache.clearCache('solicitudes');
            Read.cargarSolicitudesRapido();
        } else {
            alert('❌ Error al actualizar solicitud');
        }
    })
    .catch(error => {
        console.error('❌ Error actualizando solicitud:', error);
        alert('❌ Error al actualizar solicitud');
    });
}

export function guardarExpediente() {
    const nuex = document.getElementById('editar-nuex').value;
    const estd = document.getElementById('editar-estd').value;
    const aresp = document.getElementById('editar-aresp').value;
    const asnt = document.getElementById('editar-asnt').value;

    if (!estd || !aresp || !asnt) {
        alert('❌ Todos los campos son obligatorios');
        return;
    }

    const datos = new URLSearchParams();
    datos.append('nuex', nuex);
    datos.append('estd', estd);
    datos.append('aresp', aresp);
    datos.append('asnt', asnt);

    fetch('/actualizar_expediente', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: datos
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('✅ Expediente actualizado correctamente');
            Modals.cerrarModal();
            Cache.clearCache('expedientes');
            Read.cargarExpedientesRapido();
        } else {
            alert('❌ Error al actualizar expediente');
        }
    })
    .catch(error => {
        console.error('❌ Error actualizando expediente:', error);
        alert('❌ Error al actualizar expediente');
    });
}
