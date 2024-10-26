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
        alert('Please,.'); // Alerta se o campo estiver vazio
    }
}

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