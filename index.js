exports.transformResponse = require('./lib/transformResponse');
exports.transformer       = require('transformer');
exports.HttpError         = require('http-error');

exports.middleware  = {
    addToResponseSendDataMethod:   require('./lib/middleware/addToResponseSendDataMethod'),
    addToResponseSendObjectMethod: require('./lib/middleware/addToResponseSendObjectMethod'),
    setParameters:                 require('./lib/middleware/setParameters'),
    fetchObject:                   require('./lib/middleware/fetchObject'),
    setFormat:                     require('./lib/middleware/setFormat')
};