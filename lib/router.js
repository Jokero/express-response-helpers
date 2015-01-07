var express = require('express');

/**
 * @param {Object} options
 *
 * @returns {express.Router}
 */
module.exports = function(options) {
    options = options || {};

    var router = express.Router(options);

    router.param(function(name, regExp) {
        if (regExp instanceof RegExp) {
            return function(req, res, next, value) {
                if (regExp.test(value)) {
                    next();
                } else {
                    next('route');
                }
            };
        }
    });

    return router;
};