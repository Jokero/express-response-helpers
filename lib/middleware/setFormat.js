/**
 * @param {RegExp} regExp
 *
 * @returns {Function}
 */
module.exports = function(regExp) {
    return function(req, res, next, value, key) {
        if (regExp.test(req.params[key])) {
            next();
        } else {
            next('route');
        }
    };
};
