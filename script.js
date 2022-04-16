let userName;

function getUserName() {
    let name = prompt("Digite o seu Username!");
    userName = {name: name};
}

function entrarNaSala() {
    getUserName();
    const addUser = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', userName);
    addUser.then(tratarSucessoLogin);
    addUser.catch(tratarFalhaLogin);
}

function tratarFalhaLogin(dadosErroLogin) {
    const errorCode = dadosErroLogin.response.status;
    switch(errorCode) {
        case 400:
            alert("Já existe um usuário com esse nome! Tente novamente!");
            return entrarNaSala();
        default: 
            window.location.reload();
            break;
    }
}

function tratarSucessoLogin() {
    setInterval(refreshConnection, 4000);
    refreshMessages();
    setInterval(refreshMessages, 3000);
    console.log("Login efetuado com sucesso!");
}

function refreshConnection() {
    const refreshPromess = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', userName);
    refreshPromess.catch(window.location.reload);
    refreshPromess.then(console.log("Conexão Atualizada"));

}

function refreshMessages() {
    const getMensagens = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    getMensagens.then(tratarSucessoGetMensagens);
    getMensagens.catch(tratarFalhaGetMensagens);
}

function tratarSucessoGetMensagens(mensagens) {
    console.log("Mensagens atualizadas com sucesso");
    limpaTela();
    mensagens.data.forEach(insereMensagemNaTela);
    scrollPaginaAteFinal();
}

function tratarFalhaGetMensagens(dadosErro) {
    console.log("Erro ao requisitar mensagens!");
}

function insereMensagemNaTela(mensagem) {
    const containerMensagens = document.querySelector(".containerMensagens");
    switch(mensagem.type) {
        case "status":
            containerMensagens.innerHTML += `<div class='balloon status'>(${mensagem.time}) ${mensagem.from}: ${mensagem.text}</div>`;
        break;

        case "message":
            containerMensagens.innerHTML += `<div class='balloon message'>(${mensagem.time}) ${mensagem.from}: ${mensagem.text}</div>`;
        break;

        case "privateMessage":
            if(mensagemPrivadaEhParaMim(mensagem)) {
                containerMensagens.innerHTML += `<div class='balloon private_message'>(${mensagem.time}) ${mensagem.from}: ${mensagem.text}</div>`;
            }
        break;
    }
}

function limpaTela() {
    const containerMensagens = document.querySelector(".containerMensagens");
    containerMensagens.innerHTML = "";
}

function enviaMensagem() {
    const texto = document.querySelector("input").value;
    const mensagem = {from: userName.name, to: "Todos", text: texto, type: "message"};
    //console.log(mensagem)
    const envioMensagem = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', mensagem);
    envioMensagem.then(trataSucessoEnvioMsg);

}

function trataSucessoEnvioMsg(dadosEnvio) {
    console.log("Sucesso no envio da mensagem!");
    refreshMessages();
}

function mensagemPrivadaEhParaMim(mensagem) {
    if(mensagem.to===userName.name) {
        return true;
    }
    else {
        return false;
    }
}

function scrollPaginaAteFinal() {
    const ultimaMensagem = localizaUltimaMensagem();
    ultimaMensagem.scrollIntoView();
}

function localizaUltimaMensagem() {
    const mensagens = document.querySelectorAll(".balloon");
    const ultimaMensagem = mensagens[mensagens.length -1];
    return ultimaMensagem;
}



entrarNaSala()