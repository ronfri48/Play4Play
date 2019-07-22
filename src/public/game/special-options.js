var serverAddress = 'http://localhost:3000';

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

function useJokerCard() {
    let pk = document.cookie.substr('publicKey='.length, 40);
    fetchFromServer('useJokerCard', function (isSucceeded) {
        if (!isSucceeded) {
            alert('error. could not buy joker')
        }
    }, 'pk=' + pk)
}

function showPlayerSelectionModal(callback) {

}

function useSneakyPeaky() {
    showPlayerSelectionModal(useSneakyPeakyOnPlayer);
}

function useSneakyPeakyOnPlayer() {
    let victimPk;
    let pk = document.cookie.substr('publicKey='.length, 40);
    fetchFromServer('useSneakyPeaky', function (isSucceeded) {
        if (!isSucceeded) {
            alert('error. could not buy sneaky peaky')
        }
    }, 'pk=' + pk + '&victimPk=' + victimPk)
}

function useSwapCards() {
    showPlayerSelectionModal(useSwapCardsOnPlayer);
}

function useSwapCardsOnPlayer() {
    let victimPk;
    let pk = document.cookie.substr('publicKey='.length, 40);
    fetchFromServer('useSwapCards', function (isSucceeded) {
        if (!isSucceeded) {
            alert('error. could not buy swap cards')
        }
    }, 'pk=' + pk + '&victimPk=' + victimPk)
}

function leaveGame() {
    fetchFromServer('leaveGame', function (isSucceeded) {
        if (!isSucceeded) {
            alert('error. could not leave game')
        } else {
            location.href = '/';
        }
    }, 'pk=' + pk)
}