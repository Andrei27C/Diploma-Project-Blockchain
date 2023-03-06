const fs = require("fs");
const common = require('./eth-common-dao.js');
const abi = require('../../build/contracts/TestContract').abi;
const bin_data = require('../../build/contracts/TestContract').bytecode;
let ErrorHandling = require('../models/error-handling');

function deploy(account, passphrase, value, callback) {
    console.log("[TEST CONTRACT DEPLOY] Unlock Account...");
    web3.eth.personal.unlockAccount(account, passphrase, null).then(() => {
        web3.eth.getBalance(account).then((balance) => {
            console.log("[TEST CONTRACT DEPLOY] available balance: " + balance);
            console.log("[TEST CONTRACT DEPLOY] required gas: " + common.TRANSACTION_PARAMETERS.GAS * common.TRANSACTION_PARAMETERS.GAS_PRICE);
            let myContract = new web3.eth.Contract(abi);
            myContract.transactionConfirmationBlocks = 1;
            console.log("[TEST CONTRACT DEPLOY]... ");
            console.log(bin_data);
            myContract.deploy({
                data: bin_data,
                arguments: [value]
            }).send({
                from: account,
                gas: common.TRANSACTION_PARAMETERS.GAS,
                gasPrice: common.TRANSACTION_PARAMETERS.GAS_PRICE
            }).on('error', (error) => {
                return callback(ErrorHandling.factoryPartialErrorHandling("EVM revert", "deploy failed"), null);
            }).on('transactionHash', (testContractDeployTransactionHash) => {
                console.log("[TEST CONTRACT DEPLOY] - TX HASH: " + testContractDeployTransactionHash);
            }).then((newTestContractInstance) => {
                console.log(newTestContractInstance.options.address);
                return callback(null, newTestContractInstance.options.address);
            });
        });
    });
}

function setNumber(account, passphrase, contract_address, value, callback) {
    console.log("[TEST CONTRACT setNumber] Unlock Account...");
    web3.eth.personal.unlockAccount(account, passphrase, null).then(() => {
        const testContract = new web3.eth.Contract(abi, contract_address);
        testContract.transactionConfirmationBlocks = 1;
        testContract.methods.setNumber(value).send({
            from: account,
            gas: common.TRANSACTION_PARAMETERS.GAS,
            gasPrice: common.TRANSACTION_PARAMETERS.GAS_PRICE
        }).on('error', (error) => {
            return callback(ErrorHandling.factoryPartialErrorHandling(new createError.InternalServerError("EVM revert on setNumber-setNumber")));
        }).on('transactionHash', (monitoredTtransactionHash) => {
            console.log("[TEST CONTRACT setNumber] TX HASH: " + monitoredTtransactionHash);
        }).then((result) => {
            console.log(result);
            return callback(null, result);
        });
    }).catch((err) => {
        console.log(err);
        return callback(ErrorHandling.factoryPartialErrorHandling(new createError.InternalServerError("EVM revert on setNumber-unlockAccount")));
    });
}

function getNumber(contract_address, callback) {
    const testContract = new web3.eth.Contract(abi, contract_address);
    testContract.methods.getNumber().call().then((result) => {
        console.log(result);
        return callback(null, result);
    }).catch(() => {
        return callback(ErrorHandling.factoryPartialErrorHandling(new createError.InternalServerError("EVM revert on getNumber-getNumber")));
    });
}

module.exports = {
    deploy,
    getNumber,
    setNumber
}
