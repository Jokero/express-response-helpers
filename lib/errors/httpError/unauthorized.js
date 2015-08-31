var HttpError = require('../httpError');
var util      = require('util');

/**
 * @param {Object|String} [paramsOrMessage]
 */
function UnauthorizedHttpError(paramsOrMessage) {
    HttpError.call(this, 401, paramsOrMessage);
}

util.inherits(UnauthorizedHttpError, HttpError);

module.exports = UnauthorizedHttpError;