var _ = require('lodash');

/**
 * @param {Object} object
 * @param {Object} map
 *
 * @returns {Object}
 */
module.exports = function(object, map) {
    var mappedObject = {}, fieldValue;

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
            fieldValue   = fieldMapConfig(fieldValue, object);
        } else if (_.isPlainObject(fieldMapConfig)) {
            if (!fieldMapConfig.hasOwnProperty('isAvailable') || _.result(fieldMapConfig, 'isAvailable')) {
                needSetField = true;
                if (fieldMapConfig.hasOwnProperty('cast')) {
                    fieldValue = fieldMapConfig.cast(fieldValue, object);
                }
            }
        }

        if (needSetField) {
            _.set(mappedObject, field, fieldValue);
        }
    });

    return mappedObject;
};