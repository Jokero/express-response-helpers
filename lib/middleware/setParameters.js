var transformRequest = require('../transformRequest');
var _                = require('lodash');

/**
 * @param {Function} paramsConfigFunction
 * @param {Object}   [options]
 * @param {Function}   options.errorFactory
 * @param {String}     [options.rawParamsName=rawParameters]
 * @param {String}     [options.paramsName=parameters]
 *
 * @returns {Function}
 */
function setParameters(paramsConfigFunction, options) {
    options = Object.assign({}, setParameters.options, options);

    var errorFactory = options.errorFactory;
    if (!(errorFactory instanceof Function)) {
        throw new Error('errorFactory function must be set');
    }

    var rawParamsName = options.rawParamsName || 'rawParameters';
    var paramsName    = options.paramsName || 'parameters';

    return function(req, res, next) {
        req[rawParamsName] = _.merge({}, req.query, req.body, req.params);

        transformRequest(req[rawParamsName], paramsConfigFunction(req))
            .then(function(params) {
                req[paramsName] = params;
                next();
            })
            .catch(function(err) {
                if (!(err instanceof Error)) {
                    return next(errorFactory(err));
                }

                next(err);
            });
    };
}

module.exports = setParameters;