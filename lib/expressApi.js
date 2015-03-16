exports.Router      = require('./router');
exports.errors      = require('./errors');
exports.validate    = require('validate.js');
exports.loadRouters = require('./loadRouters');

exports.middleware  = {
    addToResponseSendDataMethod:   require('./middleware/addToResponseSendDataMethod'),
    addToResponseSendObjectMethod: require('./middleware/addToResponseSendObjectMethod'),
    setParameters:                 require('./middleware/setParameters')
};