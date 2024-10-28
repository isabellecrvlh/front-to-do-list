// Configuração do botão Sign Out
document.getElementById('logout').addEventListener('click', () => {
    localStorage.removeItem('users'); // Remove os dados do usuário do localStorage
    window.location.href = 'index.html'; // Redireciona para a página de login (index.html)
});

document.getElementById('add-task-btn').addEventListener('click', addTask);
document.getElementById('task-input').addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        addTask();
    }
});

function updateCalendar() {
    const now = new Date();
    const options = { weekday: 'short' }; // Formato para dia da semana
    const dayOfWeek = now.toLocaleDateString('pt-BR', options).toUpperCase(); // Dia da semana
    const date = now.toLocaleDateString('pt-BR'); // Data
    const time = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }); // Hora

    document.getElementById('dayOfWeek').innerText = dayOfWeek;
    document.getElementById('date').innerText = date;
    document.getElementById('time').innerText = time;
}

// Atualiza o calendário ao carregar a página
window.onload = updateCalendar;

// Atualiza a cada minuto
setInterval(updateCalendar, 60000);

function addTask() {
    const taskInput = document.getElementById('task-input');
    const taskText = taskInput.value.trim(); // Remove espaços em branco

    if (taskText) {
        const taskList = document.getElementById('task-list');
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <span class="task-text">${taskText}</span>
            <button class="edit-btn">Edit Task</button>
            <button class="delete-btn">🗑️</button>
            <button class="complete-btn">✔️</button>
        `;
        taskList.appendChild(listItem);
        taskInput.value = ''; // Limpa o campo de entrada

        // Adiciona os eventos aos novos botões
        listItem.querySelector('.edit-btn').addEventListener('click', () => openEditPopup(listItem));
        listItem.querySelector('.delete-btn').addEventListener('click', () => deleteTask(listItem));
        listItem.querySelector('.complete-btn').addEventListener('click', () => completeTask(listItem));
    } else {
        alert('Please enter a task.'); // Alerta se o campo estiver vazio
    }
}

function deleteTask(listItem) {
    listItem.remove();
}

function completeTask(listItem) {
    const doingList = document.getElementById('in-progress').querySelector('.task-container');
    const doneList = document.getElementById('done').querySelector('.task-container');

    // Move a tarefa para a lista "Doing" ou "Done"
    if (doingList.contains(listItem)) {
        doneList.appendChild(listItem);
        listItem.querySelector('.complete-btn').remove(); // Remove o botão de concluir ao mover para Done
        listItem.querySelector('.delete-btn').remove(); // Remove o botão de lixeira ao mover para Done
    } else {
        doingList.appendChild(listItem);
    }

    // Garante que o botão "Edit Task" permaneça na lista "Doing"
    if (doingList.contains(listItem)) {
        listItem.querySelector('.edit-btn').style.display = 'inline'; // Mostra o botão "Edit Task"
    }

    // Remove o botão "Edit Task" ao mover para Done
    if (doneList.contains(listItem)) {
        listItem.querySelector('.edit-btn').remove();
    }
}

function openEditPopup(listItem) {
    const taskTextElement = listItem.querySelector('.task-text');
    const currentText = taskTextElement.innerText;

    // Cria um popup simples
    const popup = document.createElement('div');
    popup.classList.add('popup'); // Adiciona classe para estilização
    popup.innerHTML = `
        <div class="popup-content">
            <h3>Edit Task</h3>
            <input type="text" id="edit-task-input" value="${currentText}" />
            <button id="save-btn">Save</button>
            <button id="cancel-btn">Cancel</button>
        </div>
    `;
    document.body.appendChild(popup);

    // Salvar edição
    document.getElementById('save-btn').addEventListener('click', () => {
        const newText = document.getElementById('edit-task-input').value.trim();
        if (newText) {
            taskTextElement.innerText = newText;
            document.body.removeChild(popup); // Remove o popup
        } else {
            alert('Task text cannot be empty!'); // Alerta se o campo estiver vazio
        }
    });

    // Cancelar edição
    document.getElementById('cancel-btn').addEventListener('click', () => {
        document.body.removeChild(popup); // Remove o popup sem salvar
    });
}
