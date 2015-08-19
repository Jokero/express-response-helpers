/**
 * @param {RegExp} regExp
 *
 * @returns {Function}
 */
module.exports = function(regExp) {
    return function(req, res, next, value) {
        if (regExp.test(value)) {
            next();
        } else {
            next('route');
        }
    };
};