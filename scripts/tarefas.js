let nomeUsuarioRef = document.querySelector('.nomeUsuario')
let imagemUsuarioRef = document.querySelector('.user-image')
let tarefasPendentesRef = document.querySelector('.tarefas-pendentes')
let botaoRef = document.querySelector('#botaoTarefa')


function logOutUser() {

    localStorage.clear()
    window.location.href = './index.html'
}




let requestConfiguration = {

    headers: { //cabeçalho da requisição
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token')
    }
}




if (localStorage.getItem('token') === 'undefined') {

    logOutUser()
} else {

    fetch('https://ctd-todo-api.herokuapp.com/v1/users/getMe', requestConfiguration).then(

        response => {

            if (response.ok) {

                response.json().then(

                    data => {

                        nome = data.firstName // variável nome recebe o valor de firstName
                        sobrenome = data.lastName
                        nomeUsuarioRef.innerHTML = nome + " " + sobrenome
                        imagemUsuarioRef.innerHTML = nome[0] + sobrenome[0]

                    }
                )
            } else if (response.status === 401) {

                logOutUser()
            }
        }
    )
}



fetch('https://ctd-todo-api.herokuapp.com/v1/tasks', requestConfiguration).then(

    response => {

        if (response.ok) {

            console.log(response)

            let skeletonRef = document.querySelector('#skeleton')

            response.json().then(

                tasks => {

                    for (let task of tasks) {

                        skeletonRef.remove('skeleton');
                        tarefasPendentesRef.innerHTML += `
                                <li class="tarefa">
                                <div class="not-done"></div>
                                <div class="descricao">
                                  <p class="nome">${task.description}</p>
                                  <p class="timestamp">Criada em: ${task.createdAt}</p>
                                </div>
                              </li>             `
                    }
                }

            )

        } else if (false) {

            console.log('falso!')
        }
    }
)


botaoRef.addEventListener('click', event =>{

    event.preventDefault()




})









