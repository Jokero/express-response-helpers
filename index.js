exports.HttpError         = require('./lib/httpError');
exports.transformResponse = require('./lib/transformResponse');
exports.transformer       = require('transformer');

exports.middleware  = {
    addToResponseSendDataMethod:   require('./lib/middleware/addToResponseSendDataMethod'),
    addToResponseSendObjectMethod: require('./lib/middleware/addToResponseSendObjectMethod'),
    setParameters:                 require('./lib/middleware/setParameters'),
    fetchObject:                   require('./lib/middleware/fetchObject'),
    setFormat:                     require('./lib/middleware/setFormat')
};