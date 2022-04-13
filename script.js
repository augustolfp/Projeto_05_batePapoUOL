let userName;
function entrarNaSala() {
    userName = {name: "Augusto Lopes"};
    const addUser = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', userName);
    addUser.then(carregarInterfaceUsuario);
    addUser.catch(tratarFalhaLogin);
}

function tratarFalhaLogin(dadosErroLogin) {
    const errorCode = dadosErroLogin.response.status;
    alert(`Erro ${errorCode}!`);
}

function carregarInterfaceUsuario() {
    setInterval(mantemUsuarioOnline, 4000);
    alert("Login efetuado com sucesso!");

}

function mantemUsuarioOnline() {
    axios.post('https://mock-api.driven.com.br/api/v6/uol/status', userName);
    console.log("eita");
}

entrarNaSala()