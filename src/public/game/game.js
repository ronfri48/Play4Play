var test = document.getElementById("testme")
test.innerText = "Phase 1";

import Web3 from 'web3';
import Eth from 'web3-eth';

// "Web3.givenProvider" will be set if in an Ethereum supported browser.
const eth = new Eth(Web3.givenProvider || 'ws://some.local-or-remote.node:8546', null, options);


// or using the web3 umbrella package
const web3 = new Web3(Web3.givenProvider || 'ws://some.local-or-remote.node:8546', null, options);


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

test.innerText = "Phase 2";