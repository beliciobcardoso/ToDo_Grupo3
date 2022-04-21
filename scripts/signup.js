import validacao from "./utils.js"

let inputNomeRef = document.querySelector('#inputNome')
let inputSobrenomeRef = document.querySelector('#inputSobrenome')
let inputEmailRef = document.querySelector('#inputEmail')
let inputSenhaRef = document.querySelector('#inputSenha')
let inputConfirmarSenhaRef = document.querySelector('#inputConfirmarSenha')
let buttonSignUpRef = document.querySelector('#botaoSignUp')
let controlesRef = document.querySelectorAll('.campos')

validacao(controlesRef)

buttonSignUpRef.addEventListener('click', event => {

    event.preventDefault()

    let nome = inputNomeRef.value
    let sobrenome = inputSobrenomeRef.value
    let email = inputEmailRef.value
    let senha = inputSenhaRef.value
    let confirmarSenha = inputConfirmarSenhaRef.value

    function cadastrarUsuario() {
        let usuario = {
            firstName: nome,
            lastName: sobrenome,
            email: email,
            password: senha
        }

        const resquestOptions = {
            method: 'POST',
            body: JSON.stringify(usuario),
            headers: { 'Content-Type': 'application/json' }
        }

        fetch('https://ctd-todo-api.herokuapp.com/v1/users', resquestOptions)
            .then(response => response.json())
            .then(data => {
                localStorage.setItem('token', JSON.stringify(data.jwt));
                alert('Cadastro realizado com sucesso!')
                window.location.href = './index.html'
            }
            )
    }

    if ((senha == confirmarSenha) && (senha != '') && (senha.length >=8) && (nome != '')&& (sobrenome != '') && (email != '')) {

        cadastrarUsuario()

    } else if ( (senha == '') || (nome == '') || (sobrenome == '') || (email == '')){
        alert('Preencha todos os campos!')
    } else if (senha != confirmarSenha || (senha.length <=8) ){
        alert('A senha não confere!') 
    }

})