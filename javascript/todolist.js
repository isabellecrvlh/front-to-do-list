// Verifica se o DOM está carregado antes de adicionar os eventos
document.addEventListener("DOMContentLoaded", function () {
    // Configuração do botão Logout
    const logoutButton = document.getElementById('logout');
    if (logoutButton) {
        logoutButton.addEventListener('click', function () {
            window.location.href = 'index.html'; // Redireciona para a página de login
        });
    }

    // Configuração do botão de adicionar tarefas
    const addButton = document.getElementById('add-task-btn');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');

    if (addButton && taskInput) {
        addButton.addEventListener('click', addTask);
        taskInput.addEventListener('keypress', function (event) {
            if (event.key === 'Enter') {
                addTask();
            }
        });
    }

    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText) {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <span class="task-text">${taskText}</span>
                <button class="edit-btn">Edit Task</button>
                <button class="delete-btn">🗑️</button>
                <button class="complete-btn">✔️</button>
            `;
            taskList.appendChild(listItem);
            taskInput.value = '';

            listItem.querySelector('.edit-btn').addEventListener('click', () => openEditPopup(listItem));
            listItem.querySelector('.delete-btn').addEventListener('click', () => deleteTask(listItem));
            listItem.querySelector('.complete-btn').addEventListener('click', () => completeTask(listItem));
        } else {
            alert('Please enter a task.');
        }
    }

    function deleteTask(listItem) {
        listItem.remove();
    }

    function completeTask(listItem) {
        const doingList = document.getElementById('in-progress').querySelector('.task-container');
        const doneList = document.getElementById('done').querySelector('.task-container');

        if (doingList.contains(listItem)) {
            doneList.appendChild(listItem);
            listItem.querySelector('.complete-btn').remove();
            listItem.querySelector('.delete-btn').remove();
        } else {
            doingList.appendChild(listItem);
        }

        if (doingList.contains(listItem)) {
            listItem.querySelector('.edit-btn').style.display = 'inline';
        }

        if (doneList.contains(listItem)) {
            listItem.querySelector('.edit-btn').remove();
        }
    }

    function openEditPopup(listItem) {
        const taskTextElement = listItem.querySelector('.task-text');
        const currentText = taskTextElement.innerText;

        const popup = document.createElement('div');
        popup.classList.add('popup');
        popup.innerHTML = `
            <div class="popup-content">
                <h3>Edit Task</h3>
                <input type="text" id="edit-task-input" value="${currentText}" />
                <button id="save-btn">Save</button>
                <button id="cancel-btn">Cancel</button>
            </div>
        `;
        document.body.appendChild(popup);

        document.getElementById('save-btn').addEventListener('click', () => {
            const newText = document.getElementById('edit-task-input').value.trim();
            if (newText) {
                taskTextElement.innerText = newText;
                document.body.removeChild(popup);
            } else {
                alert('Task text cannot be empty!');
            }
        });

        document.getElementById('cancel-btn').addEventListener('click', () => {
            document.body.removeChild(popup);
        });
    }
});
