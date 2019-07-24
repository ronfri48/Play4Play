const express = require('express')
const web3js = require('web3')

const app = express()
const port = 3000
var myAccount;
var web3;

app.use(express.static('src/public'))
app.use(express.static('src/node_modules'))
app.use(express.static('public'))


app.get('/getMyCards', (req, res) => {
    let input = web3.utils.toHex('0x3EE54CF657411F96A956344f08683f2a550d5869')
    let xgas = web3.utils.toHex(30000)

    gameContract.methods.getPlayerCards(input).call({
        gas: xgas
    }).then(function (result) {
        console.log(result);
        return res.send(result);
    }).catch(function (error) {
        console.log(error);
        return res.send('Error ' + error)
    });
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
    let messages = true;
    res.json(messages)
})
app.get('/requestCards', (req, res) => {
    let player = req.query['player'];
    let card = req.query['card'];


})
app.get('/addToGame', (req, res) => {
    let playerPk = req.query['pk'];
    let gameIndex = req.query['gameIndex'];

    if (pk != myAccount) {
        res.status(400).json('user cant run functions behalf of other user')
    }

    gameContract.methods.registerIntoGame.call({
        gas: '41907',
        _playerName: playerPk,
        gameIndex: 6, //TODO: chage this
    }).then(function (result) {
        console.log(result);
        return res.send(result);
    }).catch(function (error) {
        console.log(error);
        return res.send('Error ' + error)
    });

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
    if (pk != myAccount) {
        res.status(400).json('user cant run functions behalf of other user')
    }
    gameContract.methods.buyJoker.call({}).then(function (result) {
        console.log(result);
        return res.send(result);
    }).catch(function (error) {
        console.log(error);
        return res.send('Error ' + error)
    });
})
app.get('/useSwapCards', (req, res) => {
    let pk = req.query['pk'];
    let victimPk = req.query['victimPk'];
    if (pk != myAccount) {
        res.status(400).json('user cant run functions behalf of other user')
    }
    gameContract.methods.buySwapper.call({}).then(function (result) {
        console.log(result);
        gameContract.methods.SwapperUsed.call({
            _player: pk,
            _swappedPlayer: victimPk
        }).then(function (result) {
            console.log(result);
            return res.send(result);
        }).catch(function (error) {
            console.log(error);
            return res.send('Error ' + error)
        });
    }).catch(function (error) {
        console.log(error);
        return res.send('Error ' + error)
    });
})
app.get('/useSneakyPeaky', (req, res) => {
    let pk = req.query['pk'];
    let victimPk = req.query['victimPk'];

    if (pk != myAccount) {
        res.status(400).json('user cant run functions behalf of other user')
    }

    gameContract.methods.buyWatcher.call({}).then(function (result) {
        console.log(result);
        gameContract.methods.WatcherUsed.call({
            _player: pk,
            _watchedPlayer: victimPk
        }).then(function (result) {
            console.log(result);
            return res.send(result);
        }).catch(function (error) {
            console.log(error);
            return res.send('Error ' + error)
        });
    }).catch(function (error) {
        console.log(error);
        return res.send('Error ' + error)
    });
})
app.get('/leaveGame', (req, res) => {
    let pk = req.query['pk'];

    if (pk != myAccount) {
        res.status(400).json('user cant run functions behalf of other user')
    }

    gameContract.methods.teardownGame.call({}).then(function (result) {
        console.log(result);
        return res.send(result);
    }).catch(function (error) {
        console.log(error);
        return res.send('Error ' + error)
    });
})
app.get('/setPK', (req, res) => {
    let pk = req.query['pk'];
    load_contract(pk);
    res.json(true);
})
app.get('/payToUser', (req, res) => {
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
    var gameContractAddress = '0x2a1a4dc9cc7943dd8a2bda43ff0aaca08448c57b';
    var gameABI = [
        {
            "constant": false,
            "inputs": [],
            "name": "buyJoker",
            "outputs": [],
            "payable": true,
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_player",
                    "type": "address"
                }
            ],
            "name": "getPlayerCardsHashes",
            "outputs": [
                {
                    "name": "",
                    "type": "bytes32[]"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [],
            "name": "buySwapper",
            "outputs": [],
            "payable": true,
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [],
            "name": "teardownGame",
            "outputs": [
                {
                    "name": "",
                    "type": "address"
                },
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [],
            "name": "exitGame",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_player",
                    "type": "address"
                },
                {
                    "name": "_numberOfJokersToUse",
                    "type": "uint256"
                }
            ],
            "name": "findFours",
            "outputs": [
                {
                    "name": "",
                    "type": "string[]"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_playerToWatch",
                    "type": "address"
                }
            ],
            "name": "watchCards",
            "outputs": [
                {
                    "components": [
                        {
                            "name": "name",
                            "type": "string"
                        },
                        {
                            "name": "family",
                            "type": "string"
                        }
                    ],
                    "name": "",
                    "type": "tuple[]"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "components": [
                        {
                            "name": "name",
                            "type": "string"
                        },
                        {
                            "name": "family",
                            "type": "string"
                        }
                    ],
                    "name": "_card",
                    "type": "tuple"
                }
            ],
            "name": "getHash",
            "outputs": [
                {
                    "name": "",
                    "type": "bytes32"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [],
            "name": "closeGame",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_player",
                    "type": "address"
                }
            ],
            "name": "getPrettyPlayerCards",
            "outputs": [
                {
                    "name": "",
                    "type": "string[]"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [],
            "name": "evenGame",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "_name",
                    "type": "string"
                }
            ],
            "name": "getHashForCard",
            "outputs": [
                {
                    "name": "",
                    "type": "bytes32"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_playerName",
                    "type": "string"
                }
            ],
            "name": "registerIntoGame",
            "outputs": [
                {
                    "name": "",
                    "type": "string"
                }
            ],
            "payable": true,
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "_player",
                    "type": "address"
                }
            ],
            "name": "getPlayerCards",
            "outputs": [
                {
                    "components": [
                        {
                            "name": "name",
                            "type": "string"
                        },
                        {
                            "name": "family",
                            "type": "string"
                        }
                    ],
                    "name": "",
                    "type": "tuple[]"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "isGameRunning",
            "outputs": [
                {
                    "name": "",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "getPlayersNames",
            "outputs": [
                {
                    "name": "",
                    "type": "string[]"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_player",
                    "type": "address"
                }
            ],
            "name": "goToNextPlayer",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [],
            "name": "buyWatcher",
            "outputs": [],
            "payable": true,
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_src",
                    "type": "address"
                },
                {
                    "name": "_cardName",
                    "type": "string"
                }
            ],
            "name": "moveCard",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_playerToSwapWith",
                    "type": "address"
                }
            ],
            "name": "swapCards",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "payable": true,
            "stateMutability": "payable",
            "type": "constructor"
        },
        {
            "payable": true,
            "stateMutability": "payable",
            "type": "fallback"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "name": "_contract",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "name": "_player",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "name": "_amount",
                    "type": "uint256"
                }
            ],
            "name": "PlayerDeposit",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "name": "_contract",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "name": "_player",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "name": "_amount",
                    "type": "uint256"
                }
            ],
            "name": "PlayerWithdrawal",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "name": "_src",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "name": "_dst",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "name": "_cardName",
                    "type": "string"
                }
            ],
            "name": "CardMove",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "name": "_player",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "name": "_cardFamily",
                    "type": "string"
                }
            ],
            "name": "FourFound",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "name": "_player",
                    "type": "address"
                }
            ],
            "name": "JokerUsed",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "name": "_player",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "name": "_swappedPlayer",
                    "type": "address"
                }
            ],
            "name": "SwapperUsed",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "name": "_player",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "name": "_watchedPlayer",
                    "type": "address"
                }
            ],
            "name": "WatcherUsed",
            "type": "event"
        }
    ]

    if (typeof web3 !== 'undefined') {

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