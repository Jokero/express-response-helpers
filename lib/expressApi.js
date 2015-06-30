exports.Router        = require('./router');
exports.errors        = require('./errors');
exports.loadRouters   = require('./loadRouters');
exports.processParams = require('./processParams');

exports.middleware  = {
    addToResponseSendDataMethod:       require('./middleware/addToResponseSendDataMethod'),
    addToResponseSendObjectMethod:     require('./middleware/addToResponseSendObjectMethod'),
    addToResponseSendCollectionMethod: require('./middleware/addToResponseSendCollectionMethod'),
    setParameters:                     require('./middleware/setParameters'),
    fetchObject:                       require('./middleware/fetchObject')
};

require('./validators/required');
exports.validate = validate;