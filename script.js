// Espera a que todo el contenido del DOM (la página) esté cargado antes de ejecutar el script.
document.addEventListener('DOMContentLoaded', () => {

    // Selecciona todas las asignaturas del DOM.
    const asignaturas = document.querySelectorAll('.asignatura');
    
    // Define la clave que se usará para guardar los datos en el localStorage del navegador.
    const localStorageKey = 'asignaturasAprobadas';

    /**
     * Carga el estado de las asignaturas aprobadas desde el localStorage.
     * Recupera la lista de IDs de asignaturas aprobadas y aplica el estado 'aprobada'
     * a los elementos correspondientes en la página.
     */
    function cargarEstado() {
        // Obtiene la lista de aprobadas (como string) y la convierte a un array.
        // Si no hay nada guardado, inicia con un array vacío.
        const aprobadas = JSON.parse(localStorage.getItem(localStorageKey)) || [];
        
        // Itera sobre cada asignatura en la página.
        asignaturas.forEach(asignatura => {
            // Si el ID de la asignatura actual está en la lista de aprobadas...
            if (aprobadas.includes(asignatura.id)) {
                // ...le añade la clase 'aprobada' para cambiar su estilo.
                asignatura.classList.add('aprobada');
            }
        });
    }

    /**
     * Guarda el estado actual de las asignaturas aprobadas en el localStorage.
     * Crea una lista con los IDs de todas las asignaturas que tienen la clase 'aprobada'
     * y la guarda como un string JSON.
     */
    function guardarEstado() {
        const aprobadas = [];
        // Itera sobre cada asignatura.
        asignaturas.forEach(asignatura => {
            // Si la asignatura tiene la clase 'aprobada'...
            if (asignatura.classList.contains('aprobada')) {
                // ...añade su ID a la lista de aprobadas.
                aprobadas.push(asignatura.id);
            }
        });
        // Guarda la lista (convertida a string) en el localStorage.
        localStorage.setItem(localStorageKey, JSON.stringify(aprobadas));
    }

    /**
     * Maneja el evento de clic en una asignatura.
     * @param {Event} e - El objeto del evento de clic.
     */
    function manejarClickAsignatura(e) {
        const asignaturaClickeada = e.target;
        const idAsignatura = asignaturaClickeada.id;

        // Obtiene el ID del requisito del atributo 'data-requisito'.
        const requisitoId = asignaturaClickeada.dataset.requisito;
        
        // Si la asignatura ya está aprobada, la des-aprueba.
        if (asignaturaClickeada.classList.contains('aprobada')) {
            asignaturaClickeada.classList.remove('aprobada');
        } else {
            // Si no está aprobada, verifica los requisitos.
            if (requisitoId) {
                const asignaturaRequisito = document.getElementById(requisitoId);
                // Si el requisito NO está aprobado...
                if (!asignaturaRequisito.classList.contains('aprobada')) {
                    // Muestra una alerta al usuario y detiene la función.
                    const nombreRequisito = asignaturaClickeada.dataset.nombreRequisito;
                    alert(`🚨 ¡Requisito pendiente! Debes aprobar "${nombreRequisito}" para poder marcar esta asignatura.`);
                    return; // Detiene la ejecución para no marcarla como aprobada.
                }
            }
            // Si no tiene requisitos o si ya los cumplió, la marca como aprobada.
            asignaturaClickeada.classList.add('aprobada');
        }

        // Después de cualquier cambio, guarda el nuevo estado.
        guardarEstado();
    }

    // --- Inicialización ---

    // Añade un 'escuchador' de eventos de clic a cada asignatura.
    asignaturas.forEach(asignatura => {
        asignatura.addEventListener('click', manejarClickAsignatura);
    });

    // Carga el estado de las asignaturas tan pronto como la página está lista.
    cargarEstado();

});

