var transformRequest = require('../transformRequest');
var _                = require('lodash');

/**
 * @param {Function}        paramsConfigFunction
 * @param {Object}          [options]
 * @param {Function}          [options.errorFactory]
 * @param {String|Function}   [options.errorMessage]
 * @param {String}            [options.rawParamsName=rawParameters]
 * @param {String}            [options.paramsName=parameters]
 *
 * @returns {Function}
 */
function setParameters(paramsConfigFunction, options) {
    options = Object.assign({}, setParameters.options, options);

    var errorMessageFunction = options.errorMessage instanceof Function ? options.errorMessage : function() {
        return options.errorMessage;
    };
    var errorFactory = options.errorFactory || function(message, errors) {
        var err = new Error(message);
        err.status = 400;
        err.errors = errors;
        return err;
    };

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
                    var errorMessage = errorMessageFunction(req);
                    return next(errorFactory(errorMessage, err));
                }

                next(err);
            });
    };
}

module.exports = setParameters;