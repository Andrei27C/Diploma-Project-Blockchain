let ContractDTO = function (request) {
    return {
        name: (request.name),
        address: (request.address)
    };
};

module.exports = {
    ContractDTO
};