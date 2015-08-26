exports.errors      = require('./errors');
exports.loadRouters = require('./loadRouters');
exports.mapObject   = require('./mapObject');
exports.validate    = require('validate');

exports.middleware  = {
    addToResponseSendDataMethod:       require('./middleware/addToResponseSendDataMethod'),
    addToResponseSendObjectMethod:     require('./middleware/addToResponseSendObjectMethod'),
    addToResponseSendCollectionMethod: require('./middleware/addToResponseSendCollectionMethod'),
    setParameters:                     require('./middleware/setParameters'),
    fetchObject:                       require('./middleware/fetchObject'),
    setFormat:                         require('./middleware/setFormat')
};