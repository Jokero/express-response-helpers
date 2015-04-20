var validate            = require('validate.js');
var _                   = require('lodash');
var BadRequestHttpError = require('../errors/httpError/badRequest');

/**
 * @param {Function} paramsConfigFunction
 *
 * @returns {Function}
 */
module.exports = function(paramsConfigFunction) {
    return function(req, res, next) {
        var paramsConfig  = paramsConfigFunction(req);
        var requestParams = _.merge({}, req.query, req.body, req.params);

        var paramsNames         = Object.keys(paramsConfig.params);
        var pickedRequestParams = _.pick(requestParams, paramsNames);

        var params = _.merge({}, paramsConfig.params, pickedRequestParams);

        if (paramsConfig.filters) {
            _.forOwn(paramsConfig.filters, function(filterFunction, paramName) {
                params[paramName] = filterFunction(params[paramName]);
            });
        }

        var promise = Promise.resolve();

        if (paramsConfig.validators) {
            promise = validate.async(params, paramsConfig.validators, {
                fullMessages: false
            });
        }

        promise
            .then(function() {
                req.parameters = params;
                next();
            })
            .catch(function(errors) {
                var err = new BadRequestHttpError();

                _.forOwn(errors, function(fieldErrors, fieldName) {
                    err.addErrorField(fieldName, fieldErrors[0]);
                });

                next(err);
            });
    };
};