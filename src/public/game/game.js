const cardsInRow = 4;
var isGameOn = false;
var cardTemplate = '<div class="card" style="width: 18rem;"><img src="CardImgSrc" class="card-img-top" alt="CardName"><div class="card-body"><h5 class="card-title">CardTitle</h5></div></div>';
var serverAddress = 'http://localhost:3000/'
var getMyCardsFunction = 'getMyCards'
var getMessagesFunction = 'getGameMessages'
var getPlayersFunction = 'getPlayers'
var checkIfGameIsOnFunction = 'isGameOn'
var requestCardsFunction = 'requestCards'
var cardTypes = ['banks', 'basketball_teams', 'celebs', 'cities', 'food', 'football_teams', 'inventions', 'places', 'universities', 'words'];
var currentGamePlayers;
var pngFiles = ['macabi-tel-aviv', 'BeitarJerusalem', 'macabi-tel-aviv', 'Waze', 'mobileye', 'usb', 'sababa', 'GAME-OVER', 'hapoel_beer_sheva', 'hpaoel-jerusalem'];
var technicalMessages = [{
    index: 0,
    message: 'connected to game',
    function: function () {
        isGameOn = true;
        loadGame();
    }
}, {
    index: 1,
    message: 'took cards from deck',
    function: function () {
        loadGame();
    }
}]


function displayCards(cards) {
    var cardsTable = document.getElementsByClassName("player-cards")[0]
    cardsTable.innerHTML = ''
    let cardIndex = 0;
    for (var i = 0; cardIndex < cards.length; i++) {
        var tr = document.createElement('tr');
        for (var j = 0; j < cardsInRow; j++) {
            cardIndex = cardsInRow * i + j
            if (cardIndex < cards.length) {
                var card = document.createElement('td');
                card.innerHTML = fillCardDetails(cards[cardIndex]);
                tr.appendChild(card);
            }
        }
        cardsTable.appendChild(tr);
    }
}


function fillCardDetails(cardValues) {
    let innerHTML = cardTemplate;
    if (pngFiles.includes(cardValues['value'])) {
        innerHTML = innerHTML.replace('CardImgSrc', '/../../resources/cards/' + cardValues['type'] + '/' + cardValues['value'] + '.png')
    } else {
        innerHTML = innerHTML.replace('CardImgSrc', '/../../resources/cards/' + cardValues['type'] + '/' + cardValues['value'] + '.jpg')
    }
    innerHTML = innerHTML.replace('CardName', cardValues['value'])
    innerHTML = innerHTML.replace('CardTitle', cardValues['value'])
    return innerHTML;
}

function updateMessages(messages) {
    let messageArea = document.getElementById('info-message-area')
    messageArea.innerHTML = ""
    for (let i = 0; i < messages.length; i++) {
        if (technicalMessages.map(x => x['message']).includes(messages[i])) {
            technicalMessages.find(x => x['message'] === messages[i])['function']();
        }
        let messageElement = document.createElement('DIV')
        messageElement.className = 'alert alert-info'
        messageElement.role = 'alert'
        messageElement.textContent = messages[i]
        messageArea.appendChild(messageElement)
    }
}

function displayPlayers(players) {
    currentGamePlayers = players;
    let playerListHeaderElement = document.getElementById('player-list');
    playerListHeaderElement.innerHTML = 'Players in the game: '
    for (let i = 0; i < players.length; i++) {
        playerListHeaderElement.innerHTML += players[i];
        if (i + 1 < players.length) {
            playerListHeaderElement.innerHTML += ', '
        }
    }

    displaySelectors() //only now we can display the players
}

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

function displaySelectors() {
    let playerSelectorElement = document.getElementById('player-selector');
    playerSelectorElement.innerHTML = '';
    for (let i = 0; i < currentGamePlayers.length; i++) {
        let optionElement = document.createElement('OPTION');
        optionElement.value = currentGamePlayers[i];
        optionElement.innerHTML = currentGamePlayers[i];
        playerSelectorElement.appendChild(optionElement);
    }

    let cardSelectorElement = document.getElementById('card-selector');
    cardSelectorElement.innerHTML = '';
    for (let i = 0; i < cardTypes.length; i++) {
        let optionElement = document.createElement('OPTION');
        optionElement.value = cardTypes[i];
        optionElement.innerHTML = cardTypes[i];
        cardSelectorElement.appendChild(optionElement);
    }
}

function requestCards() {
    let playerSelcted = document.getElementById('player-selector').value;
    let cardSelcted = document.getElementById('card-selector').value;

    fetchFromServer(requestCardsFunction, function (numberOfCards) {
        if (numberOfCards > 0) {
            loadGame()
        } else {
            updateMessages(['you got no cards from ' + playerSelcted])
        }
    }, 'player=' + playerSelcted + '&card=' + cardSelcted);
}

window.addEventListener('load', function () {
    loadGame();

    setInterval(function () {
        fetchFromServer(getMessagesFunction, updateMessages);
    }, 3000);
})

function loadGame() {
    if (!isGameOn) {
        fetchFromServer(checkIfGameIsOnFunction, function (resultFromServer) {
            isGameOn = resultFromServer;
            loadGame()
        });
    }
    let mainHeaderElement = document.getElementsByClassName('main-header')[0];
    if (isGameOn) {
        mainHeaderElement.innerHTML = 'Good Luck!';
        fetchFromServer(getPlayersFunction, displayPlayers);
        fetchFromServer(getMyCardsFunction, displayCards);
    } else {
        mainHeaderElement.innerHTML = "Game has not started yet. Wait For more players";
    }
}