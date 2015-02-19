var _ = require('lodash');

var lodashDeep = require('lodash-deep');
_.mixin(lodashDeep);

/**
 * @param {Object} object
 * @param {Object} map
 *
 * @returns {Object}
 */
module.exports = function(object, map) {
    var mappedObject = {}, fieldValue;

    _.forOwn(map, function(fieldMapConfig, field) {
        fieldValue = _.deepGet(object, field);
        if (fieldValue === undefined) {
            fieldValue = null;
        }

        if (fieldMapConfig === true) {
            _.deepSet(mappedObject, field, fieldValue);
        } else if (_.isFunction(fieldMapConfig)) {
            // cast function
            fieldValue = fieldMapConfig(fieldValue, object);
            _.deepSet(mappedObject, field, fieldValue);
        } else if (_.isPlainObject(fieldMapConfig)) {
            if (!fieldMapConfig.hasOwnProperty('isAvailable') || _.result(fieldMapConfig, 'isAvailable')) {
                if (!fieldMapConfig.hasOwnProperty('cast')) {
                    _.deepSet(mappedObject, field, fieldValue);
                } else {
                    fieldValue = fieldMapConfig(fieldValue, object);
                    _.deepSet(mappedObject, field, fieldValue);
                }
            }
        }
    });

    return mappedObject;
};