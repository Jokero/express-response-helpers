var _ = require('lodash');

var lodashDeep = require('lodash-deep');
_.mixin(lodashDeep);

/**
 * @param {Object} object
 * @param {Object} map
 * @param {Number} [index]
 * @param {Array}  [collection]
 *
 * @returns {Object}
 */
module.exports = function(object, map, index, collection) {
    var mappedObject = {}, fieldValue, mappedFieldPromise, mappedFieldPromisesArr = [];

    return new Promise(function(resolve, reject) {
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
                mappedFieldPromise = Promise.resolve(fieldValue).then(function(data) {
                    _.deepSet(mappedObject, field, data);
                });

                mappedFieldPromisesArr.push(mappedFieldPromise);
            }
        });

        Promise.all(mappedFieldPromisesArr)
            .then(function() {
                resolve(mappedObject);
            })
            .catch(reject);
    });
};