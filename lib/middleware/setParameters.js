var BadRequestHttpError = require('../errors/httpError/badRequest');
var processParams       = require('../processParams');
var _                   = require('lodash');

/**
 * @param {Function} paramsConfigFunction
 *
 * @returns {Function}
 */
module.exports = function(paramsConfigFunction) {
    return function(req, res, next) {
        var paramsConfig  = paramsConfigFunction(req);
        var requestParams = _.merge({}, req.query, req.body, req.params);

        processParams(requestParams, paramsConfig)
            .then(function(params) {
                req.parameters = params;
                next();
            })
            .catch(function(errors) {
                var err;

                if (errors instanceof Error) {
                    err = errors;
                } else {
                    err = new BadRequestHttpError();

                    _.forOwn(errors, function(fieldErrors, fieldName) {
                        err.addErrorField(fieldName, fieldErrors[0]);
                    });
                }

                next(err);
            });
    };
};