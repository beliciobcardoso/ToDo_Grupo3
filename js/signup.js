import validacao from './utils.js';

let inputNomeRef = document.querySelector('#inputNome');
let controlesRef = document.querySelectorAll('.campos');
let inputSenhaRef = document.querySelector('#inputSenha');
let inputEmailRef = document.querySelector('#inputEmail');
let botaoSignupRef = document.querySelector('#botaoSignup');
let inputSobrenomeRef = document.querySelector('#inputSobrenome');
let inputConfirmaSenhaRef = document.querySelector('#inputConfirmaSenha');

validacao(controlesRef);

botaoSignupRef.addEventListener('click', (e) => {
  e.preventDefault(); // não deixa o link abrir uma nova pagina
  let nome = inputNomeRef.value;
  let Sobrenome = inputSobrenomeRef.value;
  let email = inputEmailRef.value;
  let senha = inputSenhaRef.value;
  let confirmaSenha = inputConfirmaSenhaRef.value;

  if (senha === confirmaSenha && senha !== '') {
    let usuario = {
      firstName: nome,
      lastName: Sobrenome,
      email: email,
      password: senha,
    };

    const resquestOptions = {
      method: 'POST',
      body: JSON.stringify(usuario),
      headers: { 'Content-Type': 'application/json' },
    };

    fetch('https://ctd-todo-api.herokuapp.com/v1/users', resquestOptions).then(
      (response) => {
        if (response.ok) {
          //window.location.href = './index.html';
        } else if (response.status === 400) {
          alert('O usuário já está cadastrado');
        } else {
          alert('Erro ao cadastrar usuário');
        }
      }
    );
  } else {
    alert('As senhas não conferem');
  }
});
