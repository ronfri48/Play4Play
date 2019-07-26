const defaultResults = require('./defaults.js');
const web3js = require('web3');
var web3;
var config = require('./config.js');
var express = require('express');
var MerkleTree = require('merkletreejs');
var SHA256 = require("crypto-js/sha256");
var router = express.Router();
var myAccount;

var gas = 23000;

router.get('/getMyCards', (req, res) => {
    gameContract.methods.getPlayerCards(myAccount).call({
        gas: gas
    }).then(function (result) {
        console.log(result);
        if (result === null) {
            result = defaultResults.getMyCards
        }
        return res.send(result);
    }).catch(function (error) {
        console.log(error);
        return res.send({
            'Error': error
        })
    });
})
router.get('/getGameMessages', (req, res) => {
    let messages = null; //['player1 gave player2: hummus, bamba'];
    res.json(messages)
})
router.get('/getPlayers', (req, res) => {
    let messages = ['Ron', 'Shmulik', 'Ziva']
    res.json(messages)
})
router.get('/isGameOn', (req, res) => {
    gameContract.methods.isGameRunning().call({
        gas: gas
    }).then(function (isGameOn) {
        if (isGameOn == null) {
            return defaultResults.isGameOn;
        }
        res.json(isGameOn)
    }).catch(function (error) {
        res.json({
            'Error': error
        })
    })
})
router.get('/requestCards', (req, res) => {
    let player = req.query['player'];
    let card = req.query['card'];

    gameContract.methods.moveCard(player, card).call({
        gas: gas
    }).then(function (cardRequested) {
        console.log(cardRequested);
        let isLeagal = checkTurn(cardRequested, player);
        if (isLeagal) {
            finishTurn();
        }
        return res.send(isLeagal);
    }).catch(function (error) {
        console.log(error);
        return res.send({
            'Error': error
        })
    });
})
router.get('/addToGame', (req, res) => {
    let gameAddress = req.query['gameAddress'];

    gameContract = web3.eth.Contract(config.gameABI, gameAddress, {
        defaultAccount: myAccount
    });

    gameContract.methods.registerIntoGame(myAccount).call({
        gas: gas
    }).then(function (result) {
        console.log(result);
        if (result === null) {
            result = defaultResults.addToGame
        }
        return res.send(result);
    }).catch(function (error) {
        console.log(error);
        return res.status(200).send({
            'Error': error
        })
    });

})
router.get('/getListOfGames', (req, res) => {
    let games = [{
        Name: 'best game ever',
        Players: 'Itzik, Micha, Shimon, Edna'
    }, {
        Name: 'greatet game ever',
        Players: 'Netanel, Ron, Shmulik, Ziva'
    }]
    res.json(games)
})
router.get('/createNewGame', (req, res) => {
    let gameName = req.query['gameName']
    res.json(gameName == 'x')
})
router.get('/useJokerCard', (req, res) => {
    let pk = req.query['pk'];
    if (pk != myAccount) {
        res.status(400).json('user cant run functions behalf of other user')
    }
    gameContract.methods.buyJoker().call({
        gas: gas
    }).then(function (result) {
        console.log(result);
        if (result === null) {
            result = defaultResults.useJokerCard
        }
        return res.send(result);
    }).catch(function (error) {
        console.log(error);
        return res.send({
            'Error': error
        })
    });
})
router.get('/useSwapCards', (req, res) => {
    let pk = req.query['pk'];
    let victimPk = req.query['victimPk'];
    if (pk != myAccount) {
        res.status(400).json('user cant run functions behalf of other user')
    }
    gameContract.methods.buySwapper().call({
        gas: gas
    }).then(function (result) {
        console.log(result);
        gameContract.methods.SwapperUsed(pk, victimPk).call({
            gas: gas
        }).then(function (result) {
            console.log(result);
            if (result === null) {
                result = defaultResults.useSwapCards
            }
            return res.send(result);
        }).catch(function (error) {
            console.log(error);
            return res.send({
                'Error': error
            })
        });
    }).catch(function (error) {
        console.log(error);
        return res.send({
            'Error': error
        })
    });
})
router.get('/useSneakyPeaky', (req, res) => {
    let pk = req.query['pk'];
    let victimPk = req.query['victimPk'];

    if (pk != myAccount) {
        res.status(400).json('user cant run functions behalf of other user')
    }

    gameContract.methods.buyWatcher().call({
        gas: gas
    }).then(function (result) {
        console.log(result);
        gameContract.methods.WatcherUsed(pk, victimPk).call({
            gas: gas
        }).then(function (result) {
            console.log(result);
            if (result === null) {
                result = defaultResults.useSneakyPeaky
            }
            return res.send(result);
        }).catch(function (error) {
            console.log(error);
            return res.send({
                'Error': error
            })
        });
    }).catch(function (error) {
        console.log(error);
        return res.send({
            'Error': error
        })
    });
})
router.get('/leaveGame', (req, res) => {
    let pk = req.query['pk'];

    if (pk != myAccount) {
        res.status(400).json('user cant run functions behalf of other user')
    }

    gameContract.methods.teardownGame().call({
        gas: gas
    }).then(function (result) {
        console.log(result);
        if (result === null) {
            result = defaultResults.leaveGame
        }
        return res.send(result);
    }).catch(function (error) {
        console.log(error);
        return res.send({
            'Error': error
        })
    });
})
router.get('/setPK', (req, res) => {
    let pk = req.query['pk'];
    loadContract(pk);
    res.json(true);
})
router.get('/payToUser', (req, res) => {
    let amount = req.query['amount']
    let to = req.query['to']

    coinContract.methods.transfer(to, amount).call({
        gas: gas
    }).then(function (result) {
        console.log(result);
        if (result === null) {
            result = defaultResults.payToUser
        }
        return res.send(result);
    }).catch(function (error) {
        console.log(error);
        return res.send({
            'Error': error
        })
    });
})


