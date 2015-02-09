var HttpError = require('../httpError');
var util      = require('util');
var _         = require('lodash');

/**
 * @param {Object|String} [paramsOrMessage]
 */
function BadRequestHttpError(paramsOrMessage) {
    var params = {};

    if (typeof paramsOrMessage === 'string') {
        params.message = paramsOrMessage;
    } else {
        _.merge(params, paramsOrMessage);
    }

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