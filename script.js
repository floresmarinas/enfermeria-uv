document.addEventListener('DOMContentLoaded', () => {
    const ramos = document.querySelectorAll('.ramo');
    const quoteElement = document.getElementById('quote');
    const resetBtn = document.getElementById('reset-btn');

    const frases = [
        "Un paso a la vez, serás una enfermera/o increíble.",
        "Tu esfuerzo de hoy es el alivio de alguien mañana.",
        "Estudiar anatomía es descubrir lo perfectos que somos.",
        "La paciencia y el amor son tus mejores instrumentos.",
        "¡Lo estás haciendo genial! Sigue adelante.",
        "Cada ramo aprobado es una vida que sabrás cuidar mejor."
    ];

    // Cambiar frase aleatoriamente
    quoteElement.innerText = `"${frases[Math.floor(Math.random() * frases.length)]}"`;

    // Cargar progreso guardado
    cargarProgreso();

    ramos.forEach(ramo => {
        ramo.addEventListener('click', () => {
            const id = ramo.id;
            
            if (ramo.classList.contains('aprobado')) {
                // Si ya está aprobado, lo desmarcamos
                ramo.classList.remove('aprobado');
                guardarProgreso();
            } else {
                // Intentar aprobar
                if (puedeAprobar(ramo)) {
                    ramo.classList.add('aprobado');
                    guardarProgreso();
                } else {
                    alert("¡Ups! Aún te faltan requisitos por cumplir para este ramo.");
                }
            }
        });
    });

    function puedeAprobar(ramo) {
        const reqStr = ramo.getAttribute('data-req');
        if (!reqStr) return true;

        // Lógica para requisitos especiales "TODOS LOS SEMESTRES ANTERIORES"
        if (reqStr === "ALL_1_4") return revisarRangoSemestres(1, 4);
        if (reqStr === "ALL_1_8") return revisarRangoSemestres(1, 8);

        // Lógica para requisitos normales (separados por coma)
        const requisitosIds = reqStr.split(',');
        return requisitosIds.every(reqId => {
            const reqRamo = document.getElementById(reqId);
            return reqRamo && reqRamo.classList.contains('aprobado');
        });
    }

    function revisarRangoSemestres(inicio, fin) {
        for (let i = inicio; i <= fin; i++) {
            const semestre = document.querySelector(`.semestre[data-sem="${i}"]`);
            const ramosSemestre = semestre.querySelectorAll('.ramo');
            for (let r of ramosSemestre) {
                if (!r.classList.contains('aprobado')) return false;
            }
        }
        return true;
    }

    function guardarProgreso() {
        const aprobados = [];
        document.querySelectorAll('.ramo.aprobado').forEach(r => {
            aprobados.push(r.id);
        });
        localStorage.setItem('malla_progreso', JSON.stringify(aprobados));
    }

    function cargarProgreso() {
        const guardado = localStorage.getItem('malla_progreso');
        if (guardado) {
            const aprobados = JSON.parse(guardado);
            aprobados.forEach(id => {
                const r = document.getElementById(id);
                if (r) r.classList.add('aprobado');
            });
        }
    }

    resetBtn.addEventListener('click', () => {
        if (confirm("¿Seguro que quieres borrar todo tu progreso?")) {
            localStorage.removeItem('malla_progreso');
            location.reload();
        }
    });
});
