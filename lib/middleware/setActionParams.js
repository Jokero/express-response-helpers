var validate            = require('validate.js');
var q                   = require('q');
var _                   = require('lodash');
var BadRequestHttpError = require('../errors/httpError/badRequest');

/**
 * @param {Object} config
 * @param {Object}   config.params
 * @param {Object}   [config.filters]
 * @param {Object}   [config.validators]
 *
 * @returns {Function}
 */
module.exports = function(config) {
    return function(req, res, next) {
        var requestParams = _.merge({}, req.query, req.body, req.params);

        var paramsNames         = Object.keys(config.params);
        var pickedRequestParams = _.pick(requestParams, paramsNames);

        var params = _.merge({}, config.params, pickedRequestParams);

        if (config.filters) {
            _.forOwn(config.filters, function(filterFunction, paramName) {
                params[paramName] = filterFunction(params[paramName]);
            });
        }

        var promise = q.when();

        if (config.validators) {
            promise = validate.async(params, config.validators, {
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