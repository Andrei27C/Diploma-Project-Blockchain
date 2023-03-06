let enums = require('../models/enums');
let testDAO = require('../eth-dao/test-contract-dao');
let accountDao = require('../db-dao/accounts-dao.js');
let contractDao = require('../db-dao/contracts-dao.js');

function deploy(username, value, callback) {
    accountDao.findCredentialsByUsername(username, function (err, account) {
        if (err) {
            return callback(err);
        }
        testDAO.deploy(account.address, account.passphrase, value,
            function (err, contract_address) {
                if (err) {
                    return callback(err);
                }
                contractDao.addContractWithOwner(username, contract_address, account.address, enums.ContractType.TEST);
                return callback(null, contract_address);
            });
    });
}

function setNumber(username, value, callback) {
    accountDao.findCredentialsByUsername(username, function (err, account) {
        if (err) {
            return callback(err);
        }
        contractDao.findContractByTypeAndOwner(enums.ContractType.TEST, account.address, function (err, contract) {
            if (err) {
                return callback(err);
            }
            testDAO.setNumber(account.address, account.passphrase, contract.address, value,
                function (err, event) {
                    if (err) {
                        return callback(err);
                    }
                    return callback(null, event);
                });
        });
    });
}

function getNumber(username, callback) {
    accountDao.findCredentialsByUsername(username, function (err, account) {
        if (err) {
            return callback(err);
        }
        contractDao.findContractByTypeAndOwner(enums.ContractType.TEST, account.address, function (err, contract) {
            if (err) {
                return callback(err);
            }
            testDAO.getNumber(contract.address, function (err, result) {
                if (err) {
                    return callback(err);
                }
                console.log(result);
                return callback(null, result);
            });
        });
    });
}

module.exports = {
    deploy,
    setNumber,
    getNumber
}