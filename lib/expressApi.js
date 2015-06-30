exports.Router        = require('./router');
exports.errors        = require('./errors');
exports.loadRouters   = require('./loadRouters');
exports.processParams = require('./processParams');

require('./validators/required');
exports.validate = require('validate.js');

exports.middleware  = {
    addToResponseSendDataMethod:       require('./middleware/addToResponseSendDataMethod'),
    addToResponseSendObjectMethod:     require('./middleware/addToResponseSendObjectMethod'),
    addToResponseSendCollectionMethod: require('./middleware/addToResponseSendCollectionMethod'),
    setParameters:                     require('./middleware/setParameters'),
    fetchObject:                       require('./middleware/fetchObject')
};