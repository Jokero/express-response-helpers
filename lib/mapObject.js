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
        fieldValue = object[field] !== undefined ? object[field] : null;

        if (fieldMapConfig === true) {
            mappedObject[field] = fieldValue;
        } else if (_.isFunction(fieldMapConfig)) {
            // cast function
            mappedObject[field] = fieldMapConfig(fieldValue, object);
        } else if (_.isPlainObject(fieldMapConfig)) {
            if (!fieldMapConfig.hasOwnProperty('isAvailable') || _.result(fieldMapConfig, 'isAvailable')) {
                if (!fieldMapConfig.hasOwnProperty('cast')) {
                    mappedObject[field] = fieldValue;
                } else {
                    mappedObject[field] = fieldMapConfig.cast(fieldValue, object);
                }
            }
        }
    });

    return mappedObject;
};