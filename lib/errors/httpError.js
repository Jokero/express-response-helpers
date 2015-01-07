var http = require('http');
var util = require('util');
var _    = require('lodash');

/**
 * @param {Object} params
 */
function HttpError(params) {
    Error.call(this);
    Error.captureStackTrace(this, HttpError);

    params           = params || {};
    this.status      = params.status;
    this.code        = params.code;
    this.message     = params.message || http.STATUS_CODES[params.status];
    this.description = params.description;
    this.fields      = params.fields || [];
}

util.inherits(HttpError, Error);

HttpError.prototype.name = 'HttpError';

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

    if (!_.isEmpty(this.fields)) {
        error.fields = this.fields;
    }
    
    return error;
};

module.exports = HttpError;