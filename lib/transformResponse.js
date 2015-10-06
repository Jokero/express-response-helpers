var transformer = require('transformer');

/**
 * @param {Object} object
 * @param {Object} config
 *
 * @returns {Object}
 */
module.exports = function(object, config) {
    if (object.toJSON instanceof Function) {
        object = object.toJSON();
    }

    return transformer(object, config).filter().clean().result;
};