const express = require('express');
let router = express.Router();
const testContractBll = require('../eth-business/test-contract-bll');
const CURRENT_RESOURCE_NAME = "TEST";

let handleResponse = function (res, next, err, response) {
    if (err) {
        err.resource = CURRENT_RESOURCE_NAME;
        return next(err);
    }
    res.send(response);
};

router.get('/', function (req, res, next) {
    res.send("Test contract endpoint");
});

router.get('/deploy/:username/:value', function (req, res, next) {
    testContractBll.deploy(req.params.username, req.params.value, function (err, contractAddress) {
        handleResponse(res, next, err, contractAddress);
    });
});

router.get('/set-number/:username/:value', function (req, res, next) {
    testContractBll.setNumber(req.params.username, req.params.value, function (err, contractAddress) {
        handleResponse(res, next, err, contractAddress);
    });
});

router.get('/get-number/:username', function (req, res, next) {
    testContractBll.getNumber(req.params.username, function (err, value) {
        handleResponse(res, next, err, value);
    });
});

module.exports = router;