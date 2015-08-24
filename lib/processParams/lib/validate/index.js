var validateObject = require('./object');

/**
 * @param {Object} object
 * @param {Object} config
 *
 * @returns {Promise}
 */
module.exports = function validate(object, config) {
    return validateObject(object, config, [], object);
};