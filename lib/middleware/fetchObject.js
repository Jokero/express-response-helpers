var HttpError = require('http-error');

/**
 * @param {Object|Function} modelOrFetchFn - Mongoose model or fetch function that returns a promise
 * @param {Object}          [options]
 * @param {String}            [options.fieldName=_id] - Only for model
 * @param {String}            [options.objectName] - Required for fetchFn
 * @param {Boolean}           [options.passErrorToNext=true]
 *
 * @returns {Function}
 */
module.exports = function(modelOrFetchFn, options) {
    options = options || {};

    var objectName      = options.objectName;
    var passErrorToNext = options.hasOwnProperty('passErrorToNext') ? options.passErrorToNext : true;

    var fetchFn;

    if (modelOrFetchFn.findOne instanceof Function) {
        var model     = modelOrFetchFn;
        var fieldName = options.fieldName || '_id';

        if (!objectName) {
            objectName = model.modelName[0].toLowerCase() + model.modelName.slice(1);
        }

        fetchFn = function(req, value) {
            return model.findOne({ [fieldName]: value });
        };
    } else {
        fetchFn = modelOrFetchFn;
        if (!objectName) {
            throw new Error('Object name for fetchFn must be set');
        }
    }

    return function(req, res, next, value, name) {
        fetchFn(req, req.params[name])
            .then(function(object) {
                if (!object && passErrorToNext) {
                    return Promise.reject(new HttpError.NotFound());
                }

                req[objectName] = object;

                next();
            })
            .catch(next);
    };
};