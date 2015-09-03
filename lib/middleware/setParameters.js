var BadRequestHttpError = require('../errors/httpError/badRequest');
var validate            = require('validate');
var _                   = require('lodash');

/**
 * @param {Function} paramsConfigFunction
 * @param {Object}   [options={}]
 * @param {Boolean}    [options.skipUndefinedParams=false]
 *
 * @returns {Function}
 */
module.exports = function(paramsConfigFunction, options) {
    options = options || {};

    var skipUndefinedParams = options.hasOwnProperty('skipUndefinedParams') ? options.skipUndefinedParams : false;

    return function(req, res, next) {
        var paramsConfig  = paramsConfigFunction(req);
        var requestParams = _.merge({}, req.query, req.body, req.params);

        validate(requestParams, paramsConfig)
            .then(function(params) {
                if (skipUndefinedParams) {
                    params = _.pick(params, function(value) {
                        return value !== undefined;
                    });
                }

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