var HttpError   = require('../httpError');
var transformer = require('transformer');
var _           = require('lodash');

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
            .filter()
            .setDefaults()
            .validate()
            .clean()
            .result
            .then(function(params) {
                req.parameters = params;
                next();
            })
            .catch(function(err) {
                if (!(err instanceof Error)) {
                    err = new HttpError.BadRequest({ fields: err });
                }

                next(err);
            });
    };
};