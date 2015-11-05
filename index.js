exports.transformRequest  = require('./lib/transformRequest');
exports.transformResponse = require('./lib/transformResponse');
exports.transformer       = require('transformer');
exports.HttpError         = require('http-error');

exports.middleware  = {
    addToResponseSendDataMethod:   require('./lib/middleware/addToResponseSendDataMethod'),
    addToResponseSendObjectMethod: require('./lib/middleware/addToResponseSendObjectMethod'),
    fetchObject:                   require('./lib/middleware/fetchObject'),
    setFormat:                     require('./lib/middleware/setFormat')
};