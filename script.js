document.addEventListener('DOMContentLoaded', () => {
    const ramos = document.querySelectorAll('.ramo');

    // 1. Lógica de Requisitos
    const puedeAprobar = (el) => {
        const reqs = el.getAttribute('data-req');
        if (!reqs) return true;

        if (reqs === 'ALL_1_4') return verificarRangoSemestres(1, 4);
        if (reqs === 'ALL_1_8') return verificarRangoSemestres(1, 8);

        const listaReqs = reqs.split(',');
        return listaReqs.every(reqId => {
            const r = document.getElementById(reqId);
            return r && r.classList.contains('aprobado');
        });
    };

    const verificarRangoSemestres = (inicio, fin) => {
        for (let i = inicio; i <= fin; i++) {
            const sem = document.querySelector(`.semestre[data-sem="${i}"]`);
            const ramosSem = sem.querySelectorAll('.ramo');
            for (let r of ramosSem) {
                if (!r.classList.contains('aprobado')) return false;
            }
        }
        return true;
    };

    // 2. Actualizar visualmente qué ramos están bloqueados
    const actualizarEstadoVisual = () => {
        ramos.forEach(r => {
            if (!r.classList.contains('aprobado')) {
                if (!puedeAprobar(r)) {
                    r.classList.add('is-locked');
                } else {
                    r.classList.remove('is-locked');
                }
            } else {
                r.classList.remove('is-locked');
            }
        });
    };

    // 3. Manejo de Clicks
    ramos.forEach(ramo => {
        ramo.addEventListener('click', () => {
            if (ramo.classList.contains('aprobado')) {
                // Si ya está aprobado, quitar aprobación (permite corregir errores)
                ramo.classList.remove('aprobado');
            } else {
                // Intentar aprobar
                if (puedeAprobar(ramo)) {
                    ramo.classList.add('aprobado');
                } else {
                    alert("⚠️ No puedes aprobar este ramo aún. Debes completar primero sus requisitos.");
                }
            }
            guardarProgreso();
            actualizarEstadoVisual();
        });
    });

    // 4. Guardar/Cargar Progreso
    const guardarProgreso = () => {
        const aprobados = Array.from(document.querySelectorAll('.ramo.aprobado')).map(r => r.id);
        localStorage.setItem('malla_progreso_uv', JSON.stringify(aprobados));
    };

    const cargarProgreso = () => {
        const guardado = JSON.parse(localStorage.getItem('malla_progreso_uv')) || [];
        guardado.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.classList.add('aprobado');
        });
        actualizarEstadoVisual(); // Actualizar bloqueos al cargar
    };

    // 5. Botón Reset
    document.getElementById('reset-btn').addEventListener('click', () => {
        if (confirm("¿Estás seguro de que quieres borrar todo tu progreso?")) {
            localStorage.removeItem('malla_progreso_uv');
            location.reload();
        }
    });

    cargarProgreso();
});
