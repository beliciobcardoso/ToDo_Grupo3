"use strict";
let inputNomeRef = document.querySelector('#inputNome');
let inputEmailRef = document.querySelector('#inputEmail');
let inputSenhaRef = document.querySelector('#inputSenha');
let botaoSignupRef = document.querySelector('#botaoSignup');
let inputApelidoRef = document.querySelector('#inputApelido');
let inputConfirmaSenhaRef = document.querySelector('#inputConfirmaSenha');

let logado = JSON.parse(localStorage.getItem('logado')); 
// pega o item "logado" armazenado no localStorage e converte para um array e armazena na variavel logado

if (logado !== null) { // se a variavel logado não for null (exite um usuario logado)  então...
    usuarioLogado = logado[0]; // armazena o nome do usuario logado na variavel usuarioLogado
    window.location.href = 'tarefas.html'; // redireciona para a pagina de tarefas
}

botaoSignupRef.addEventListener('click', (e) => {
    e.preventDefault(); // não deixa o link abrir uma nova pagina
    let nome = inputNomeRef.value;
    let apelido = inputApelidoRef.value;
    let email = inputEmailRef.value;
    let senha = inputSenhaRef.value;
    let confirmaSenha = inputConfirmaSenhaRef.value;

    if (senha === confirmaSenha) {

        let usuario = {
            nome: nome,
            apelido: apelido,
            email: email,
            senha: senha
        }

        let usuarios = JSON.parse(localStorage.getItem('usuarios'));

        if (usuarios === null) {
            usuarios = [];
            salvar(usuario, usuarios);
        } else {
            for (let usuario of usuarios) {
                if (usuario.email === email) {
                    return alert('E-mail já cadastrado');
                }
            }
            salvar(usuario, usuarios);
        }

    } else {
        alert('As senhas não conferem');
    }
})

function salvar(usuario, usuarios) {
    usuarios.push(usuario);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    alert('Cadastro realizado com sucesso');
    window.location.href = 'index.html';
}