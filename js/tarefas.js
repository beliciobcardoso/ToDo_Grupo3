let skeletonRef = document.querySelector('#skeleton');
let closeAppRef = document.querySelector('#closeApp');
let novaTarefaRef = document.querySelector('#novaTarefa');
let usuarioLogadoRef = document.querySelector('#usuarioLogado');
let tarefasPendentesRef = document.querySelector('.tarefas-pendentes');
let botaoAdicionarTarefaRef = document.querySelector('#botaoAdicionar');
let botaoRemoverTarefaRef = document.querySelector('#botaoRemover');

let logado = localStorage.getItem('token');

let resquestOptions = {
    headers: {
        'Content-Type': 'application/json',
        'Authorization': logado
    }
}

fetch('https://ctd-todo-api.herokuapp.com/v1/users/getMe', resquestOptions)
    .then(response => {
        if (response.ok) {
            response.json().then(data => {
                console.log(`Minha id é ${data.id}`);
                usuarioLogadoRef.innerHTML = `Olá ${data.firstName} ${data.lastName}`;
            })
        } else if (response.status === 401) {
            alert('Usuário não autorizado');
            logOutUser()
        } else {
            alert('Erro ao carregar dados');
        }
    })

fetch('https://ctd-todo-api.herokuapp.com/v1/tasks', resquestOptions)
    .then(response => {
        if (response.ok) {
            response.json().then(
                tasks => {    
                    if (true) {
                        for (const task of tasks) {
                            console.log(task);
                            skeletonRef.remove('skeleton');
                            tarefasPendentesRef.innerHTML += `
                                  <li class="tarefa">
                                  <div class="not-done"></div>
                                  <div class="descricao">
                                    <p class="nome">${task.description}</p>
                                    <p class="timestamp">Criada em: ${task.createdAt}</p>                                
                                    <div class="control">
                                    <button class="botao-editar" id="botaoEditar">
                                      <img src="./assets/edit.png" alt="Editar tarefa">
                                    </button>
                                    <button class="botao-excluir" id="botaoExcluir">
                                      <img src="./assets/trash.png" alt="Excluir tarefa">
                                    </button>
                                  </div>
                                </li>`
                        }
                        
                    }                
                })
        }
    })

// Adicionar tarefa
botaoAdicionarTarefaRef.addEventListener('click', () => {
   
    fetch('https://ctd-todo-api.herokuapp.com/v1/tasks', {
        method: 'POST',
        body: JSON.stringify({
            description: novaTarefaRef.value,
            completed: false
        }),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': logado
        }
    })
        .then(response => {
            
                response.json().then(tasks => {
                    console.log(tasks);
                    alert('Tarefa adicionada com sucesso');
                })
            
        })
})

// Deletar tarefa
botaoRemoverTarefaRef.addEventListener('click', () => {
   
    fetch('https://ctd-todo-api.herokuapp.com/v1/tasks', {
        method: 'POST',
        body: JSON.stringify({
            description: novaTarefaRef.value,
            completed: false
        }),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': logado
        }
    })
        .then(response => {
            
                response.json().then(tasks => {
                    console.log(tasks);
                    alert('Tarefa adicionada com sucesso');
                })
            
        })
})

// Fechar aplicacao
closeAppRef.addEventListener('click', () => { // quando clicar no botao fechar 
    logOutUser()
})

function logOutUser() {
    localStorage.clear();
    window.location.href = './index.html'
}