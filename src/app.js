const express = require('express')
const web3js = require('web3')

const app = express()
const port = 3000
var myAccount;

app.use(express.static('src/public'))
app.use(express.static('src/node_modules'))
app.use(express.static('public'))

app.get('/getRandom', (req, res) => {
    myContract.methods.getRandom.call({
        gas: '41907'
    }).then(function (result) {
        console.log(result);
        return res.send(result);
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
app.get('/addToGame', (req, res) => {
    let playerPk = req.query['pk'];
    let gameIndex = req.query['gameIndex']
    res.json(true)
})
app.get('/getListOfGames', (req, res) => {
    let games = [{
        Name: 'best game ever',
        Players: 'Itzik, Micha, Shimon, Edna'
    }, {
        Name: 'greatet game ever',
        Players: 'Netanel, Ron, Shmulik, Ziva'
    }]
    res.json(games)
})
app.get('/createNewGame', (req, res) => {
    let gameName = req.query['gameName']
    res.json(gameName == 'x')
})
app.get('/useJokerCard', (req, res) => {
    let pk = req.query['pk'];
    res.json(pk % 2 == 0);
})
app.get('/useSwapCards', (req, res) => {
    let pk = req.query['pk'];
    let victimPk = req.query['victimPk'];
    res.json(pk % 2 == 0);
})
app.get('/useSneakyPeaky', (req, res) => {
    let pk = req.query['pk'];
    let victimPk = req.query['victimPk'];
    res.json(pk % 2 == 0);
})
app.get('/leaveGame', (req, res) => {
    let pk = req.query['pk'];
    res.json(true);
})
app.get('/setPK', (req, res) => {
    let pk = req.query['pk'];
    load_contract(pk);
    res.json(true);
})
app.get('/payToUser',(req, res) =>{
    let amount = req.query['amount']
    let to = req.query['to']

    coinContract.methods.transfer.call({
        gas: '41907',
        recipient: to,
        amount: amount
    }).then(function (result) {
        console.log(result);
        return res.send(result);
    }).catch(function (error) {
        console.log(error);
        return res.send('Error ' + error)
    });
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

function load_contract(account) {
    //var account = '0x3ee54cf657411f96a956344f08683f2a550d5869'
    myAccount = account;
    var coinContractAddress = '0xb380812aba42f9acf517d5878dc9a7cdff3c522dd1a082c66a58b891900fc974'
    var coinABI = [{
            "constant": false,
            "inputs": [{
                    "name": "spender",
                    "type": "address"
                },
                {
                    "name": "value",
                    "type": "uint256"
                }
            ],
            "name": "approve",
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
            "inputs": [{
                    "name": "spender",
                    "type": "address"
                },
                {
                    "name": "subtractedValue",
                    "type": "uint256"
                }
            ],
            "name": "decreaseAllowance",
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
            "inputs": [{
                    "name": "spender",
                    "type": "address"
                },
                {
                    "name": "addedValue",
                    "type": "uint256"
                }
            ],
            "name": "increaseAllowance",
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
            "name": "renounceOwnership",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [{
                    "name": "recipient",
                    "type": "address"
                },
                {
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "transfer",
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
            "inputs": [{
                    "name": "sender",
                    "type": "address"
                },
                {
                    "name": "recipient",
                    "type": "address"
                },
                {
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "transferFrom",
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
            "inputs": [{
                "name": "newOwner",
                "type": "address"
            }],
            "name": "transferOwnership",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "fallback"
        },
        {
            "anonymous": false,
            "inputs": [{
                    "indexed": true,
                    "name": "previousOwner",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "name": "newOwner",
                    "type": "address"
                }
            ],
            "name": "OwnershipTransferred",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [{
                    "indexed": true,
                    "name": "from",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "name": "to",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "name": "value",
                    "type": "uint256"
                }
            ],
            "name": "Transfer",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [{
                    "indexed": true,
                    "name": "owner",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "name": "spender",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "name": "value",
                    "type": "uint256"
                }
            ],
            "name": "Approval",
            "type": "event"
        },
        {
            "constant": true,
            "inputs": [{
                    "name": "owner",
                    "type": "address"
                },
                {
                    "name": "spender",
                    "type": "address"
                }
            ],
            "name": "allowance",
            "outputs": [{
                "name": "",
                "type": "uint256"
            }],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [{
                "name": "account",
                "type": "address"
            }],
            "name": "balanceOf",
            "outputs": [{
                "name": "",
                "type": "uint256"
            }],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "decimals",
            "outputs": [{
                "name": "",
                "type": "uint8"
            }],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "isOwner",
            "outputs": [{
                "name": "",
                "type": "bool"
            }],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "name",
            "outputs": [{
                "name": "",
                "type": "string"
            }],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "owner",
            "outputs": [{
                "name": "",
                "type": "address"
            }],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "symbol",
            "outputs": [{
                "name": "",
                "type": "string"
            }],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "totalSupply",
            "outputs": [{
                "name": "",
                "type": "uint256"
            }],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "version",
            "outputs": [{
                "name": "",
                "type": "string"
            }],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        }
    ]
    var gameContractAddress = '';
    var gameABI = [];


    if (typeof web3 !== 'undefined') {
        var web3;
        web3 = new web3js(web3.currentProvider);
    } else {
        web3 = new web3js("https://ropsten.infura.io/v3/22156e2cbcd9492aa066ac25ccd14174");
    }
    gameContract = web3.eth.Contract(gameABI, gameContractAddress, {
        defaultAccount: account
    });
    coinContract = web3.eth.Contract(coinABI, coinContractAddress, {
        defaultAccount: account
    });
}