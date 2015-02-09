var HttpError = require('../httpError');
var util      = require('util');
var _         = require('lodash');

/**
 * @param {Object|String} [paramsOrMessage]
 */
function ServerHttpError(paramsOrMessage) {
    var params = {};

    if (typeof paramsOrMessage === 'string') {
        params.message = paramsOrMessage;
    } else {
        _.merge(params, paramsOrMessage);
    }

    params.status  = 500;
    params.message = params.message || 'Server error';

    HttpError.call(this, params);
}

util.inherits(ServerHttpError, HttpError);

ServerHttpError.prototype.name = 'ServerHttpError';

module.exports = ServerHttpError;