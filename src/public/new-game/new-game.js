var serverAddress = 'http://localhost:3000/'
var createNewGameFunction = 'createNewGame'

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

function submitButtonClicked() {
    let gameNameInput = document.getElementsByClassName('game-name-input')[0].value;

    fetchFromServer(createNewGameFunction, function (isSucceeded) {
        if (isSucceeded) {
            location.href = '/game/game.html';
        } else {
            alert('error. could not create new game.')
        }
    }, 'gameName=' + gameNameInput);


}