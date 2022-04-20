let nomeUsuarioRef = document.querySelector('.nomeUsuario');
let imagemUsuarioRef = document.querySelector('.user-image');
let tarefasPendentesRef = document.querySelector('.tarefas-pendentes');
let botaoRef = document.querySelector('#botaoTarefa');
let novaTarefaRef = document.querySelector('#novaTarefa');
let finalizarSessaoRef = document.querySelector('#closeApp');
let tarefasTerminadasRef = document.querySelector('.tarefas-terminadas');
let limparTarefaRef = document.querySelector('#limparTarefa');
let skeletonRef = document.querySelector('#skeleton');

// VERIFICAR LOGIN
let logado = localStorage.getItem('token');

function logOutUser() {
  localStorage.clear();
  window.location.href = './index.html';
}

finalizarSessaoRef.addEventListener('click', () => {
  logOutUser();
});

let requestConfiguration = {
  headers: {
    //cabeçalho da requisição
    'Content-Type': 'application/json',
    Authorization: logado,
  },
};

if (logado === 'undefined') {
  logOutUser();
} else {
  fetch(
    'https://ctd-todo-api.herokuapp.com/v1/users/getMe',
    requestConfiguration
  ).then((response) => {
    if (response.ok) {
      response.json().then((data) => {
        nome = data.firstName; // variável nome recebe o valor de firstName
        sobrenome = data.lastName;
        nomeUsuarioRef.innerHTML = nome + ' ' + sobrenome;
        imagemUsuarioRef.innerHTML = nome[0] + sobrenome[0];
      });
    } else if (response.status === 401) {
      logOutUser();
    }
  });
}

//CADASTRAR TAREFA

function cadastrarTarefa() {
  if (novaTarefaRef.value === '') {
    Swal.fire(
      'Digite uma tarefa!',
      'Por favor, digite a tarefa que deseja!',
      'warning'
    )
  } else if (novaTarefaRef.value.length <= 5) {
    Swal.fire(
      'Digite uma tarefa maior!',
      'Por favor, digite uma tarefa com no mínimo 5 dígitos.',
      'warning'
    )
  } else {
    let task = {
      description: novaTarefaRef.value,
      completed: false,
    };

    const resquestOptions = {
      method: 'POST',
      body: JSON.stringify(task),
      headers: {
        'Content-Type': 'application/json',
        Authorization: logado,
      },
    };

    fetch('https://ctd-todo-api.herokuapp.com/v1/tasks', resquestOptions).then(
      (response) => {
        if (response.ok) {
          response.json().then((task) => {

            Swal.fire(
              'Criada!',
              'Sua tarefa foi criada.',
              'success'
            )
            getTasks();
          });
        }
      }
    );
  }
}

botaoRef.addEventListener('click', (event) => {
  event.preventDefault();

  cadastrarTarefa();
});

function mudarParaTarefaFeita(id) {
  const resquestOptions = {
    method: 'PUT',
    body: JSON.stringify({
      completed: true,
    }),
    headers: {
      'Content-Type': 'application/json',
      Authorization: logado,
    },
  };
  fetch(
    `https://ctd-todo-api.herokuapp.com/v1/tasks/${id}`,
    resquestOptions
  ).then((response) => {
    if (response.ok) {
      Swal.fire(
        'Tarefa Feita!',
        'Sua tarefa foi terminada.',
        'success'
      )
      getTasks();
    } else {
      Swal.fire(
        'Erro!',
        'error'
      );
    }
  });
}

function mudarParaTarefaNaoFeita(id) {
  const resquestOptions = {
    method: 'PUT',
    body: JSON.stringify({
      completed: false,
    }),
    headers: {
      'Content-Type': 'application/json',
      Authorization: logado,
    },
  };
  fetch(
    `https://ctd-todo-api.herokuapp.com/v1/tasks/${id}`,
    resquestOptions
  ).then((response) => {
    if (response.ok) {
      Swal.fire(
        'Tarefa Pendente!',
        'Sua tarefa voltou a ficar pendente.',
        'success'
      )
      getTasks();
    } else {
      Swal.fire(
        'Erro!',
        'error'
      );
    }
  });
}

