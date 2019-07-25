const defaultResults = require('./defaults.js')
const web3js = require('web3');
var config = require('./config.js');
var express = require('express');
var router = express.Router();
var myAccount;

var gas = 23000;

router.get('/getMyCards', (req, res) => {
    gameContract.methods.getPlayerCards(myAccount).call({
        gas: gas
    }).then(function (result) {
        console.log(result);
        return res.send(result);
    }).catch(function (error) {
        console.log(error);
        return res.send('Error ' + error)
    });
})
router.get('/getGameMessages', (req, res) => {
    let messages = ['player1 gave player2: hummus, bamba']
    res.json(messages)
})
router.get('/getPlayers', (req, res) => {
    let messages = ['player1', 'player2', 'player3']
    res.json(messages)
})
router.get('/isGameOn', (req, res) => {
    let messages = true;
    res.json(messages)
})
router.get('/requestCards', (req, res) => {
    let player = req.query['player'];
    let card = req.query['card'];


})
router.get('/addToGame', (req, res) => {
    let playerPk = req.query['pk'];
    let gameIndex = req.query['gameIndex'];

    if (pk != myAccount) {
        res.status(400).json('user cant run functions behalf of other user')
    }

    gameContract.methods.registerIntoGame(playerPk, 6).call({ //TODO: chage this 6 constant
        gas: gas
    }).then(function (result) {
        console.log(result);
        return res.send(result);
    }).catch(function (error) {
        console.log(error);
        return res.send('Error ' + error)
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
        return res.send(result);
    }).catch(function (error) {
        console.log(error);
        return res.send('Error ' + error)
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
router.get('/leaveGame', (req, res) => {
    let pk = req.query['pk'];

    if (pk != myAccount) {
        res.status(400).json('user cant run functions behalf of other user')
    }

    gameContract.methods.teardownGame().call({
        gas: gas
    }).then(function (result) {
        console.log(result);
        return res.send(result);
    }).catch(function (error) {
        console.log(error);
        return res.send('Error ' + error)
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
        return res.send(result);
    }).catch(function (error) {
        console.log(error);
        return res.send('Error ' + error)
    });
})


function loadContract(account) {
    //var account = '0x3ee54cf657411f96a956344f08683f2a550d5869'
    myAccount = account;
    var web3;

    if (typeof web3 !== 'undefined') {

        web3 = new web3js(web3.currentProvider);
    } else {
        web3 = new web3js("https://ropsten.infura.io/v3/22156e2cbcd9492aa066ac25ccd14174");
    }

    gameContract = web3.eth.Contract(config.gameABI, config.gameContractAddress, {
        defaultAccount: account
    });

    coinContract = web3.eth.Contract(config.coinABI, config.coinContractAddress, {
        defaultAccount: account
    });
}

module.exports = router;