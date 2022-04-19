
export default function validacao(controlesRef){
    console.log('teste')
    for (let controleRef of controlesRef){

        let inputRef = controleRef.children[1]

        inputRef.addEventListener('keyup', () =>{

            if(inputRef.checkValidity()){
                controleRef.classList.remove('camposErro')
            } else{
                controleRef.classList.add('camposErro')
            }
        })
    }
}