function getTasks() {
  
  fetch(
    'https://ctd-todo-api.herokuapp.com/v1/tasks',
    requestConfiguration
  ).then((response) => {
    if (response.ok) {
      response.json().then((tasks) => {
        if (tasks.length === 0) {
          skeletonRef.style.display = 'block';
        } else {
          skeletonRef.style.display = 'none';
          tarefasPendentesRef.innerHTML = '';
          tarefasTerminadasRef.innerHTML = '';
          novaTarefaRef.value = '';
          console.log('dentro da gettask')
          for (let task of tasks) {
            if (task.completed === false) {
              tarefasPendentesRef.innerHTML += `
                                        <li class="tarefa" "data-aos-"fade-down-right">
                                            <div class="not-done" onclick="mudarParaTarefaFeita(${task.id})"></div>
                                            <div class="descricao">
                                                <div class="descricaoTarefa">
                                                    <p class="nome">${task.description}</p>
                                                    <p class="timestamp">Criada em: ${task.createdAt}</p>
                                                </div>
                                                <div class="controls">
                                                    <button class="btn-edit" id="botaoEditar" onclick="editar(${task.id})">
                                                        <img src="./assets/edit.png" alt="Editar tarefa"/>
                                                    </button>
                                                </div>
                                            </div>
                                        </li>`;
            } else {
              tarefasTerminadasRef.innerHTML += `
                                        <li class="tarefa" "data-aos-"fade-down-right">                                         
                                            <div class="not-done" onclick="mudarParaTarefaNaoFeita(${task.id})"></div>
                                            <div class="descricao">
                                              <div class="descricaoTarefa">
                                                  <p class="nome">${task.description}</p>
                                                  <p class="timestamp">Criada em: ${task.createdAt}</p>
                                              </div>
                                              <div class="controls">
                                                <button class="btn-edit" id="botaoEditar" onclick="editar(${task.id})">
                                                    <img src="./assets/edit.png" alt="Editar tarefa"/>
                                                </button>
                                                <button class="btn-delete" id="botaoExcluir" onclick="deletarTarefa(${task.id})">
                                                    <img src="./assets/trash.png" alt="Excluir tarefa"/>
                                                </button>
                                              </div>
                                            </div>                             
                                        </li>`;
            }
          }
        }
      });
    }
  });
}


// DELETAR TODAS AS TAREFAS

let requestDeleteAuthorizateConfiguration = {

  method: 'DELETE',
  headers: {
    'Content-Type': 'application/json',
    Authorization: logado,
  },
}

function deletar(id) {
  fetch(`https://ctd-todo-api.herokuapp.com/v1/tasks/${id}`, requestDeleteAuthorizateConfiguration)
}

limparTarefaRef.addEventListener('click', () => {

  Swal.fire({
    title: 'Tem certeza que quer deletar tudo?',
    text: "Não será possível desfazer essa ação!",
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sim, pode deletar tudo!'
  }).then((result => {
    if (result.isConfirmed)  {
                  fetch(
                    'https://ctd-todo-api.herokuapp.com/v1/tasks',
                    requestConfiguration
                  ).then((response) => {
                    if (response.ok) {
                      response.json().then((tasks) => {
                        for (let task of tasks) {
                          deletar(task.id);
                        }
                      });
                      getTasks()
                    }
                  });
      }}));
})


function deletarTarefa(id) {

  Swal.fire({
    title: 'Tem certeza que quer deletar?',
    text: "Não será possível desfazer essa ação!",
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sim, pode deletar!'
  }).then((result => {
    if (result.isConfirmed) {                               //se conformar, algo será executado

      fetch(`https://ctd-todo-api.herokuapp.com/v1/tasks/${id}`, requestDeleteAuthorizateConfiguration)

        .then(response => {
          getTasks()
          if (response.ok) {
            Swal.fire(
              'Deletado!',
              'Sua tarefa foi deletada.',
              'success',               
            )
            
          }
        }
        )
    }
  }))
}

//EDITAR TAREFAS

function editar(id) {
  if (novaTarefaRef.value === '') {
    alert('O campo tarefa não pode estar vazio');
  } else if (novaTarefaRef.value.length <= 5) {
    alert('A tarefa não pode ter menos de 5 caracteres');
  } else {
    fetch(`https://ctd-todo-api.herokuapp.com/v1/tasks/${id}`, {
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
        getTasks()
      } else {
        alert('Erro ao editar tarefa');
      }
    });
  }
}


window.addEventListener('load', () => {
  getTasks();
});