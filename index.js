exports.errors            = require('./errors');
exports.transformResponse = require('./transformResponse');
exports.transformer       = require('validate');

exports.middleware  = {
    addToResponseSendDataMethod:   require('./lib/middleware/addToResponseSendDataMethod'),
    addToResponseSendObjectMethod: require('./lib/middleware/addToResponseSendObjectMethod'),
    setParameters:                 require('./lib/middleware/setParameters'),
    fetchObject:                   require('./lib/middleware/fetchObject'),
    setFormat:                     require('./lib/middleware/setFormat')
};