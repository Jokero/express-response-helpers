var validateJs = require('validate.js');
//TODO: Ansman's result and validators library
//TODO: Use multipleErrors option

var utils = {
    /**
     * @param {*} value
     *
     * @returns {*}
     */
    resultValue: function(value) {
        if (value instanceof Function) {
            var args = Array.prototype.slice.call(arguments, 1);
            value    = value.apply(null, args);
        }

        return value;
    }
};

/**
 * @param {Object} object
 * @param {Object} config
 *
 * @returns {Object}
 */
function transform(object, config) {
    var transformedObject = {};
    var field, fieldConfig, fieldValue;

    for (field in config) {
        fieldConfig = config[field];
        fieldValue  = object[field];

        if (fieldConfig === true) {
            transformedObject[field] = fieldValue;
        } else if (fieldConfig instanceof Object) {
            if (fieldConfig.properties instanceof Object) {
                if (fieldValue === undefined) {
                    fieldValue = {};
                }
                transformedObject[field] = transform(fieldValue, fieldConfig.properties);
            } else {
                transformedObject[field] = fieldValue;
            }
        }
    }

    return transformedObject;
}

/**
 * @param {Object} object
 * @param {Object} config
 *
 * @returns {Object}
 */
function setDefaults(object, config) {
    var field, fieldConfig;

    for (field in config) {
        fieldConfig = config[field];

        if (fieldConfig instanceof Object) {
            if (fieldConfig.default !== undefined && object[field] === undefined) {
                object[field] = fieldConfig.default;
            }

            if (fieldConfig.properties instanceof Object) {
                setDefaults(object[field], fieldConfig.properties);
            }
        }
    }

    return object;
}

/**
 * @param {Object} object
 * @param {Object} config
 *
 * @returns {Object}
 */
function filter(object, config) {
    var field, fieldConfig;
    var filters;

    for (field in config) {
        fieldConfig = config[field];

        if (fieldConfig instanceof Object) {
            filters = fieldConfig.filters;

            if (filters) {
                if (!(filters instanceof Array || filters instanceof Function)) {
                    throw new Error('Filters must be function or array of functions');
                }

                if (filters instanceof Function) {
                    filters = [filters];
                }

                filters.forEach(function(filter) {
                    object[field] = filter(object[field]);
                });
            }

            if (fieldConfig.properties instanceof Object) {
                filter(object[field], fieldConfig.properties);
            }
        }
    }

    return object;
}

/**
 * @param {Object} object
 * @param {Object} config
 *
 * @returns {Promise}
 */
function validate(object, config) {
    return validateObject(object, config, [], object);
}

/**
 * @param {Object} object
 * @param {Object} config
 * @param {Array}  path
 * @param {Object} originalObject
 *
 * @returns {Promise}
 */
function validateObject(object, config, path, originalObject) {
    var field, fieldConfig, fieldValue, fieldPath;

    var validationPromise;
    var validationPromises = [];
    var validationErrors   = {};

    for (field in config) {
        fieldConfig = config[field];
        fieldValue  = object[field];
        fieldPath   = [].concat(path, field);

        if (fieldConfig instanceof Object
            && (fieldConfig.validators instanceof Object || fieldConfig.properties instanceof Object)) {

            validationPromise = validateField(fieldValue, fieldConfig, fieldPath, originalObject);

            (function(field) {
                validationPromise.catch(function(err) {
                    validationErrors[field] = err;
                });
            })(field);

            validationPromises.push(validationPromise);
        }
    }

    return Promise.all(validationPromises)
        .then(function() {
            return object;
        })
        .catch(function() {
            return Promise.reject(validationErrors);
        });
}

/**
 * @param {*}      value
 * @param {Object} config
 * @param {Array}  path
 * @param {Object} originalObject
 *
 * @returns {Promise}
 */
function validateField(value, config, path, originalObject) {
    var promise;

    if (config.validators instanceof Object) {
        promise = asyncValidate(value, config.validators);
    } else {
        promise = Promise.resolve();
    }

    return promise.then(function() {
        if (config.properties instanceof Object) {
            return validateObject(value, config.properties, path, originalObject);
        }
    });
}

/**
 * @param {*}      value
 * @param {Object} config
 * @param {Array}  path
 * @param {Object} originalObject
 *
 * @returns {Promise}
 */
function asyncValidate(value, config, path, originalObject) {
    var validationPromises = [];
    var validationPromise;
    var validator;
    var validatorName;
    var validatorOptions;
    var validationResult;

    var resolvedValidators = utils.resultValue(config, value, path, originalObject);

    for (validatorName in resolvedValidators) {
        validator        = validateJs.validators[validatorName];
        validatorOptions = utils.resultValue(resolvedValidators[validatorName], value, path, originalObject);
        validationResult = validator.call(validator, value, validatorOptions, originalObject);

        if (validationResult instanceof Promise) {
            validationPromise = validationResult;
        } else if (validationResult === null || validationResult === undefined) {
            validationPromise = Promise.resolve();
        } else {
            validationPromise = Promise.reject(validationResult);
        }

        validationPromises.push(validationPromise);
    }

    return Promise.all(validationPromises);
}

/**
 * @param {Object}         object
 * @param {Object|Boolean} config
 *
 * @returns {Promise}
 */
module.exports = function(object, config) {
    if (config === true) {
        return Promise.resolve(object);
    }

    return Promise.resolve(transform(object, config))
        .then(function(object) {
            return setDefaults(object, config);
        })
        .then(function(object) {
            return filter(object, config);
        })
        .then(function(object) {
            return validate(object, config);
        });
};