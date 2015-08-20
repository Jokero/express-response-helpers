var HttpError = require('../httpError');
var util      = require('util');

/**
 * @param {Object|String} [paramsOrMessage]
 */
function ForbiddenHttpError(paramsOrMessage) {
    HttpError.call(this, 403, paramsOrMessage);
}

util.inherits(ForbiddenHttpError, HttpError);

module.exports = ForbiddenHttpError;