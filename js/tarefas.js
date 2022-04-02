

let botaoAdicionarTarefaRef = document.querySelector('#botaoAdicionar');
let closeAppRef = document.querySelector('#closeApp');
let novaTarefaRef = document.querySelector('#novaTarefa');
let listaTarefasRef = document.querySelector('#listaTarefas');
let usuarioLogadoRef = document.querySelector('#usuarioLogado');

// pega o item "logado" armazenado no localStorage e converte para um array e armazena na variavel logado
let logado = JSON.parse(localStorage.getItem('logado')); 

if (logado === null) { // se a variavel logado for null (não exite um usuario logado)  então...
    window.location.href = 'index.html'; // redireciona para a pagina de login
}

usuarioLogadoRef.innerHTML = logado[0]; // escreve o nome do usuario logado na pagina

// Fechar aplicacao
closeAppRef.addEventListener('click', (e) => { // quando clicar no botao fechar
    e.preventDefault(); // não deixa o link abrir uma nova pagina
    localStorage.removeItem('logado'); // limpa o localStorage
    window.location.href = 'index.html'; // redireciona para a pagina de login
}
)


