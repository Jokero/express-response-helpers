var HttpError = require('../httpError');
var util      = require('util');

/**
 * @param {Object} params
 */
function ConflictHttpError(params) {
    params         = params || {};
    params.status  = 409;
    params.message = params.message || 'Conflict';

    HttpError.call(this, params);
}

util.inherits(ConflictHttpError, HttpError);

ConflictHttpError.prototype.name = 'ConflictHttpError';

module.exports = ConflictHttpError;