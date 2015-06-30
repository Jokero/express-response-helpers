var _ = require('lodash');

/**
 * @param {*} value
 *
 * @returns {Boolean}
 */
function isEmpty(value) {
    if (value === undefined || value === null || value === '') {
        return true;
    }

    if (value instanceof Array) {
        return value.length === 0;
    }

    if (value instanceof Object) {
        var hasNotEmptyField = function(object) {
            var field, value;

            for (field in object) {
                value = object[field];

                if (value instanceof Object) {
                    if (hasNotEmptyField(value)) {
                        return true;
                    }
                } else if (value !== undefined) {
                    return true;
                }
            }

            return false;
        };

        return !hasNotEmptyField(value);
    }
}

var validate = require('validate.js');

validate.validators.required = function(value, options) {
    options = _.extend({}, this.options, options);

    if (isEmpty(value)) {
        return options.message || 'required';
    }
};