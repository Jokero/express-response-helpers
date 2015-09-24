var transformer = require('validate'); // todo: require('transformer');

/**
 * @param {Object} object
 * @param {Object} config
 *
 * @returns {Object}
 */
module.exports = function(object, config) {
    return transformer(object, config).filter().clean().result;
};