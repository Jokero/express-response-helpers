var HttpError = require('../httpError');
var util      = require('util');

/**
 * @param {Object|String} [paramsOrMessage]
 */
function NotImplementedHttpError(paramsOrMessage) {
    HttpError.call(this, 501, paramsOrMessage);
}

util.inherits(NotImplementedHttpError, HttpError);

module.exports = NotImplementedHttpError;