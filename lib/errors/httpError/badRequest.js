var HttpError = require('../httpError');
var util      = require('util');

/**
 * @param {Object|String} [paramsOrMessage]
 */
function BadRequestHttpError(paramsOrMessage) {
    HttpError.call(this, 400, paramsOrMessage);
}

util.inherits(BadRequestHttpError, HttpError);

module.exports = BadRequestHttpError;