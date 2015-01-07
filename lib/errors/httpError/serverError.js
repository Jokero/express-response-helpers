var HttpError = require('../httpError');
var util      = require('util');

/**
 * @param {Object} params
 */
function ServerHttpError(params) {
    params         = params || {};
    params.status  = 500;
    params.message = params.message || 'Server error';

    HttpError.call(this, params);
}

util.inherits(ServerHttpError, HttpError);

ServerHttpError.prototype.name = 'ServerHttpError';

module.exports = ServerHttpError;