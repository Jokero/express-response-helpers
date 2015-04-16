var HttpError = require('../httpError');
var util      = require('util');
var _         = require('lodash');

/**
 * @param {Object|String} [paramsOrMessage]
 */
function NotImplementedHttpError(paramsOrMessage) {
    var params = {};

    if (typeof paramsOrMessage === 'string') {
        params.message = paramsOrMessage;
    } else {
        _.merge(params, paramsOrMessage);
    }

    params.status  = 501;
    params.message = params.message || 'Not ImplementedHttpError';

    HttpError.call(this, params);
}

util.inherits(NotImplementedHttpError, HttpError);

NotImplementedHttpError.prototype.name = 'NotImplementedHttpError';

module.exports = NotImplementedHttpError;