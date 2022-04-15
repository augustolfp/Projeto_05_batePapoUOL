let userName;

function getUserName() {
    let name = prompt("Digite o seu Username!");
    userName = {name: name};
    return userName;
}

function entrarNaSala() {
    const addUser = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', getUserName());
    addUser.then(carregarInterfaceUsuario);
    addUser.catch(tratarFalhaLogin);
}

function tratarFalhaLogin(dadosErroLogin) {
    const errorCode = dadosErroLogin.response.status;
    alert(`Erro ${errorCode}!`);
    switch(errorCode) {
        case 400:
            alert("Já existe um usuário com esse nome! Tente novamente!");
            return entrarNaSala();
        default: 
            alert("Não tenho a menor ideia do que fazer, irmão");
            break;
    }
}

function carregarInterfaceUsuario() {
    setInterval(mantemUsuarioOnline, 4000);
    alert("Login efetuado com sucesso!");
    buscarMensagensServidor();
}

function mantemUsuarioOnline() {
    axios.post('https://mock-api.driven.com.br/api/v6/uol/status', userName);
}

function buscarMensagensServidor() {
    const getMensagens = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    getMensagens.then(tratarSucessoGetMensagens);
    getMensagens.catch(tratarFalhaGetMensagens);
}

function tratarSucessoGetMensagens(mensagens) {
    console.log(mensagens);
}

function tratarFalhaGetMensagens(dadosErro) {
    console.log("Erro ao requisitar mensagens!");
}




entrarNaSala()