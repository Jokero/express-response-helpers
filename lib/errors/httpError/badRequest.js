var HttpError = require('../httpError');
var util      = require('util');

/**
 * @param {Object} params
 */
function BadRequestHttpError(params) {
    params         = params || {};
    params.status  = 400;
    params.message = params.message || 'Bad Request';

    HttpError.call(this, params);
}

util.inherits(BadRequestHttpError, HttpError);

BadRequestHttpError.prototype.name = 'BadRequestHttpError';

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