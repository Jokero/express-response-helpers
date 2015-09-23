exports.errors           = require('./errors');
exports.mapObject        = require('./mapObject');
exports.mongoosePaginate = require('./mongoosePaginate');
exports.validate         = require('validate');

exports.middleware  = {
    addToResponseSendDataMethod:   require('./middleware/addToResponseSendDataMethod'),
    addToResponseSendObjectMethod: require('./middleware/addToResponseSendObjectMethod'),
    setParameters:                 require('./middleware/setParameters'),
    fetchObject:                   require('./middleware/fetchObject'),
    setFormat:                     require('./middleware/setFormat')
};