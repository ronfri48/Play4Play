var serverAddress = 'http://localhost:3000/'
var addToGameFunction = 'addToGame'

function fetchFromServer(functionName, callback, parameterString) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(JSON.parse(xmlHttp.responseText));
    }
    if (parameterString) {
        parameterString = '?' + parameterString;
        xmlHttp.open("GET", serverAddress + functionName + parameterString, true);
    } else {
        xmlHttp.open("GET", serverAddress + functionName, true);
    }

    xmlHttp.send(null);
}

function joinGameClicked() {
    let gameAddress = document.getElementsByClassName('game-name-input')[0].value;
    fetchFromServer(addToGameFunction, function (isSucceded) {
        console.log(isSucceded)
        if (isSucceded) {
            location.href = '/game/game.html';
        } else {
            location.reload();
        }
    }, 'gameAddress=' + gameAddress)

}