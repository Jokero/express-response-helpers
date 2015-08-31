var HttpError = require('../httpError');
var util      = require('util');

/**
 * @param {Object|String} [paramsOrMessage]
 */
function NotFoundHttpError(paramsOrMessage) {
    HttpError.call(this, 404, paramsOrMessage);
}

util.inherits(NotFoundHttpError, HttpError);

module.exports = NotFoundHttpError;