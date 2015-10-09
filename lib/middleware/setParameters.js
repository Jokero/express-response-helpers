var BadRequestHttpError = require('../errors/httpError/badRequest');
var transformer         = require('transformer');
var _                   = require('lodash');

/**
 * @param {Function} paramsConfigFunction
 * @param {Object}   [options={}]
 * @param {Boolean}    [options.dropFirstLevelUndefinedParams=false]
 *
 * @returns {Function}
 */
module.exports = function(paramsConfigFunction, options) {
    options = options || {};

    var dropFirstLevelUndefinedParams = options.dropFirstLevelUndefinedParams || false;

    return function(req, res, next) {
        req.rawParameters = _.merge({}, req.query, req.body, req.params);

        var paramsConfig = paramsConfigFunction(req);
        if (dropFirstLevelUndefinedParams) {
            paramsConfig = transformer.utils.dropFirstLevelUndefinedPropertiesConfig(req.rawParameters, paramsConfig);
        }

        transformer(req.rawParameters, paramsConfig)
            .clean()
            .filter()
            .setDefaults()
            .validate()
            .result
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