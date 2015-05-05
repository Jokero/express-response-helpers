var NotFoundHttpError = require('../errors/httpError/notFound');

/**
 * @param {Object} model
 * @param {String} [objectPropertyNameInReq]
 *
 * @returns {Function}
 */
module.exports = function(model, objectPropertyNameInReq) {
    var modelName           = model.modelName;
    var objectName          = modelName[0].toLowerCase() + modelName.slice(1);
    objectPropertyNameInReq = objectPropertyNameInReq || objectName;

    return function(req, res, next, id) {
        model.findById(id).exec()
            .then(function(object) {
                if (!object) {
                    return Promise.reject(new NotFoundHttpError('Object not found'));
                }

                req[objectPropertyNameInReq] = object;

                next();
            })
            .catch(next);
    };
};