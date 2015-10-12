var http = require('http');
var util = require('util');

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
        Object.assign(params, paramsOrMessage);
    }

    this.name        = this.constructor.name;
    this.status      = status;
    this.code        = params.code;
    this.message     = params.message || http.STATUS_CODES[this.status];
    this.description = params.description;
    this.fields      = params.fields;
}

util.inherits(HttpError, Error);

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

    if (this.fields) {
        error.fields = this.fields;
    }
    
    return error;
};

module.exports = HttpError;
