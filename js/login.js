let inputPasswordRef = document.querySelector('#inputPassword');
let inputEmailRef = document.querySelector('#inputEmail');
let botaoLoginRef = document.querySelector('#botaoLogin');

let logado = localStorage.getItem('token');

if (logado) {
    window.location.href = 'tarefas.html';
}

botaoLoginRef.addEventListener('click', (e) => {

    e.preventDefault();
    let email = inputEmailRef.value;
    let senha = inputPasswordRef.value;

    let usuarios = {
        email: email,
        password: senha
    }

    const resquestOptions = {
        method: 'POST',
        body: JSON.stringify(usuarios),
        headers: { 'Content-Type': 'application/json' }
    }

    fetch('https://ctd-todo-api.herokuapp.com/v1/users/login', resquestOptions)
        .then(response => response.json())
        .then(data => {
            localStorage.setItem('token', data.jwt);
            window.location.href = './tarefas.html';
        })
})