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
      const tasks = await response.json(); // Converte a resposta em JSON
      tasks.forEach((task) => {
        const taskElement = createTaskElement(task);
        appendTaskToColumn(taskElement, task.status);
      });
    } catch (error) {
      console.error("Erro ao carregar tarefas:", error);
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
        <button class="complete-btn">✅</button>
      `;

    listItem
      .querySelector(".edit-btn")
      .addEventListener("click", () => openEditPopup(listItem, task));
    listItem
      .querySelector(".delete-btn")
      .addEventListener("click", () => deleteTask(listItem, task.id));
    listItem
      .querySelector(".complete-btn")
      .addEventListener("click", () => completeTask(listItem, task));
    return listItem;
  }

  // Função para adicionar uma tarefa na coluna correta
  function appendTaskToColumn(taskElement, status) {
    if (status === "TODO") {
      document.getElementById("task-list").appendChild(taskElement);
    } else if (status === "DOING") {
      document
        .getElementById("in-progress")
        .querySelector(".task-container")
        .appendChild(taskElement);
    } else if (status === "DONE") {
      document
        .getElementById("done")
        .querySelector(".task-container")
        .appendChild(taskElement);
      taskElement.querySelector(".complete-btn").remove(); // Remove botão de completar
      taskElement.querySelector(".edit-btn").remove(); // Remove botão de edição
    }
  }

  // Função para montar o objeto tarefa
  function getTaskFromInput() {
    const title = document.getElementById("task-title-input").value;
    const description = document.getElementById("task-desc-input").value;
    return {
      title: title,
      description: description,
      status: "TODO", // Status padrão
      user: {
        id: userId,
      },
    };
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
      appendTaskToColumn(taskElement, createdTask.status);
    } catch (error) {
      console.error(error);
    }
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
  function openEditPopup(listItem, task) {
    const taskTitleElement = listItem.querySelector(".task-title");
    const taskDescElement = listItem.querySelector(".task-desc");
    const currentTitle = task.title;
    const currentDesc = task.description;

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
          const updatedTask = {
            ...task,
            title: newTitle,
            description: newDesc,
          };
          await fetch(`http://localhost:8097/tasks/${task.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedTask),
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
  async function completeTask(listItem, task) {
    let newStatus;
    if (task.status === "TODO") {
      newStatus = "DOING";
      document
        .getElementById("in-progress")
        .querySelector(".task-container")
        .appendChild(listItem);
    } else if (task.status === "DOING") {
      newStatus = "DONE";
      document
        .getElementById("done")
        .querySelector(".task-container")
        .appendChild(listItem);
      listItem.querySelector(".complete-btn").remove();
      listItem.querySelector(".edit-btn").remove();
    }

    try {
      await fetch(`http://localhost:8097/tasks/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...task, status: newStatus }),
      });
      task.status = newStatus;
    } catch (error) {
      console.error("Erro ao mover tarefa:", error);
    }
  }
});

// feito por André, Isabelle e Marcelo
