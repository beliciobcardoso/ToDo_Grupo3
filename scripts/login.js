import validacao from "./utils.js"

let buttonLoginRef = document.querySelector('#buttonLogin')
let inputEmailRef = document.querySelector('#inputEmail')
let inputPasswordRef = document.querySelector('#inputPassword')
let controlesRef = document.querySelectorAll('.campos')

validacao(controlesRef)


buttonLoginRef.addEventListener('click', event => {

    event.preventDefault()


    let credentials = { //objeto a ser enviado para o servidor, que depois vai passar para JSON
        // CONFERIR A ESTRUTURA DOS DADOS QUE A API ESTÁ ESPERANDO E USAR OS MESMO NOMES
        // email: '',
        // password: ''

        email: inputEmailRef.value,
        password: inputPasswordRef.value
    }

    let requestHeaders = { // vai especificar o tipo de dado que está sendo enviado

        'Content-Type': 'application/json'  // padrão

    }

    let requestConfiguration = { // enviar dados pro servidor

        method: 'POST',// vai esperar uma string, metodo de envio
        body: JSON.stringify(credentials),     // dados a serem enviados, tem que ser em JSON
        headers: requestHeaders
    }


    fetch('https://ctd-todo-api.herokuapp.com/v1/users/login', requestConfiguration).then( // o metodo padrão do fetch é GET

        response => { // resposta do servidor

            if (response.ok) {

                response.json().then( // json vai convertar para js e pegar o data

                    data => {

                        //console.log(data.jwt)
                        localStorage.setItem('token', data.jwt)
                        window.location.href = './tarefas.html' // quando executada, irá mudar a pagina para o html especificado
                    }


                )
            } else {
                alert('Usuário Incorreto')
            }
        }
    )
})