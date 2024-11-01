// register.js
const userAPI = "http://localhost:8097/users"; // URL da API

document
  .getElementById("registerForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    // Obtenha os valores dos campos dentro do evento submit
    const newName = document.getElementById("newName").value;
    const newEmail = document.getElementById("newEmail").value;
    const newPassword = document.getElementById("newPassword").value;

    // Verifica se o e-mail já está cadastrado
    try {
      const response = await fetch(userAPI, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const users = await response.json(); // Obter a lista de usuários do banco de dados

        const existingUser = users.find((user) => user.email === newEmail);

        if (existingUser) {
          const registerMessage = document.getElementById("registerMessage");
          registerMessage.textContent = "E-mail já cadastrado.";
          registerMessage.style.display = "block";
          return; // Interrompe o processo se o e-mail já existe
        }

        // Adiciona o novo usuário pela API
        const user = { name: newName, email: newEmail, password: newPassword };

        const registerResponse = await fetch(userAPI, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        });

        if (registerResponse.ok) {
          alert("Cadastro realizado com sucesso!");
          window.location.href = "index.html"; // Redireciona para a página de login
        } else {
          const errorMessage = document.getElementById("registerMessage");
          errorMessage.textContent = "Erro ao registrar usuário.";
          errorMessage.style.display = "block";
        }
      } else {
        const errorMessage = document.getElementById("registerMessage");
        errorMessage.textContent = "Erro ao buscar usuários do servidor.";
        errorMessage.style.display = "block";
      }
    } catch (error) {
      console.error("Erro no registro:", error);
      const errorMessage = document.getElementById("registerMessage");
      errorMessage.textContent =
        "Ocorreu um erro. Por favor, tente novamente mais tarde.";
      errorMessage.style.display = "block";
    }
  });
