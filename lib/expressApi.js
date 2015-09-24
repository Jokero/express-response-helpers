exports.errors            = require('./errors');
exports.transformResponse = require('./transformResponse');
exports.transformer       = require('validate');

exports.middleware  = {
    addToResponseSendDataMethod:   require('./middleware/addToResponseSendDataMethod'),
    addToResponseSendObjectMethod: require('./middleware/addToResponseSendObjectMethod'),
    setParameters:                 require('./middleware/setParameters'),
    fetchObject:                   require('./middleware/fetchObject'),
    setFormat:                     require('./middleware/setFormat')
};