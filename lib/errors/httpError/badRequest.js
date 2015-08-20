var HttpError = require('../httpError');
var util      = require('util');

/**
 * @param {Object|String} [paramsOrMessage]
 */
function BadRequestHttpError(paramsOrMessage) {
    HttpError.call(this, 400, paramsOrMessage);
}

util.inherits(BadRequestHttpError, HttpError);

/**
 * @param {String} fieldName
 * @param {String} error
 *
 * @returns {BadRequestHttpError}
 */
BadRequestHttpError.prototype.addErrorField = function(fieldName, error) {
    this.fields.push({
        field: fieldName,
        error: error
    });

    return this;
};

module.exports = BadRequestHttpError;