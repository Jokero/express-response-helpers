var HttpError = require('../httpError');
var util      = require('util');

/**
 * @param {Object} params
 */
function ForbiddenHttpError(params) {
    params         = params || {};
    params.status  = 403;
    params.message = params.message || 'Forbidden';

    HttpError.call(this, params);
}

util.inherits(ForbiddenHttpError, HttpError);

ForbiddenHttpError.prototype.name = 'ForbiddenHttpError';

module.exports = ForbiddenHttpError;