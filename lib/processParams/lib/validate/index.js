var validateObject = require('./object');

/**
 * @param {Object} object
 * @param {Object} config
 *
 * @returns {Promise}
 */
function validate(object, config) {
    return validateObject(object, config, [], object);
}

validate.validators = {};

/**
 * @param {Object} $validators
 */
validate.setValidators = function($validators) {
    this.validators = $validators;
};

/**
 * @param {String} name
 *
 * @returns {Function}
 */
validate.getValidator = function(name) {
    return this.validators[name];
};

module.exports = validate;