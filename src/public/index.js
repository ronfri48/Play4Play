var serverAddress = 'http://localhost:3000/'

window.addEventListener('load', function () {
    let modalElement = document.getElementsByClassName('modal')[0];
    if (document.cookie.startsWith('publicKey=')) {
        modalElement.className = 'modal hidden';
        let helloHeaderElement = document.getElementsByClassName('public-id-headline')[0];
        let pk = this.document.cookie.substr('publicKey='.length);
        helloHeaderElement.innerHTML = 'Your public ID is: ' + pk;
        fetchFromServer('setPK', function (isSucceeded) {
            if (!isSucceeded) {
                document.cookie = '';
                location.reload();
            }
        }, 'pk=' + pk)
    }
})

function PlayButtonClicked() {
    let publicKeyInputElement = document.getElementsByClassName('public-key-input')[0];
    let modalElement = document.getElementsByClassName('modal')[0];

    // check public key using: publicKeyInputElement.value

    let pk = publicKeyInputElement.value;
    modalElement.className = 'modal hidden';
    document.cookie = 'publicKey=' + pk;

    let helloHeaderElement = document.getElementsByClassName('public-id-headline')[0];
    helloHeaderElement.innerHTML = 'Your public ID is: ' + pk;

    fetchFromServer('setPK', function (isSucceeded) {
        if (!isSucceeded) {
            document.cookie = '';
            location.reload();
            alert('something went wrong with your pk')
        }
    }, 'pk=' + pk)
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