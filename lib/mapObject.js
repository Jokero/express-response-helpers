var _ = require('lodash');

/**
 * @param {Object}   object
 * @param {Object}   map
 * @param {Number}   [index]
 * @param {Object[]} [collection]
 *
 * @returns {Promise}
 */
module.exports = function(object, map, index, collection) {
    var mappedObject = {}, fieldValue, mappedFieldPromise, mappedFieldsPromises = [];

    _.forOwn(map, function(fieldMapConfig, field) {
        fieldValue = _.get(object, field);
        if (fieldValue === undefined) {
            fieldValue = null;
        }

        var needSetField = false;

        if (fieldMapConfig === true) {
            needSetField = true;
        } else if (_.isFunction(fieldMapConfig)) {
            // cast function
            needSetField = true;
            fieldValue   = fieldMapConfig(fieldValue, object, index, collection);
        } else if (_.isPlainObject(fieldMapConfig)) {
            if (!fieldMapConfig.hasOwnProperty('isAvailable') || _.result(fieldMapConfig, 'isAvailable')) {
                needSetField = true;
                if (fieldMapConfig.hasOwnProperty('cast')) {
                    fieldValue = fieldMapConfig.cast(fieldValue, object, index, collection);
                }
            }
        }

        if (needSetField) {
            mappedFieldPromise = Promise.resolve(fieldValue).then(function(value) {
                _.set(mappedObject, field, value);
            });

            mappedFieldsPromises.push(mappedFieldPromise);
        }
    });

    return Promise.all(mappedFieldsPromises).then(function() {
        return mappedObject;
    });
};