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
    const taskTitleInput = document.getElementById('task-title-input');
    const taskDescInput = document.getElementById('task-desc-input');
    const taskList = document.getElementById('task-list');

    if (addButton && taskTitleInput && taskDescInput) {
        addButton.addEventListener('click', addTask);
        taskTitleInput.addEventListener('keypress', function (event) {
            if (event.key === 'Enter') {
                addTask();
            }
        });
        taskDescInput.addEventListener('keypress', function (event) {
            if (event.key === 'Enter') {
                addTask();
            }
        });
    }

    function addTask() {
        const taskTitle = taskTitleInput.value.trim();
        const taskDesc = taskDescInput.value.trim();
        
        if (taskTitle && taskDesc) {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <span class="task-title"><strong>${taskTitle}</strong></span>
                <span class="task-desc">${taskDesc}</span>
                <button class="edit-btn">Edit Task</button>
                <button class="delete-btn">🗑️</button>
                <button class="complete-btn">✔️</button>
            `;
            taskList.appendChild(listItem);
            taskTitleInput.value = '';
            taskDescInput.value = '';

            listItem.querySelector('.edit-btn').addEventListener('click', () => openEditPopup(listItem));
            listItem.querySelector('.delete-btn').addEventListener('click', () => deleteTask(listItem));
            listItem.querySelector('.complete-btn').addEventListener('click', () => completeTask(listItem));
        } else {
            alert('Please enter both title and description for the task.');
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
        const taskTitleElement = listItem.querySelector('.task-title');
        const taskDescElement = listItem.querySelector('.task-desc');
        const currentTitle = taskTitleElement.innerText;
        const currentDesc = taskDescElement.innerText;

        const popup = document.createElement('div');
        popup.classList.add('popup');
        popup.innerHTML = `
            <div class="popup-content">
                <h3>Edit Task</h3>
                <input type="text" id="edit-task-title" value="${currentTitle}" />
                <input type="text" id="edit-task-desc" value="${currentDesc}" />
                <button id="save-btn">Save</button>
                <button id="cancel-btn">Cancel</button>
            </div>
        `;
        document.body.appendChild(popup);

        document.getElementById('save-btn').addEventListener('click', () => {
            const newTitle = document.getElementById('edit-task-title').value.trim();
            const newDesc = document.getElementById('edit-task-desc').value.trim();
            
            if (newTitle && newDesc) {
                taskTitleElement.innerText = newTitle;
                taskDescElement.innerText = newDesc;
                document.body.removeChild(popup);
            } else {
                alert('Task title and description cannot be empty!');
            }
        });

        document.getElementById('cancel-btn').addEventListener('click', () => {
            document.body.removeChild(popup);
        });
    }
});
