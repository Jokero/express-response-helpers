exports.errors      = require('./lib/errors');
exports.mapObject   = require('./lib/mapObject');
exports.transformer = require('transformer');

exports.middleware  = {
    addToResponseSendDataMethod:       require('./lib/middleware/addToResponseSendDataMethod'),
    addToResponseSendObjectMethod:     require('./lib/middleware/addToResponseSendObjectMethod'),
    addToResponseSendCollectionMethod: require('./lib/middleware/addToResponseSendCollectionMethod'),
    setParameters:                     require('./lib/middleware/setParameters'),
    fetchObject:                       require('./lib/middleware/fetchObject'),
    setFormat:                         require('./lib/middleware/setFormat')
};