let skeletonRef = document.querySelector('#skeleton');
let closeAppRef = document.querySelector('#closeApp');
let novaTarefaRef = document.querySelector('#novaTarefa');
let usuarioLogadoRef = document.querySelector('#usuarioLogado');
let tarefasPendentesRef = document.querySelector('.tarefas-pendentes');
let botaoAdicionarTarefaRef = document.querySelector('#botaoAdicionar');
let botaoRemoverTarefaRef = document.querySelector('#botaoExcluir');
let botaoEditarTarefaRef = document.querySelector('#botaoEditar');
let checkTarefaRef = document.querySelector('#checkTarefa');

let logado = localStorage.getItem('token');

let resquestOptions = {
  headers: {
    'Content-Type': 'application/json',
    Authorization: logado,
  },
};

fetch(
  'https://ctd-todo-api.herokuapp.com/v1/users/getMe',
  resquestOptions
).then((response) => {
  if (response.ok) {
    response.json().then((data) => {
      //console.log(`Minha id é ${data.id}`);
      usuarioLogadoRef.innerHTML = `Olá ${data.firstName} ${data.lastName}`;
    });
  } else if (response.status === 401) {
    alert('Usuário não autorizado');
    logOutUser();
  } else {
    alert('Erro ao carregar dados');
  }
});

fetch('https://ctd-todo-api.herokuapp.com/v1/tasks', resquestOptions).then(
  (response) => {
    if (response.ok) {
      response.json().then((tasks) => {
        for (const task of tasks) {
          let data = new Date(task.createdAt);

          skeletonRef.remove('skeleton');
          tarefasPendentesRef.innerHTML += `
                                  <li class="tarefa">
                                    <div class="not-done"></div>
                                    <div class="descricao"> 
                                        <div class="descricaoTarefa">
                                            <p class="nome">${
                                              task.description
                                            }</p>
                                            <p class="timestamp">Criada em: ${date(
                                              data
                                            )}</p>                         
                                        </div>                                       
                                        <div class="controls">
                                            <button class="btn-edit" id="botaoEditar" onclick="editar(${
                                              task.id
                                            })">
                                                <img src="./assets/edit.png" alt="Editar tarefa"/>
                                            </button>
                                            <button class="btn-delete" id="botaoExcluir" onclick="excluir(${
                                              task.id
                                            })">
                                                <img src="./assets/trash.png" alt="Excluir tarefa"/>
                                            </button>
                                        </div>
                                    </div>
                                </li>`;
        }
      });
    }
  }
);

// Adicionar tarefa
botaoAdicionarTarefaRef.addEventListener('click', (e) => {
  e.preventDefault();

  if (novaTarefaRef.value === '') {
    alert('O campo tarefa não pode estar vazio');
  } else if (novaTarefaRef.value.length <= 5) {
    alert('A tarefa não pode ter menos de 5 caracteres');
  } else {
    fetch('https://ctd-todo-api.herokuapp.com/v1/tasks', {
      method: 'POST',
      body: JSON.stringify({
        description: novaTarefaRef.value,
        completed: false,
      }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: logado,
      },
    }).then((response) => {
      response.json().then((tasks) => {
        console.log(tasks);
        //alert('Tarefa adicionada com sucesso');
        window.location.reload();
      });
    });
  }
});

// Deletar tarefa
function excluir(idExcluir) {
  fetch(`https://ctd-todo-api.herokuapp.com/v1/tasks/${idExcluir}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: logado,
    },
  }).then((response) => {
    if (response.ok) {
      //alert('Tarefa deletada com sucesso');
      window.location.reload();
    } else {
      alert('Erro ao deletar tarefa');
    }
  });
}

// Editar tarefa
function editar(idEditar) {
  fetch(`https://ctd-todo-api.herokuapp.com/v1/tasks/${idEditar}`, {
    method: 'PUT',
    body: JSON.stringify({
      description: novaTarefaRef.value,
    }),
    headers: {
      'Content-Type': 'application/json',
      Authorization: logado,
    },
  }).then((response) => {
    if (response.ok) {
      //alert('Tarefa editada com sucesso');
      window.location.reload();
    } else {
      alert('Erro ao editar tarefa');
    }
  });
  console.log(idEditar);
  console.log('editar');
}

// Fechar aplicacao
closeAppRef.addEventListener('click', () => {
  logOutUser();
});

function logOutUser() {
  localStorage.clear();
  window.location.href = './index.html';
}

function date(data) {
  let dia = data.getDate() < 10 ? '0' + data.getDate() : data.getDate();
  let mes = String(data.getMonth() + 1).padStart(2, '0');
  let ano = data.getFullYear();
  let hora = data.getHours();
  let minuto = data.getMinutes();
  let segundo = data.getSeconds();
  let dataFormatada = `${dia}/${mes}/${ano} - ${hora}:${minuto}:${segundo}`;
  return dataFormatada;
  //console.log(dataFormatada);
}
