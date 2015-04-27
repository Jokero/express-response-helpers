exports.Router      = require('./router');
exports.errors      = require('./errors');
exports.validate    = require('validate.js');
exports.loadRouters = require('./loadRouters');

exports.middleware  = {
    addToResponseSendDataMethod:       require('./middleware/addToResponseSendDataMethod'),
    addToResponseSendObjectMethod:     require('./middleware/addToResponseSendObjectMethod'),
    addToResponseSendCollectionMethod: require('./middleware/addToResponseSendCollectionMethod'),
    setParameters:                     require('./middleware/setParameters'),
    fetchObject:                       require('./middleware/fetchObject')
};