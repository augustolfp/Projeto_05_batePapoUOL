let userName;
let listaParticipantes;

function entrarNaSala(name) {
    userName = {name: name};
    const addUser = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', userName);
    addUser.then(tratarSucessoLogin);
    addUser.catch(tratarFalhaLogin);
}

function tratarFalhaLogin(dadosErroLogin) {
    const errorCode = dadosErroLogin.response.status;
    switch(errorCode) {
        case 400:
            alert("Já existe um usuário com esse nome! Tente novamente!");
        default: 
            window.location.reload();
            break;
    }
}

function tratarSucessoLogin() {
    setInterval(refreshConnection, 4000);
    refreshMessages();
    setInterval(refreshMessages, 3000);
    obterListaParticipantes();
    setInterval(obterListaParticipantes, 10000);
    console.log("Login efetuado com sucesso!");
    desligaTelaLogin();
}

function refreshConnection() {
    const refreshPromess = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', userName);
    refreshPromess.catch(window.location.reload);
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
            containerMensagens.innerHTML += `<div class='balloon status'><span class='horarioMensagem'>(${mensagem.time}) </span><span class = 'users'>${mensagem.from} </span>${mensagem.text}</div>`;
        break;

        case "message":
            containerMensagens.innerHTML += `<div class='balloon message'><span class='horarioMensagem'>(${mensagem.time}) </span><span class = 'users'>${mensagem.from} </span>para <span class = 'users'>${mensagem.to}</span>: ${mensagem.text}</div>`;
        break;

        case "private_message":
            if(mensagemPrivadaEhParaMim(mensagem)) {
                containerMensagens.innerHTML += `<div class='balloon privateMessage'><span class='horarioMensagem'>(${mensagem.time}) </span><span class = 'users'>${mensagem.from} </span>reservadamente para <span class = 'users'>${mensagem.to}</span>: ${mensagem.text}</div>`;
            }
        break;
    }
}

function limpaTela() {
    const containerMensagens = document.querySelector(".containerMensagens");
    containerMensagens.innerHTML = "";
}

function enviaMensagem() {
    const caixaTexto = document.querySelector(".barraBase input");
    const texto = caixaTexto.value;
    if (texto !== "") {
        const mensagem = {from: userName.name, to: "Todos", text: texto, type: "message"};
        const envioMensagem = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', mensagem);
        caixaTexto.value = "";
        envioMensagem.then(refreshMessages);
        envioMensagem.catch(window.location.reload);
    }
}

function mensagemPrivadaEhParaMim(mensagem) {
    if(mensagem.to===userName.name || mensagem.from===userName.name) {
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

document.addEventListener("keyup", function(teclaClicada) {
    if(teclaClicada.key === "Enter") {
        document.getElementById("sendButton").click();
    }
})


function clicouEmEntrar() {
    const usuario = document.querySelector(".telaDeEntrada input").value;
    entrarNaSala(usuario);
}

function desligaTelaLogin() {
    const telaLogin = document.querySelector(".telaDeEntrada");
    telaLogin.classList.add("escondido");
}

function obterListaParticipantes() {
    const requestParticipantes = axios.get('https://mock-api.driven.com.br/api/v6/uol/participants');
    requestParticipantes.then(tratarSucessoRequestParticipantes);
}

function tratarSucessoRequestParticipantes(resposta) {
    listaParticipantes = resposta.data;
    console.log("Lista de participantes obtida");
}