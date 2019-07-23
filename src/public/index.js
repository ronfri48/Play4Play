window.addEventListener('load', function () {
    let modalElement = document.getElementsByClassName('modal')[0];
    if (document.cookie.startsWith('publicKey=')) {
        modalElement.className = 'modal hidden';
        let helloHeaderElement = document.getElementsByClassName('public-id-headline')[0];
        let pk = this.document.cookie.substr('publicKey='.length, 40);
        helloHeaderElement.innerHTML = 'Your public ID is: ' + pk;
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
}