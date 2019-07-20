window.onload = function () {

}

function submitButtonClicked() {
    let gameNameInput = document.getElementsByClassName('game-name-input')[0].value;
    //call server here
    location.href = '/game/game.html';
}