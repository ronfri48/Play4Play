const express = require('express')
const web3js = require('web3')

const app = express()
const port = 3000
var myContract, account, myContractAddress, myABI;
process.env.PWD = process.cwd()

app.use(express.static('src/public'))
app.use(express.static('src/node_modules'))
app.use(express.static('public'))

load_contract();

app.get('/getRandom', (req, res) => {
    myContract.methods.getRandom().call({
        gas: '41907'
    }).then(function (result) {
        console.log(result);
        return res.send('Received a GET HTTP method ' + result);
    }).catch(function (error) {
        console.log(error);
        return res.send('Error ' + error)
    });

});
app.get('/getMyCards', (req, res) => {

    //this is stub
    cards = [{
            type: 'banks',
            value: 'diskont'
        },
        {
            type: 'cities',
            value: 'jerusalem'
        },
        {
            type: 'food',
            value: 'bamba'
        },
        {
            type: 'food',
            value: 'humus'
        },
        {
            type: 'words',
            value: 'basa'
        },
        {
            type: 'words',
            value: 'sababa'
        }
    ]

    res.json(cards);
})
app.get('/getGameMessages', (req, res) => {
    let messages = ['player1 gave player2: hummus, bamba']
    res.json(messages)
})
app.get('/getPlayers', (req, res) => {
    let messages = ['player1', 'player2', 'player3']
    res.json(messages)
})
app.get('/isGameOn', (req, res) => {
    let messages = true
    res.json(messages)
})
app.get('/requestCards', (req, res) => {
    let player = req.query['player'];
    let card = req.query['card'];
    res.json(3)
})



app.listen(port, () => console.log(`Example app listening on port ${port}!`))

function load_contract() {
    var account = '0x3ee54cf657411f96a956344f08683f2a550d5869'
    var myContractAddress = '0x9fcd8366bc555f181a4dd02e2ddcf544c5cd8fee'
    var myABI = [{
            "constant": false,
            "inputs": [],
            "name": "getRandom",
            "outputs": [{
                "name": "",
                "type": "uint256"
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

    if (typeof web3 !== 'undefined') {
        var web3;
        web3 = new web3js(web3.currentProvider);
    } else {
        // set the provider you want from Web3.providers
        web3 = new web3js("https://ropsten.infura.io/v3/22156e2cbcd9492aa066ac25ccd14174");
    }
    myContract = web3.eth.Contract(myABI, myContractAddress, {
        defaultAccount: account
    });
}