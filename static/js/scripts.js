document.addEventListener('DOMContentLoaded', function() {
    const input = document.getElementById('input');
    const addButton = document.getElementById('boton-emter');
    const lista = document.getElementById('lista');
    const eliminarTodasBtn = document.getElementById('eliminar-todas');
    const taskSection = document.querySelector('.task-section');
    const contadorTareasPendientes = document.getElementById('contador-tareas-pendientes');
   
    const dateElement = document.getElementById('date');
    const currentDate = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = currentDate.toLocaleDateString('es-ES', options);
    dateElement.textContent = formattedDate;

    addButton.addEventListener('click', function() {
        agregarTareaDesdeInput();
    });
    input.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            agregarTareaDesdeInput();
        }
    });
    function agregarTarea(tarea) {
        const tareas = lista.querySelectorAll('.text');
        for (const tareaExistente of tareas) {
            if (tareaExistente.textContent.trim() === tarea) {
                alert('¡La tarea ya existe!');
                return; 
            }
        }
        const li = document.createElement('li');
        const imgCheck = document.createElement('img');
        imgCheck.src = "../static/img/unchecked.png";
        imgCheck.classList.add('iconoLine');
        imgCheck.setAttribute('data-action', 'check');

        const imgModify = document.createElement('img');
        imgModify.src = "../static/img/modificar.png"; 
        imgModify.classList.add('iconoModify');
        imgModify.setAttribute('data-action', 'modify');

        li.innerHTML = `
            <img src="../static/img/unchecked.png" class="iconoLine" data-action="check">
            <p class="text" contenteditable="true">${tarea}</p>
            <div class="botones">
                <img src="../static/img/modificar.png" class="iconoModify" data-action="modify">
                <img src="../static/img/eliminar.png" class="iconoClear" data-action="clear">
            </div>
        `;
        lista.appendChild(li);
        actualizarContadorTareasPendientes();
    }

    lista.addEventListener('click', function(event) {
        const target = event.target;
        if (target.tagName === 'IMG') {
            const action = target.getAttribute('data-action');
            const li = target.closest('li');
            if (action === 'check') {
                const p = li.querySelector('p');
                p.classList.toggle('line-through');
                
                const imgCheck = li.querySelector('.iconoLine');
                if (p.classList.contains('line-through')) {
                    imgCheck.src = "../static/img/checked.png";
                } else {
                    imgCheck.src = "../static/img/unchecked.png";
                }
                actualizarContadorTareasPendientes();
            } else if (action === 'clear') {
                li.remove();
                mostrarTaskSection(); 
                actualizarContadorTareasPendientes();
            } else if (action === 'modify') {
                const p = li.querySelector('p');
                p.contentEditable = true; 
                p.focus(); 
                colocarCursorAlFinal(p); 
                p.addEventListener('keypress', function(event) {
                    if (event.key === 'Enter') {
                        const nuevaTarea = p.textContent.trim();
                        if (nuevaTarea !== '') {
                            p.contentEditable = false; 
                            actualizarContadorTareasPendientes(); 
                        }
                    }
                });
            }
        }
    });

    eliminarTodasBtn.addEventListener('click', function() {
        lista.innerHTML = ''; 
        ocultarTaskSection(); 
    });

    function mostrarTaskSection() {
        if (lista.children.length > 0) {
            taskSection.style.display = 'block'; 
        }
    }

    function ocultarTaskSection() {
        if (lista.children.length === 0) {
            taskSection.style.display = 'none'; 
        }
    }

    function colocarCursorAlFinal(elemento) {
        if (typeof window.getSelection != "undefined" && typeof document.createRange != "undefined") {
            elemento.focus();
            const range = document.createRange();
            range.selectNodeContents(elemento);
            range.collapse(false); 
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        }
    }
    function actualizarContadorTareasPendientes() {
        const tareasPendientes = lista.querySelectorAll('p:not(.line-through)').length;
        contadorTareasPendientes.textContent = tareasPendientes;
        if (tareasPendientes === 0) {
            ocultarTaskSection();
        }
    }
    function agregarTareaDesdeInput() {
        const tarea = input.value.trim();
        if (tarea !== '') {
            agregarTarea(tarea);
            input.value = '';
            actualizarContadorTareasPendientes();
            mostrarTaskSection();
        }
    }
});

