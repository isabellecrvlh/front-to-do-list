// login.js
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Obtém os usuários do localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Verifica se o usuário existe no "banco de dados"
    const user = users.find(user => user.email === email && user.password === password);

    if (user) {
        window.location.href = "todolist.html"; // Redireciona para a página de tarefas
    } else {
        const errorMessage = document.getElementById('errorMessage');
        errorMessage.textContent = "Incorrect e-mail or password!";
        errorMessage.style.display = "block";
    }
});
