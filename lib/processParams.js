var _          = require('lodash');
var validators = {};

var utils = {
    /**
     * @param {*} value
     *
     * @returns {*}
     */
    result: function(value) {
        if (value instanceof Function) {
            var args = Array.prototype.slice.call(arguments, 1);
            value    = value.apply(null, args);
        }

        return value;
    },

    /**
     * Returns a promise that is resolved when all promises are settled (fulfilled or rejected)
     *
     * @param {Promise[]} promises
     *
     * @returns {Promise}
     */
    waitForAllPromises: function(promises) {
        var errors = [];

        var resolvedPromises = promises.map(function(promise) {
            return promise.catch(function(err) {
                if (err instanceof Error) {
                    return Promise.reject(err);
                }

                if (!(err instanceof Array)) {
                    err = [err];
                }

                Array.prototype.push.apply(errors, err);

                return Promise.resolve();
            });
        });

        return Promise.all(resolvedPromises).then(function() {
            if (errors.length) {
                return Promise.reject(errors);
            }
        });
    }
};

/**
 * @param {Object} object
 * @param {Object} config
 *
 * @returns {Object}
 */
function prepare(object, config) {
    var transformedObject = {};
    var fieldValue;

    _.forOwn(config, function(fieldConfig, field) {
        fieldValue = object[field];

        if (fieldConfig === true) {
            transformedObject[field] = fieldValue;
        } else if (fieldConfig instanceof Object) {
            if (fieldConfig.properties instanceof Object) {
                if (!(fieldValue instanceof Object)) {
                    fieldValue = {};
                }
                transformedObject[field] = prepare(fieldValue, fieldConfig.properties);
            } else if (fieldValue instanceof Array && fieldConfig.items instanceof Object && fieldConfig.items.properties instanceof Object) {
                transformedObject[field] = fieldValue.map(function(item) {
                    return prepare(item, fieldConfig.items.properties);
                });
            } else {
                transformedObject[field] = fieldValue;
            }
        }
    });

    return transformedObject;
}

/**
 * @param {Object} object
 * @param {Object} config
 *
 * @returns {Object}
 */
function setDefaults(object, config) {
    _.forOwn(config, function(fieldConfig, field) {
        if (fieldConfig instanceof Object) {
            if (fieldConfig.default !== undefined && object[field] === undefined) {
                object[field] = fieldConfig.default;
            }

            if (fieldConfig.properties instanceof Object) {
                setDefaults(object[field], fieldConfig.properties);
            } else if (object[field] instanceof Array && fieldConfig.items instanceof Object && fieldConfig.items.properties instanceof Object) {
                object[field].forEach(function(item) {
                    setDefaults(item, fieldConfig.items.properties);
                });
            }
        }
    });

    return object;
}

/**
 * @param {Object} object
 * @param {Object} config
 *
 * @returns {Object}
 */
function filter(object, config) {
    var filters;

    _.forOwn(config, function(fieldConfig, field) {
        if (fieldConfig instanceof Object) {
            filters = fieldConfig.filters;

            if (filters) {
                [].concat(filters).forEach(function(filter) {
                    object[field] = filter(object[field]);
                });
            }

            if (fieldConfig.properties instanceof Object) {
                filter(object[field], fieldConfig.properties);
            } else if (object[field] instanceof Array && fieldConfig.items instanceof Object && fieldConfig.items.properties instanceof Object) {
                object[field].forEach(function(item) {
                    filter(item, fieldConfig.items.properties);
                });
            }
        }
    });

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
 * @param {Object}   object
 * @param {Object}   config
 * @param {String[]} path
 * @param {Object}   originalObject
 *
 * @returns {Promise}
 */
function validateObject(object, config, path, originalObject) {
    var fieldValue, fieldPath;
    var validationPromise, validationPromises = [], validationErrors = {};

    _.forOwn(config, function(fieldConfig, field) {
        fieldValue = object[field];
        fieldPath  = [].concat(path, field);

        if (fieldConfig instanceof Object
            && (fieldConfig.validators instanceof Object
                || fieldConfig.properties instanceof Object
                || fieldConfig.items instanceof Object)) {

            validationPromise = validateField(fieldValue, fieldConfig, fieldPath, originalObject);
            validationPromise.catch(function(err) {
                validationErrors[field] = err;
            });

            validationPromises.push(validationPromise);
        }
    });

    return utils.waitForAllPromises(validationPromises)
        .then(function() {
            return object;
        })
        .catch(function(err) {
            if (err instanceof Error) {
                return Promise.reject(err);
            }

            return Promise.reject(validationErrors);
        });
}

/**
 * @param {*}        value
 * @param {Object}   config
 * @param {String[]} path
 * @param {Object}   originalObject
 *
 * @returns {Promise}
 */
function validateField(value, config, path, originalObject) {
    var promise;

    if (config.validators instanceof Object) {
        promise = validateValue(value, config.validators, path, originalObject);
    } else {
        promise = Promise.resolve();
    }

    return promise.then(function() {
        if (config.properties instanceof Object) {
            return validateObject(value, config.properties, path, originalObject);
        } else if (value instanceof Array && config.items instanceof Object && config.items.properties instanceof Object) {
            var arrayConfig = {};
            value.forEach(function(item, index) {
                arrayConfig[index] = config.items;
            });

            return validateObject(value, arrayConfig, path, originalObject);
        }
    });
}

/**
 * @param {*}        value
 * @param {Object}   validatorsConfig
 * @param {String[]} path
 * @param {Object}   originalObject
 *
 * @returns {Promise}
 */
function validateValue(value, validatorsConfig, path, originalObject) {
    var validatorName, validator, validatorOptions;
    var validationResult, validationPromise, validationPromises = [];

    validatorsConfig = utils.result(validatorsConfig, value, path, originalObject);

    for (validatorName in validatorsConfig) {
        validator = validators[validatorName];

        if (!validator) {
            return Promise.reject(new Error('Unknown validator ' + validatorName));
        }

        validatorOptions = utils.result(validatorsConfig[validatorName], value, path, originalObject);
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

    return utils.waitForAllPromises(validationPromises);
}

/**
 * @param {Object}         object
 * @param {Object|Boolean} config
 *
 * @returns {Promise}
 */
function processParams(object, config) {
    if (config === true) {
        return Promise.resolve(object);
    }

    return Promise.resolve().then(function() {
        var preparedObject = prepare(object, config);

        setDefaults(preparedObject, config);

        filter(preparedObject, config);

        return validate(preparedObject, config);
    });
}

/**
 * @param {Object} $validators
 */
processParams.setValidators = function($validators) {
    validators = $validators;
};

module.exports = processParams;