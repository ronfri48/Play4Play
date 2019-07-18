const express = require('express')
const fs = require('file-system')
const app = express()
const port = 3000

app.use(express.static('src/public'))
app.use(express.static('src/node_modules'))
app.use(express.static('public'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

let credFileName = 'credentials.json';
if (fs.existsSync(credFileName)) {
    var rawdata = fs.readFileSync(credFileName);
} else {
    var rawdata = fs.readFileSync('src/' + credFileName);
}

/*
// ATTENTION!
// this is a fake abi. here goes our real abi.
let abi = [{
        "constant": false,
        "inputs": [],
        "name": "getRandom",
        "outputs": [{
            "name": "",
            "type": "bool"
        }],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [],
        "name": "Netane1",
        "outputs": [],
        "payable": true,
        "stateMutability": "payable",
        "type": "function"
    }
];
let MyContract = web3.eth.contract();
let ContractInstance = MyContract.at("0x925d81c01d878899adbb7d38f84ce9d5284fa2e7")

*/