var HttpError = require('../httpError');
var util      = require('util');

/**
 * @param {Object} params
 */
function NotFoundHttpError(params) {
    params         = params || {};
    params.status  = 404;
    params.message = params.message || 'Not found';

    HttpError.call(this, params);
}

util.inherits(NotFoundHttpError, HttpError);

NotFoundHttpError.prototype.name = 'NotFoundHttpError';

module.exports = NotFoundHttpError;