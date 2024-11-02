// login.js
document
  .getElementById("loginForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Conexão com a API na rota
    try {
      const response = await fetch("http://localhost:8097/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const users = await response.json(); // Obter a lista de usuários do banco de dados

        // Verifica se o usuário existe no "banco de dados"
        const user = users.find(
          (user) => user.email === email && user.password === password
        );

        if (user) {
          // Autenticação bem-sucedida
          localStorage.setItem("userId", user.id); // Armazena o ID do usuário no localStorage
          window.location.href = "todolist.html"; // Redireciona para a página de tarefas
        } else {
          // E-mail ou senha incorretos
          const errorMessage = document.getElementById("errorMessage");
          errorMessage.textContent = "E-mail ou senha incorretos!";
          errorMessage.style.display = "block";
        }
      } else {
        const errorMessage = document.getElementById("errorMessage");
        errorMessage.textContent = "Erro ao buscar usuários do servidor.";
        errorMessage.style.display = "block";
      }
    } catch (error) {
      console.error("Erro na autenticação:", error);
      const errorMessage = document.getElementById("errorMessage");
      errorMessage.textContent =
        "Ocorreu um erro. Por favor, tente novamente mais tarde.";
      errorMessage.style.display = "block";
    }
  });
