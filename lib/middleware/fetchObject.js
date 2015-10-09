var NotFoundHttpError = require('../errors/httpError/notFound');

/**
 * @param {Object} model
 * @param {Object} [options]
 * @param {String}   [options.modelFieldName=_id]
 * @param {String}   [options.reqPropertyNameWithObject]
 * @param {Boolean}  [options.needPassErrorToNext=true]
 *
 * @returns {Function}
 */
module.exports = function(model, options) {
    options = options || {};

    var modelFieldName = options.modelFieldName || '_id';

    var modelName                 = model.modelName;
    var objectName                = modelName[0].toLowerCase() + modelName.slice(1);
    var reqPropertyNameWithObject = options.reqPropertyNameWithObject || objectName;

    var needPassErrorToNext = options.hasOwnProperty('needPassErrorToNext') ? options.needPassErrorToNext : true;

    return function(req, res, next, value, key) {
        var conditions             = {};
        conditions[modelFieldName] = req.params[key];

        model.findOne(conditions)
            .then(function(object) {
                if (!object && needPassErrorToNext) {
                    return Promise.reject(new NotFoundHttpError('Object not found'));
                }

                req[reqPropertyNameWithObject] = object;

                next();
            })
            .catch(next);
    };
};
