var HttpError = require('../httpError');
var util      = require('util');
var _         = require('lodash');

/**
 * @param {Object|String} [paramsOrMessage]
 */
function ForbiddenHttpError(paramsOrMessage) {
    var params = {};

    if (typeof paramsOrMessage === 'string') {
        params.message = paramsOrMessage;
    } else {
        _.merge(params, paramsOrMessage);
    }

    params.status  = 403;
    params.message = params.message || 'Forbidden';

    HttpError.call(this, params);
}

util.inherits(ForbiddenHttpError, HttpError);

ForbiddenHttpError.prototype.name = 'ForbiddenHttpError';

module.exports = ForbiddenHttpError;