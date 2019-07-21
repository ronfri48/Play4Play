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