var HttpError = require('../httpError');
var util      = require('util');

/**
 * @param {Object} params
 */
function UnauthorizedHttpError(params) {
    params         = params || {};
    params.status  = 401;
    params.message = params.message || 'Unauthorized';

    HttpError.call(this, params);
}

util.inherits(UnauthorizedHttpError, HttpError);

UnauthorizedHttpError.prototype.name = 'UnauthorizedHttpError';

module.exports = UnauthorizedHttpError;