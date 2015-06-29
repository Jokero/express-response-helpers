var validateJs = require('validate.js');
var _          = require('lodash');

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
     * @param {Object} object
     *
     * @returns {Boolean}
     */
    isNotEmptyPlainObject: function(object) {
        return _.isPlainObject(object) && !_.isEmpty(object);
    },

    /**
     * Returns a promise that is resolved when all promises are settled
     *
     * @param {Promise[]} promises
     *
     * @returns {Promise}
     */
    waitForAllPromises: function(promises) {
        var errors = [];

        var resolvedPromises = promises.forEach(function(promise) {
            return promise.catch(function(err) {
                if (err instanceof Error) {
                    return Promise.reject(err);
                }

                errors.push(err);

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
        } else if (_.isPlainObject(fieldConfig)) {
            if (utils.isNotEmptyPlainObject(fieldConfig.properties)) {
                if (!_.isPlainObject(fieldValue)) {
                    fieldValue = {};
                }
                transformedObject[field] = prepare(fieldValue, fieldConfig.properties);
            } else if (utils.isNotEmptyPlainObject(fieldConfig.items) && fieldValue instanceof Array) {
                transformedObject[field] = fieldValue.map(function(item) {
                    return prepare(item, fieldConfig.items);
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
        if (_.isPlainObject(fieldConfig)) {
            if (fieldConfig.default !== undefined && object[field] === undefined) {
                object[field] = fieldConfig.default;
            }

            if (utils.isNotEmptyPlainObject(fieldConfig.properties)) {
                setDefaults(object[field], fieldConfig.properties);
            } else if (utils.isNotEmptyPlainObject(fieldConfig.items) && object[field] instanceof Array) {
                object[field].forEach(function(item) {
                    setDefaults(item, fieldConfig.items);
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
        if (_.isPlainObject(fieldConfig)) {
            filters = fieldConfig.filters;

            if (filters) {
                [].concat(filters).forEach(function(filter) {
                    object[field] = filter(object[field]);
                });
            }

            if (utils.isNotEmptyPlainObject(fieldConfig.properties)) {
                filter(object[field], fieldConfig.properties);
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
 * @param {Object} object
 * @param {Object} config
 * @param {Array}  path
 * @param {Object} originalObject
 *
 * @returns {Promise}
 */
function validateObject(object, config, path, originalObject) {
    var fieldValue, fieldPath;
    var validationPromise, validationPromises = [], validationErrors = {};

    _.forOwn(config, function(fieldConfig, field) {
        fieldValue = object[field];
        fieldPath  = [].concat(path, field);

        if (_.isPlainObject(fieldConfig)
            && (utils.isNotEmptyPlainObject(fieldConfig.validators)
                || utils.isNotEmptyPlainObject(fieldConfig.properties)
                || utils.isNotEmptyPlainObject(fieldConfig.items))) {

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
 * @param {*}      value
 * @param {Object} config
 * @param {Array}  path
 * @param {Object} originalObject
 *
 * @returns {Promise}
 */
function validateField(value, config, path, originalObject) {
    var promise;

    if (utils.isNotEmptyPlainObject(config.validators)) {
        promise = validateValue(value, config.validators, path, originalObject);
    } else {
        promise = Promise.resolve();
    }

    return promise.then(function() {
        if (utils.isNotEmptyPlainObject(config.properties)) {
            return validateObject(value, config.properties, path, originalObject);
        } else if (utils.isNotEmptyPlainObject(config.items) && value instanceof Array) {
            var arrayConfig = {};
            value.forEach(function(item, index) {
                arrayConfig[index] = config.items;
            });

            return validateObject(value, arrayConfig, path, originalObject);
        }
    });
}

/**
 * @param {*}      value
 * @param {Object} validatorsConfig
 * @param {Array}  path
 * @param {Object} originalObject
 *
 * @returns {Promise}
 */
function validateValue(value, validatorsConfig, path, originalObject) {
    var validatorName, validator, validatorOptions;
    var validationResult, validationPromise, validationPromises = [];

    validatorsConfig = utils.result(validatorsConfig, value, path, originalObject);

    for (validatorName in validatorsConfig) {
        validator = validateJs.validators[validatorName];

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
module.exports = function(object, config) {
    if (config === true) {
        return Promise.resolve(object);
    }

    return Promise.resolve().then(function() {
        var preparedObject = prepare(object, config);

        setDefaults(preparedObject, config);

        filter(preparedObject, config);

        return validate(preparedObject, config);
    });
};