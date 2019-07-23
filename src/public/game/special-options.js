var serverAddress = 'http://localhost:3000/';
var specialOptionsData = [{
    index: 0,
    title: 'swap',
    message: 'Please choose player to swap cards with',
    callbak: useSwapCardsOnPlayer
}, {
    index: 1,
    title: 'sneaky peaky',
    message: 'Please choose player to see his/her cards',
    callbak: useSneakyPeakyOnPlayer
}]

function useJokerCard() {
    let pk = document.cookie.substr('publicKey='.length, 40);
    fetchFromServer('useJokerCard', function (isSucceeded) {
        if (!isSucceeded) {
            alert('error. could not buy joker')
        } else {
            loadGame();
        }
    }, 'pk=' + pk)
}

function showPlayerSelectionModal(functionIndex) {
    let modalElement = document.getElementsByClassName('modal')[0];
    modalElement.className = 'modal show'
    let messageModalElement = document.getElementsByClassName('special-option-message')[0];
    messageModalElement.innerHTML = specialOptionsData[functionIndex].message;

    let playerSelectorElement = document.getElementById('special-player-selector');
    playerSelectorElement.innerHTML = '';
    for (let i = 0; i < currentGamePlayers.length; i++) {
        let optionElement = document.createElement('OPTION');
        optionElement.value = currentGamePlayers[i];
        optionElement.innerHTML = currentGamePlayers[i];
        playerSelectorElement.appendChild(optionElement);
    }

    let choosePlayerButtonElement = document.getElementById('choose-player-button');
    choosePlayerButtonElement.onclick = function () {
        specialOptionsData[functionIndex].callbak();
        modalElement.className = 'modal hide';
    };
}

function useSneakyPeaky() {
    showPlayerSelectionModal(1);
}

function useSneakyPeakyOnPlayer() {
    let victimPk = document.getElementById('special-player-selector').value;
    let pk = document.cookie.substr('publicKey='.length, 40);
    fetchFromServer('useSneakyPeaky', function (isSucceeded) {
        if (!isSucceeded) {
            alert('error. could not buy sneaky peaky')
        }
    }, 'pk=' + pk + '&victimPk=' + victimPk)
}

function useSwapCards() {
    showPlayerSelectionModal(0);
}

function useSwapCardsOnPlayer() {
    let victimPk = document.getElementById('special-player-selector').value;
    let pk = document.cookie.substr('publicKey='.length, 40);
    fetchFromServer('useSwapCards', function (isSucceeded) {
        if (!isSucceeded) {
            alert('error. could not buy swap cards')
        }
    }, 'pk=' + pk + '&victimPk=' + victimPk)
}

function leaveGame() {
    let pk = document.cookie.substr('publicKey='.length, 40);
    fetchFromServer('leaveGame', function (isSucceeded) {
        if (!isSucceeded) {
            alert('error. could not leave game')
        } else {
            location.href = '/';
        }
    }, 'pk=' + pk)
}