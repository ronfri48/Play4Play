var tableRowTemplate = '<th scope="row">Index</th><td>Name</td><td>Players</td><td><button onclick="joinGameClicked(gameIndex)" class="btn btn-primary btn-lg">Join Game</button></td>';
var serverAddress = 'http://localhost:3000/'
var addToGameFunction = 'addToGame'
var getListOfGamesFunction = 'getListOfGames'

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

function joinGameClicked(gameIndex) {
    let pk = this.document.cookie.substr('publicKey='.length, 40);
    fetchFromServer(addToGameFunction, function (isSucceded) {
        if (isSucceded) {
            location.href = '/game/game.html';
        } else {
            alert('error. could not add you to the game')
            location.reload();
        }
    }, 'pk=' + pk + '&gameIndex=' + gameIndex)

}

window.onload = function () {
    var gameList = document.getElementsByClassName('game-list')[0];

    fetchFromServer(getListOfGamesFunction, function (listOfGames) {
        for (var i = 0; i < listOfGames.length; i++) {
            let rowInnerHtml = tableRowTemplate;
            rowInnerHtml = rowInnerHtml.replace('Index', i);
            rowInnerHtml = rowInnerHtml.replace('Name', listOfGames[i]['Name'])
            rowInnerHtml = rowInnerHtml.replace('Players', listOfGames[i]['Players'])
            rowInnerHtml = rowInnerHtml.replace('gameIndex', i)

            let row = document.createElement('TR');
            row.innerHTML = rowInnerHtml;
            gameList.appendChild(row);
        }
    });
}