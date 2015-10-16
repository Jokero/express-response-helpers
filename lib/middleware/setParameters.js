var HttpError   = require('http-error');
var transformer = require('transformer');
var _           = require('lodash');

/**
 * @param {Function} paramsConfigFunction
 *
 * @returns {Function}
 */
module.exports = function(paramsConfigFunction) {
    return function(req, res, next) {
        req.rawParameters = _.merge({}, req.query, req.body, req.params);

        transformer(req.rawParameters, paramsConfigFunction(req))
            .setDefaults()
            .filter()
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