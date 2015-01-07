module.exports = require('express');

exports.Router = require('./router');

exports.errors = require('./errors');

exports.validate = require('validate.js');

exports.addToResponseSendDataMethod   = require('./middleware/addToResponseSendDataMethod');
exports.addToResponseSendObjectMethod = require('./middleware/addToResponseSendObjectMethod');
exports.setActionParams               = require('./middleware/setActionParams');