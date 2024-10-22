// script.js

// Função para permitir arrastar e soltar as tarefas
const tasks = document.querySelectorAll('.task');
const taskContainers = document.querySelectorAll('.task-container');

taskContainers.forEach(container => {
    container.addEventListener('dragover', dragOver);
    container.addEventListener('drop', drop);
});

function dragOver(e) {
    e.preventDefault();
}

function drop(e) {
    e.preventDefault();
    const draggingTask = document.querySelector('.dragging');
    this.appendChild(draggingTask);
}

// Função para adicionar eventos de arrastar
function enableDragAndDrop() {
    const taskItems = document.querySelectorAll('.task');

    taskItems.forEach(task => {
        task.addEventListener('dragstart', dragStart);
        task.addEventListener('dragend', dragEnd);
    });
}

function dragStart() {
    this.classList.add('dragging');
}

function dragEnd() {
    this.classList.remove('dragging');
}

// Inicializa a edição das tarefas
function editTask(taskItem) {
    const newTaskText = prompt("Edite sua tarefa:", taskItem.textContent);
    if (newTaskText !== null) {
        taskItem.textContent = newTaskText;
    }
}

// Adiciona as tarefas à lista e habilita arrastar e soltar
document.getElementById('add-task-btn').addEventListener('click', function() {
    const taskInput = document.getElementById('task-input');
    const taskText = taskInput.value;

    if (taskText) {
        const taskList = document.getElementById('task-list');
        const listItem = document.createElement('li');
        listItem.textContent = taskText;
        listItem.classList.add('task'); // Adiciona a classe 'task'
        listItem.setAttribute('draggable', true); // Permite arrastar

        // Permite editar a tarefa ao clicar
        listItem.addEventListener('click', function() {
            editTask(listItem);
        });

        taskList.appendChild(listItem);
        taskInput.value = ''; // Limpa o campo de entrada

        enableDragAndDrop(); // Habilita o arrastar e soltar para novas tarefas
    } else {
        alert('Por favor, digite uma tarefa.'); // Alerta se o campo estiver vazio
    }
});
