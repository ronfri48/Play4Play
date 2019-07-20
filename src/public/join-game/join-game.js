var tableRowTemplate = '<th scope="row">Index</th><td>Name</td><td>Players</td>';

window.onload = function () {
    var gameList = document.getElementsByClassName('game-list')[0];

    //call server here

    let numberOfGames = 6;

    for (var i = 0; i < numberOfGames; i++) {
        let rowInnerHtml = tableRowTemplate;
        rowInnerHtml = rowInnerHtml.replace('Index', i);
        rowInnerHtml = rowInnerHtml.replace('Name', 'Name' + i.toString())
        rowInnerHtml = rowInnerHtml.replace('Players', (i % 3).toString())

        let row = document.createElement('TR');
        row.innerHTML = rowInnerHtml;
        gameList.appendChild(row);
    }
}