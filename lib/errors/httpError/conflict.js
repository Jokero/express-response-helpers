var HttpError = require('../httpError');
var util      = require('util');
var _         = require('lodash');

/**
 * @param {Object|String} [paramsOrMessage]
 */
function ConflictHttpError(paramsOrMessage) {
    var params = {};

    if (typeof paramsOrMessage === 'string') {
        params.message = paramsOrMessage;
    } else {
        _.merge(params, paramsOrMessage);
    }

    params.status  = 409;
    params.message = params.message || 'Conflict';

    HttpError.call(this, params);
}

util.inherits(ConflictHttpError, HttpError);

ConflictHttpError.prototype.name = 'ConflictHttpError';

module.exports = ConflictHttpError;