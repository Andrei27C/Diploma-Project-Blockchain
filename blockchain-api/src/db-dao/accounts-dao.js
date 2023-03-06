var user = require('./models/account.js');
let ErrorHandling = require('../models/error-handling');

const selectFromUserInnerJoinCredentials = "SELECT * FROM users inner join credentials on users.id = credentials.user_id ";
const sqlSelectByUsername = selectFromUserInnerJoinCredentials +
    "where credentials.username like ? ";

function queryCredentialsByUsername(username, callback) {
    db.query(sqlSelectByUsername, [username], (err, result) => {
        if (err) {
            return callback(ErrorHandling.factoryPartialErrorHandling(new createError.BadRequest("SQL error on queryCredentialsByUsername")));
        }
        if (result.length < 1) {
            return callback(ErrorHandling.factoryPartialErrorHandling(new createError.NotFound("No SQL results on queryCredentialsByUsername")));
        }
        if (result.length > 1) {
            return callback(ErrorHandling.factoryPartialErrorHandling(new createError.PreconditionFailed("Username is not unique queryCredentialsByUsername")));
        }
        console.log(result);

        return callback(null, user.CredentialsDTO(result[0]));
    });
}



module.exports = {
    findCredentialsByUsername: function (username, callback) {
        return queryCredentialsByUsername(username, callback);
    },
};
