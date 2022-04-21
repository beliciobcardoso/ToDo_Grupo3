let nomeUsuarioRef = document.querySelector('.nomeUsuario');
let imagemUsuarioRef = document.querySelector('.user-image');
let tarefasPendentesRef = document.querySelector('.tarefas-pendentes');
let botaoRef = document.querySelector('#botaoTarefa');
let novaTarefaRef = document.querySelector('#novaTarefa');
let finalizarSessaoRef = document.querySelector('#closeApp');
let tarefasTerminadasRef = document.querySelector('.tarefas-terminadas');
let limparTarefaRef = document.querySelector('#limparTarefa');
//let skeletonRef = document.querySelector('#skeleton');

// VERIFICAR LOGIN E FAZER LOGOUT
let logado = localStorage.getItem('token');

function logOutUser() {
  localStorage.clear();
  window.location.href = './index.html';
}

finalizarSessaoRef.addEventListener('click', () => {

  Swal.fire({
    title: 'Tem certeza que quer finalizar a sessão?',
    text: "Você poderá voltar mais tarde.",
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sim, quero finalizar!'
  }).then((result => {
    if (result.isConfirmed) {

      logOutUser()
    }
  }))

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
          //response.json().then((task) => {

          Swal.fire(
            'Criada!',
            'Sua tarefa foi criada.',
            'success'
          )
          getTasks();
          //});
        }
      }
    );
  }
}

botaoRef.addEventListener('click', (event) => {
  event.preventDefault();

  cadastrarTarefa();
});



//ALTERAR TAREFA ENTRE TERMINADA E PENDENTE

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
        '',
        'error'
      );
    }
  });
}

const templateTarefas = `
          <div id="skeleton">
          <li class="tarefa">
            <div class="not-done"></div>
            <div class="descricao">
              <p class="nome">Nova tarefa</p>
              <p class="timestamp">Criada em: 15/07/21</p>
            </div>
          </li>
          <li class="tarefa">
            <div class="not-done"></div>
            <div class="descricao">
              <p class="nome">Nova tarefa</p>
              <p class="timestamp">Criada em: 15/07/21</p>
            </div>
          </li>
          <li class="tarefa">
            <div class="not-done"></div>
            <div class="descricao">
              <p class="nome">Nova tarefa</p>
              <p class="timestamp">Criada em: 15/07/21</p>
            </div>
          </li>
    
        </div>
          `

//FUNÇÃO PEGAR TAREFAS JÁ CADASTRADAS

function getTasks() {

  fetch(
    'https://ctd-todo-api.herokuapp.com/v1/tasks',
    requestConfiguration
  ).then((response) => {
    if (response.ok) {
      response.json().then((tasks) => {

        let data

        if (tasks.length === 0) {
          tarefasPendentesRef.innerHTML = templateTarefas;
          tarefasTerminadasRef.innerHTML = templateTarefas;
        } else {
          tarefasPendentesRef.innerHTML = '';
          tarefasTerminadasRef.innerHTML = '';
          novaTarefaRef.value = '';

          for (let task of tasks) {
            data = new Date(task.createdAt);
            if (task.completed === false) {
              tarefasPendentesRef.innerHTML += `
                                        <li class="tarefa" data-aos="fade-down-right" data-aos-duration="800">
                                            <div class="not-done" onclick="mudarParaTarefaFeita(${task.id})"></div>
                                            <div class="descricao">
                                                <div class="descricaoTarefa">
                                                    <p class="nome">${task.description}</p>
                                                    <p class="timestamp">Criada em: ${date(data)}</p>
                                                </div>
                                                <div class="controls">
                                                    <button class="btn-edit" id="botaoEditar" onclick="editarTarefa(${task.id})">
                                                        <img src="./assets/edit.png" alt="Editar tarefa"/>
                                                    </button>
                                                </div>
                                            </div>
                                        </li>`;
            } else {
              tarefasTerminadasRef.innerHTML += `
                                        <li class="tarefa" data-aos="fade-down-right" data-aos-duration="800">                                         
                                            <div class="not-done" onclick="mudarParaTarefaNaoFeita(${task.id})"></div>
                                            <div class="descricao">
                                              <div class="descricaoTarefa">
                                                  <p class="nome">${task.description}</p>
                                                  <p class="timestamp">Criada em: ${date(data)}</p>
                                              </div>
                                              <div class="controls">
                                                <button class="btn-edit" id="botaoEditar" onclick="editarTarefa(${task.id})">
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

// DELETAR - TODAS AS TAREFAS E TAREFAS DE FORMA INDIVIDUAL

let requestDeleteAuthorizateConfiguration = {

  method: 'DELETE',
  headers: {
    'Content-Type': 'application/json',
    Authorization: logado,
  },
}

function deletar(id) {
  fetch(`https://ctd-todo-api.herokuapp.com/v1/tasks/${id}`, requestDeleteAuthorizateConfiguration)
    .then((response) => {
      if (response.ok) {
        Swal.fire(
          'Sua Tarefa foi Deletada!',
          'A tarefa foi excluída com sucesso',
          'success'
        )
        getTasks()
      } else {
        Swal.fire(
          'Erro ao deletar Tarefa!',
          'Aconteceu um erro, tente novamente.',
          'error'
        );
      }
    })
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
    if (result.isConfirmed) {
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

        }
      });
    }
  }));
})


function deletarTarefa(id) {

  Swal.fire({
    title: 'Tem certeza que quer deletar?',
    text: "Não será possível desfazer essa ação!",
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sim, pode deletar!',
    cancelButtonText: 'Cancelar'
  }).then((result => {
    if (result.isConfirmed) {
      deletar(id)
    }

  }

  ))
}

//EDITAR TAREFAS

function editarTarefa(id) {

  const { value } = Swal.fire({
    title: 'Escreva a nova tarefa',
    input: 'text',
    inputValue: '',
    icon: 'info',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Pronto, está editado!',
    inputValidator: (value) => {
      if (!value) {
        Swal.fire(
          'Digite uma tarefa!',
          'Por favor, digite a tarefa que deseja!',
          'warning'
        )
      } else if (value.length <= 5) {
        Swal.fire(
          'Digite uma tarefa maior!',
          'Por favor, digite uma tarefa com no mínimo 5 dígitos.',
          'warning'
        )
      } else {
        Swal.fire(
          'Sua Tarefa foi Editada!',
          '',
          'success'
        )
        fetch(`https://ctd-todo-api.herokuapp.com/v1/tasks/${id}`, {
          method: 'PUT',
          body: JSON.stringify({
            description: value
          }),
          headers: {
            'Content-Type': 'application/json',
            Authorization: logado,
          },
        }).then((response) => {
          if (response.ok) {
            getTasks()
          } else {
            Swal.fire(
              'Erro ao editar Tarefa!',
              '',
              'error'
            )
          }
        });

      }
    }
  })
}

// FUNÇÃO PARA FORMATAR DATA DA PUBLICAÇÃO DA TAREFA

function date(data) {
  let dia = data.getDate() < 10 ? '0' + data.getDate() : data.getDate();
  let mes = String(data.getMonth() + 1).padStart(2, '0');
  let ano = data.getFullYear();
  let hora = data.getHours();
  let minuto = data.getMinutes();
  let segundo = data.getSeconds();
  let dataFormatada = `${dia}/${mes}/${ano} - ${hora}:${minuto}:${segundo}`;
  return dataFormatada;
}

// EXIBIR TAREFAS REGISTRADAS NA TELA AO CARREGAR A PÁGINA

window.addEventListener('load', () => {
  getTasks();
});


