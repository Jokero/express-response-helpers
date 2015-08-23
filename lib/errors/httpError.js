var http = require('http');
var util = require('util');
var _    = require('lodash');

/**
 * @param {Number}        status
 * @param {Object|String} [paramsOrMessage]
 */
function HttpError(status, paramsOrMessage) {
    Error.call(this);
    Error.captureStackTrace(this, this.constructor);

    var params = {};

    if (typeof paramsOrMessage === 'string') {
        params.message = paramsOrMessage;
    } else {
        _.merge(params, paramsOrMessage);
    }

    this.name        = this.constructor.name;
    this.status      = status;
    this.code        = params.code;
    this.message     = params.message || http.STATUS_CODES[this.status];
    this.description = params.description;
    this.fields      = params.fields || [];
}

util.inherits(HttpError, Error);

/**
 * @param {String} fieldName
 * @param {String} error
 *
 * @returns {BadRequestHttpError}
 */
HttpError.prototype.addErrorField = function(fieldName, error) {
    this.fields.push({
        field: fieldName,
        error: error
    });

    return this;
};

/**
 * @returns {Object}
 */
HttpError.prototype.toJSON = function() {
    var error = {
        message: this.message
    };

    if (this.code) {
        error.code = this.code;
    }

    if (this.description) {
        error.description = this.description;
    }

    if (this.fields.length) {
        error.fields = this.fields;
    }
    
    return error;
};

module.exports = HttpError;
