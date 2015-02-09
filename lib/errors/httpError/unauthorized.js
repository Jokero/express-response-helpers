var HttpError = require('../httpError');
var util      = require('util');
var _         = require('lodash');

/**
 * @param {Object|String} [paramsOrMessage]
 */
function UnauthorizedHttpError(paramsOrMessage) {
    var params = {};

    if (typeof paramsOrMessage === 'string') {
        params.message = paramsOrMessage;
    } else {
        _.merge(params, paramsOrMessage);
    }

    params.status  = 401;
    params.message = params.message || 'Unauthorized';

    HttpError.call(this, params);
}

util.inherits(UnauthorizedHttpError, HttpError);

UnauthorizedHttpError.prototype.name = 'UnauthorizedHttpError';

module.exports = UnauthorizedHttpError;