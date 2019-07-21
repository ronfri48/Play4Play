const cardsInRow = 4;
var web3js;
var cardTemplate = '<div class="card" style="width: 18rem;"><img src="CardImgSrc" class="card-img-top" alt="CardName"><div class="card-body"><h5 class="card-title">CardTitle</h5></div></div>';
var serverAddress = 'http://localhost:3000'
var getMyCardsFunction = '/getMyCards'
var getMessagesFunction = '/getGameMessages'
var getPlayersFunction = '/getPlayers'
var cardTypes = ['banks', 'basketball_teams', 'celebs', 'cities', 'food', 'football_teams', 'inventions', 'places', 'universities', 'words'];
var currentGamePlayers;
var pngFiles = ['macabi-tel-aviv', 'BeitarJerusalem', 'macabi-tel-aviv', 'Waze', 'mobileye', 'usb', 'sababa', 'GAME-OVER', 'hapoel_beer_sheva', 'hpaoel-jerusalem'];

function display_cards(cards) {
    var cardsTable = document.getElementsByClassName("player-cards")
    for (var i = 0; i < cards.length; i++) {
        var tr = document.createElement('tr');
        for (var j = 0; j < cardsInRow; j++) {
            let cardIndex = cardsInRow * i + j
            if (cardIndex < cards.length) {
                var card = document.createElement('td');
                card.innerHTML = fill_card_details(cards[cardIndex]);
                tr.appendChild(card);
            }
        }
        cardsTable[0].appendChild(tr);
    }
}


function fill_card_details(cardValues) {
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

function fetchFromServer(functionName, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(JSON.parse(xmlHttp.responseText));
    }
    xmlHttp.open("GET", serverAddress + functionName, true); // true for asynchronous 
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

    //do server work
}

window.addEventListener('load', function () {
    fetchFromServer(getPlayersFunction, displayPlayers);
    setInterval(function () {
        fetchFromServer(getMessagesFunction, updateMessages)
    }, 3000);
    fetchFromServer(getMyCardsFunction, display_cards)
})