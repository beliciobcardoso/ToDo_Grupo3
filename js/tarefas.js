"use strict";
const date = new Date();
const dia = String(date.getDate()).padStart(2, '0');
const mes = String(date.getMonth() + 1).padStart(2, '0');
const ano = date.getFullYear();
const dataAtual = dia + '/' + mes + '/' + ano;

let closeAppRef = document.querySelector('#closeApp');
let novaTarefaRef = document.querySelector('#novaTarefa');
let tarefasPendentesRef = document.querySelector('.tarefas-pendentes');
let usuarioLogadoRef = document.querySelector('#usuarioLogado');
let botaoAdicionarTarefaRef = document.querySelector('#botaoAdicionar');
let skeletonRef = document.querySelector('#skeleton');

// pega o item "logado" armazenado no localStorage e converte para um array e armazena na variavel logado
let logado = JSON.parse(localStorage.getItem('logado'));

if (logado === null) { // se a variavel logado for null (não exite um usuario logado)  então...
    window.location.href = 'index.html'; // redireciona para a pagina de login
}
// ---------------------------------------------------------------------------

usuarioLogadoRef.innerHTML = logado[0]; // escreve o nome do usuario logado na pagina

let donoTarefa = null;

const usuarios = JSON.parse(localStorage.getItem('usuarios'));
for (const usuario of usuarios) {
    if (usuario.nome === logado[0]) {
        donoTarefa = usuario.email
    }
}

// Adicionar tarefa
botaoAdicionarTarefaRef.addEventListener('click', (e) => {
    e.preventDefault(); // não deixa o link abrir uma nova pagina

    let tarefaAtual = novaTarefaRef.value;

    if (tarefaAtual === '') {
        alert('Digite uma tarefa');
    } else {

        let tarefa = {
            tarefa: tarefaAtual,
            data: dataAtual,
            dono: donoTarefa,
            status: 'pendente'
        }

        let tarefas = JSON.parse(localStorage.getItem('tarefas'));

        if (tarefas === null) {
            tarefas = [];
            salvar(tarefa, tarefas);
        } else {
            for (let tarefa of tarefas) {
                if (tarefa.tarefa === tarefaAtual && tarefa.dono === donoTarefa) {
                    return alert('Tarefa já cadastrada, Por favor, escolha outra tarefa');
                }
            }
            salvar(tarefa, tarefas);
        }
    }
})

// Fechar aplicacao
closeAppRef.addEventListener('click', (e) => { // quando clicar no botao fechar
    e.preventDefault(); // não deixa o link abrir uma nova pagina
    localStorage.removeItem('logado'); // remove o item logado do localStorage
    window.location.href = 'index.html'; // redireciona para a pagina de login
})

function salvar(tarefa, tarefas) {
    tarefas.push(tarefa);
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
    alert('Tarefa adicionada com sucesso');
    window.location.href = 'tarefas.html';
}



let tarefas = JSON.parse(localStorage.getItem('tarefas'));

for (const tarefa of tarefas) {

    if (tarefa.dono === donoTarefa) {
        skeletonRef.remove('skeleton');
        tarefasPendentesRef.innerHTML += `
        <li class="tarefa">
        <div class="not-done"></div>
        <div class="descricao">
          <p class="nome">${tarefa.tarefa}</p>
          <p class="timestamp">Criada em: ${tarefa.data}</p>
        </div>
      </li>
        `
    }
}