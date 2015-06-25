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
            var value;

            for (var key in object) {
                value = object[key];

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
    if (isEmpty(value)) {
        return options.message || 'required';
    }
};