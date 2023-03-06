let contract = require('./models/contract_table.js');
let ErrorHandling = require('../models/error-handling');

const sqlSelectByTypeAndOwner = "SELECT * FROM contracts where type like ? and owner like ? ";
const sqlAddContractWithOwner = "INSERT INTO contracts (name, address, owner, type) VALUES (?, ?, ?, ?)";

function findContractByTypeAndOwner(type, owner, callback) {
    db.query(sqlSelectByTypeAndOwner, [type, owner], (err, result) => {
        if (err) {
            return callback(ErrorHandling.factoryPartialErrorHandling(new createError.BadRequest("SQL error on findContractByTypeAndOwner")));
        }
        if (result.length < 1) {
            return callback(ErrorHandling.factoryPartialErrorHandling(new createError.NotFound("No SQL results on findContractByTypeAndOwner")));
        }
        if (result.length > 1) {
            return callback(ErrorHandling.factoryPartialErrorHandling(new createError.PreconditionFailed("Username is not unique findContractByTypeAndOwner")));
        }
        return callback(null, contract.ContractDTO(result[0]));
    });
}


function addContractWithOwner(name, address, owner, type) {
    db.query(sqlAddContractWithOwner, [name, address, owner, type], (err, result) => {
        if (err) {
            console.log(err);
        }
    });
}



module.exports = {
    addContractWithOwner: function (name, address, owner, type) {
        return addContractWithOwner(name, address, owner, type);
    },
    findContractByTypeAndOwner
};
