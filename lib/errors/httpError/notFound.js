var HttpError = require('../httpError');
var util      = require('util');
var _         = require('lodash');

/**
 * @param {Object|String} [paramsOrMessage]
 */
function NotFoundHttpError(paramsOrMessage) {
    var params = {};

    if (typeof paramsOrMessage === 'string') {
        params.message = paramsOrMessage;
    } else {
        _.merge(params, paramsOrMessage);
    }

    params.status  = 404;
    params.message = params.message || 'Not found';

    HttpError.call(this, params);
}

util.inherits(NotFoundHttpError, HttpError);

NotFoundHttpError.prototype.name = 'NotFoundHttpError';

module.exports = NotFoundHttpError;