let inputPasswordRef = document.querySelector('#inputPassword');
let inputEmailRef = document.querySelector('#inputEmail');
let botaoLoginRef = document.querySelector('#botaoLogin');

let usuarios = JSON.parse(localStorage.getItem('usuarios'));

let usuarioLogado = null; // variavel que armazena o usuario logado inicialmente como null

let logado = JSON.parse(localStorage.getItem('logado')); 
// pega o item "logado" armazenado no localStorage e converte para um array e armazena na variavel logado

if (logado !== null) { // se a variavel logado não for null (exite um usuario logado)  então...
    usuarioLogado = logado[0]; // armazena o nome do usuario logado na variavel usuarioLogado
    window.location.href = 'tarefas.html';    
}

botaoLoginRef.addEventListener('click', (e) => {

    e.preventDefault();
    let email = inputEmailRef.value;
    let senha = inputPasswordRef.value;

    if (usuarios === null) {
        return alert('Não cadastrado');
    } else {
        for (let usuario of usuarios) {
            if (usuario.email === email && usuario.senha === senha) {
                usuarioLogado = usuario.nome;
                let logado = JSON.parse(localStorage.getItem('logado'));

                if (logado === null) { // se não existir o item logado
                    logado = [];
                    logado.push(usuarioLogado);
                    localStorage.setItem('logado', JSON.stringify(logado))
                    return window.location.href = 'tarefas.html';
                } else {
                    return window.location.href = 'tarefas.html';
                }
            }
        }
        return alert('E-mail ou senha incorretos');
    }
}
)

