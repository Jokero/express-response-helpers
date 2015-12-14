exports.transformResponse = require('./lib/transformResponse');

exports.middleware  = {
    addToSendDataMethod:   require('./lib/middleware/addSendDataMethod'),
    addToSendObjectMethod: require('./lib/middleware/addSendObjectMethod')
};