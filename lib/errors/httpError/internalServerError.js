var HttpError = require('../httpError');
var util      = require('util');

/**
 * @param {Object|String} [paramsOrMessage]
 */
function InternalServerHttpError(paramsOrMessage) {
    HttpError.call(this, 500, paramsOrMessage);
}

util.inherits(InternalServerHttpError, HttpError);

module.exports = InternalServerHttpError;