// todolist.js
document.getElementById('add-task-btn').addEventListener('click', addTask);
document.getElementById('task-input').addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        addTask();
    }
});

function addTask() {
    const taskInput = document.getElementById('task-input');
    const taskText = taskInput.value;

    if (taskText) {
        const taskList = document.getElementById('task-list');
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <span class="task-text">${taskText}</span>
            <button class="edit-btn">Editar</button>
            <button class="delete-btn">🗑️</button>
            <button class="complete-btn">✅</button>
        `;
        taskList.appendChild(listItem);
        taskInput.value = ''; // Limpa o campo de entrada

        // Adiciona os eventos aos novos botões
        listItem.querySelector('.edit-btn').addEventListener('click', () => openEditPopup(listItem));
        listItem.querySelector('.delete-btn').addEventListener('click', () => deleteTask(listItem));
        listItem.querySelector('.complete-btn').addEventListener('click', () => completeTask(listItem));
    } else {
        alert('Por favor, digite uma tarefa.'); // Alerta se o campo estiver vazio
    }
}

function openEditPopup(listItem) {
    const taskTextElement = listItem.querySelector('.task-text');
    const editPopup = document.getElementById('editPopup');
    const editTextArea = document.getElementById('editText');

    // Define o texto da tarefa no textarea
    editTextArea.value = taskTextElement.innerHTML;
    
    editPopup.style.display = 'block';

    // Salvar a edição
    document.getElementById('saveEdit').onclick = function () {
        const editedText = editTextArea.value;
        taskTextElement.innerHTML = editedText;
        editPopup.style.display = 'none';
    };
}

// Fecha o popup ao clicar no 'X'
document.getElementById('closePopup').onclick = function () {
    document.getElementById('editPopup').style.display = 'none';
};

function deleteTask(listItem) {
    listItem.remove();
}

function completeTask(listItem) {
    const doneList = document.getElementById('done').querySelector('.task-container');
    doneList.appendChild(listItem);
    listItem.querySelector('.edit-btn').remove();
    listItem.querySelector('.delete-btn').remove();
    listItem.querySelector('.complete-btn').remove();
}

let quill;

function openEditPopup(listItem) {
    const taskTextElement = listItem.querySelector('.task-text');
    const editPopup = document.getElementById('editPopup');
    
    // Inicializa o Quill
    if (!quill) {
        quill = new Quill('#editor-container', {
            theme: 'snow',
            modules: {
                toolbar: [
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ 'list': 'ordered'}, { 'list': 'bullet' }]
                ]
            }
        });
    }

    // Define o texto da tarefa no editor
    const delta = quill.clipboard.convert(taskTextElement.innerHTML);
    quill.setContents(delta);
    
    editPopup.style.display = 'block';

    // Salvar a edição
    document.getElementById('saveEdit').onclick = function () {
        const editedText = quill.root.innerHTML; // Pega o HTML formatado
        taskTextElement.innerHTML = editedText;
        editPopup.style.display = 'none';
    };
    // comentario
}

