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
    alert('Por favor, digite uma tarefa.');
  } else if (novaTarefaRef.value.length <= 5) {
    alert('A tarefa tem que possuir mais de 5 caracteres!');
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
      getTasks();
    } else {
      alert('Erro!');
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
      getTasks();
    } else {
      alert('Erro!');
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

          for (let task of tasks) {
            if (task.completed === false) {
              tarefasPendentesRef.innerHTML += `
                                        <li class="tarefa">
                                            <div class="not-done" onclick="mudarParaTarefaFeita(${task.id})"></div>
                                            <div class="descricao">
                                                <p class="nome">${task.description}</p>
                                                <p class="timestamp">Criada em: ${task.createdAt}</p>
                                            </div>
                                        </li>`;
            } else {
              tarefasTerminadasRef.innerHTML += `
                                        <li class="tarefa">
                                            <div class="not-done" onclick="mudarParaTarefaNaoFeita(${task.id})"></div>
                                            <div class="descricao">
                                                <p class="nome">${task.description}</p>
                                                <p class="timestamp">Criada em: ${task.createdAt}</p>
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

function deletar(id) {
  fetch(`https://ctd-todo-api.herokuapp.com/v1/tasks/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: logado,
    },
  });
}

limparTarefaRef.addEventListener('click', () => {
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
});

window.addEventListener('load', () => {
  getTasks();
});
