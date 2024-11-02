// Verifica se o DOM está carregado antes de adicionar os eventos
document.addEventListener("DOMContentLoaded", function () {
  const userId = localStorage.getItem("userId"); // Obtém o ID do usuário armazenado no localStorage

  if (!userId) {
    console.error("Erro: ID do usuário não encontrado no localStorage.");
    return; // Impede a execução se não houver ID do usuário
  }

  // Carregar tarefas existentes do banco de dados
  async function loadTasks() {
    try {
      const response = await fetch(
        `http://localhost:8097/tasks/user/${userId}`
      );
      const tasks = await response.json(); // Corrigido para converter a resposta em JSON
      tasks.forEach((task) => {
        const taskElement = createTaskElement(task);
        if (task.status === "TODO") {
          document.getElementById("task-list").appendChild(taskElement);
        } else if (task.status === "DOING") {
          document
            .getElementById("in-progress")
            .querySelector(".task-container")
            .appendChild(taskElement);
        } else if (task.status === "DONE") {
          document
            .getElementById("done")
            .querySelector(".task-container")
            .appendChild(taskElement);
        }
      });
    } catch (error) {
      console.error("Erro ao carregar tarefas:", error);
    }
  }

  // Função para montar o objeto tarefa
  function getTaskFromInput() {
    const title = document.getElementById("task-title-input").value;
    const description = document.getElementById("task-desc-input").value;
    const task = {
      title: title,
      description: description,
      status: "TODO", // Status padrão
      user: {
        id: userId,
      },
    };
    return task;
  }

  // Função para criar a tarefa na API
  async function createTask(task) {
    try {
      const response = await fetch("http://localhost:8097/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(task), // Envia o objeto task como JSON
      });

      if (!response.ok) {
        throw new Error("Erro ao criar a tarefa");
      }
      const createdTask = await response.json();
      const taskElement = createTaskElement(createdTask);
      document.getElementById("task-list").appendChild(taskElement);
    } catch (error) {
      console.error(error);
    }
  }

  // Função para criar o elemento visual da tarefa
  function createTaskElement(task) {
    const listItem = document.createElement("li");
    listItem.innerHTML = `
        <span class="task-title"><strong>${task.title}</strong></span>
        <span class="task-desc">${task.description}</span>
        <button class="edit-btn">Edit Task</button>
        <button class="delete-btn">🗑️</button>
        <button class="complete-btn">✔️</button>
      `;

    listItem
      .querySelector(".edit-btn")
      .addEventListener("click", () => openEditPopup(listItem, task.id));
    listItem
      .querySelector(".delete-btn")
      .addEventListener("click", () => deleteTask(listItem, task.id));
    listItem
      .querySelector(".complete-btn")
      .addEventListener("click", () =>
        completeTask(listItem, task.id, task.status)
      );
    return listItem;
  }

  // Adiciona o evento de clique ao botão para criar a tarefa
  document.getElementById("add-task-btn").addEventListener("click", () => {
    const task = getTaskFromInput();
    createTask(task);
  });

  // Carrega as tarefas do banco de dados ao iniciar a aplicação
  loadTasks();

  // Configuração do botão Logout
  const logoutButton = document.getElementById("logout");
  if (logoutButton) {
    logoutButton.addEventListener("click", function () {
      window.location.href = "index.html"; // Redireciona para a página de login
    });
  }

  // Editar tarefa
  function openEditPopup(listItem, taskId) {
    const taskTitleElement = listItem.querySelector(".task-title");
    const taskDescElement = listItem.querySelector(".task-desc");
    const currentTitle = taskTitleElement.innerText;
    const currentDesc = taskDescElement.innerText;

    const popup = document.createElement("div");
    popup.classList.add("popup");
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

    document.getElementById("save-btn").addEventListener("click", async () => {
      const newTitle = document.getElementById("edit-task-title").value.trim();
      const newDesc = document.getElementById("edit-task-desc").value.trim();

      if (newTitle && newDesc) {
        try {
          await fetch(`http://localhost:8097/tasks/${taskId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: newTitle, description: newDesc }),
          });
          taskTitleElement.innerText = newTitle;
          taskDescElement.innerText = newDesc;
          document.body.removeChild(popup);
        } catch (error) {
          console.error("Erro ao editar tarefa:", error);
        }
      } else {
        alert("Task title and description cannot be empty!");
      }
    });

    document.getElementById("cancel-btn").addEventListener("click", () => {
      document.body.removeChild(popup);
    });
  }

  // Excluir tarefa
  async function deleteTask(listItem, taskId) {
    try {
      await fetch(`http://localhost:8097/tasks/${taskId}`, {
        method: "DELETE",
      });
      listItem.remove();
    } catch (error) {
      console.error("Erro ao excluir tarefa:", error);
    }
  }

  // Completar tarefa e mover para a coluna seguinte
  async function completeTask(listItem, taskId, currentStatus) {
    let newStatus;
    const doingList = document
      .getElementById("in-progress")
      .querySelector(".task-container");
    const doneList = document
      .getElementById("done")
      .querySelector(".task-container");

    if (currentStatus === "TODO") {
      newStatus = "DOING";
      doingList.appendChild(listItem);
    } else if (currentStatus === "DOING") {
      newStatus = "DONE";
      doneList.appendChild(listItem);
      listItem.querySelector(".complete-btn").remove();
      listItem.querySelector(".edit-btn").remove(); // Remover botão de edição
      listItem.querySelector(".delete-btn").remove();
    }

    try {
      await fetch(`http://localhost:8097/tasks/${taskId}`, {
        // Corrigido URL
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (error) {
      console.error("Erro ao mover tarefa:", error);
    }
  }
});
