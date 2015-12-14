exports.transformResponse = require('./lib/transformResponse');

exports.middleware  = {
    addSendDataMethod:   require('./lib/middleware/addSendDataMethod'),
    addSendObjectMethod: require('./lib/middleware/addSendObjectMethod')
};