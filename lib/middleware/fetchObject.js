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

    return function(req, res, next, id) {
        var condition             = {};
        condition[modelFieldName] = id;

        model.findOne(condition).exec()
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