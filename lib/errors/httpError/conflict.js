var HttpError = require('../httpError');
var util      = require('util');

/**
 * @param {Object|String} [paramsOrMessage]
 */
function ConflictHttpError(paramsOrMessage) {
    HttpError.call(this, 409, paramsOrMessage);
}

util.inherits(ConflictHttpError, HttpError);

module.exports = ConflictHttpError;