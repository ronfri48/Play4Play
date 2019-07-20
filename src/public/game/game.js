const cardsInRow = 4;
var web3js;
var cardTemplate = '<div class="card" style="width: 18rem;"><img src="CardImgSrc" class="card-img-top" alt="CardName"><div class="card-body"><h5 class="card-title">CardTitle</h5></div></div>';
var serverAddress = 'http://localhost:3000'
var getMyCardsFunction = '/getMyCards'

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
    innerHTML = innerHTML.replace('CardImgSrc', '/../../resources/cards/' + cardValues['type'] + '/' + cardValues['value'] + '.jpg')
    innerHTML = innerHTML.replace('CardName', cardValues['value'])
    innerHTML = innerHTML.replace('CardTitle', cardValues['value'])
    return innerHTML;
}

function getMyCards(callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(JSON.parse(xmlHttp.responseText));
    }
    xmlHttp.open("GET", serverAddress + getMyCardsFunction, true); // true for asynchronous 
    xmlHttp.send(null);
}

window.addEventListener('load', function () {
    getMyCards(display_cards)
})