function loadContract(account) {
    //var account = '0x3ee54cf657411f96a956344f08683f2a550d5869'
    myAccount = account;
    if (typeof web3 !== 'undefined') {

        web3 = new web3js(web3.currentProvider);
    } else {
        web3 = new web3js("https://ropsten.infura.io/v3/22156e2cbcd9492aa066ac25ccd14174");
    }

    coinContract = web3.eth.Contract(config.coinABI, config.coinContractAddress, {
        defaultAccount: account
    });
}

function QuartetHash(object) {
    return SHA256(JSON.stringify(object));
}

function generateMerkleTree(hashedLeaves) {
    return new MerkleTree.MerkleTree(hashedLeaves, QuartetHash, options = {
        hashLeaves: false
    });
}

function verifyValue(tree, valueToSearch) {
    let root = tree.getRoot();
    let proofNodes = tree.getRoot();

    return tree.verify(proofNodes, valueToSearch, root)
}

function checkTurn(cardRequested, player) {
    //if didnt get the card but it was found in the players hand
    if (cardRequested == null) {
        gameContract.methods.getPlayerCardsHashes(player).call({
            gas: gas
        }).then(function (playersHashedCards) {
            let tree = generateMerkleTree(playersHashedCards);
            let found = verifyValue(tree, cardRequested);
            return !found;
        }).catch(function (error) {
            console.log(error);
            return res.send({
                'Error': error
            })
        });
    }
}

function finishTurn() {
    //teardownGame
    //if end: pay & closeGame
    //if not end: moveToNextPlayer

    gameContract.methods.teardownGame().call({
        gas: gas
    }).then(function (whoToPay, amountToPay) {


        coinContract.methods.transfer(whoToPay, amountToPay).call({
            gas: gas
        }).catch(function (error) {
            return res.send({
                'Error': error
            })
        });


        gameContract.methods.closeGame().call({
            gas: gas
        }).then(function () {
            res.json(true)
        })

    }).catch(function () {
        gameContract.methods.moveToNextPlayer().call({
            gas: gas
        }).then(function () {
            res.json(true)
        }).catch(function (error) {
            res.json({
                'Error': error
            })
        })
    });
}


module.exports = router;