const userAPI = "http://localhost:8097/users";

// register.js
document
  .getElementById("registerForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const newEmail = document.getElementById("newEmail").value;
    const newPassword = document.getElementById("newPassword").value;

    // Verifica se o e-mail já está cadastrado
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const existingUser = users.find((user) => user.email === newEmail);

    if (existingUser) {
      const registerMessage = document.getElementById("registerMessage");
      registerMessage.textContent = "E-mail já cadastrado.";
      registerMessage.style.display = "block";
      return; // Interrompe o processo se o e-mail já existe
    }

    // Adiciona o novo usuário ao array
    users.push({ email: newEmail, password: newPassword });
    localStorage.setItem("users", JSON.stringify(users)); // Armazena no localStorage

    alert("Cadastro realizado com sucesso!");
    window.location.href = "index.html"; // Redireciona para a página de login
    // teste commit
  });
