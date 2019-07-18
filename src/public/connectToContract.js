window.addEventListener('load', function () {

    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof web3 !== 'undefined') {
        // Use Mist/MetaMask's provider
        web3js = new Web3(web3.currentProvider);
    } else {}

    var contractAddress = "YOUR_CONTRACT_ADDRESS";
    var abi = "";
    var contract = new web3js.eth.Contract(abi, contractAddress);

})