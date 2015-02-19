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
                    fieldValue = fieldMapConfig(fieldValue, object);
                }
            }
        }

        if (needSetField) {
            _.deepSet(mappedObject, field, fieldValue);
        }
    });

    return mappedObject;
};