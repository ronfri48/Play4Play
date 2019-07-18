const cardsInRow = 4;
var web3js;
var cardTemplate = '<div class="card" style="width: 18rem;"><img src="..." class="card-img-top" alt="..."><div class="card-body"><h5 class="card-title">Card title</h5></div></div>';

function display_cards() {
    var playerCards = 6;
    var cardsTable = document.getElementsByClassName("player-cards")
    for (var i = 0; i < playerCards; i++) {
        var tr = document.createElement('tr');
        for (var j = 0; j < cardsInRow; j++) {
            if (cardsInRow * i + j < playerCards) {
                var card = document.createElement('td');
                card.innerHTML = cardTemplate;
                card = fill_card_details(card);
                tr.appendChild(card);
            }
        }
        cardsTable[0].appendChild(tr);
    }
}

function fill_card_details(card) {
    return card;
}


window.addEventListener('load', function () {
    if (typeof web3 !== 'undefined') {
        web3js = new Web3(web3.currentProvider);
    } else {}
    display_cards();
})