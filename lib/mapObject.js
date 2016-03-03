const transformer = require('transformer-chain');

/**
 * @param {Object} object
 * @param {Object} config
 * 
 * @returns {Object}
 */
function mapObject(object, config) {
    if (object.toJSON instanceof Function) {
        object = object.toJSON();
    }

    return transformer(object, config)
        .filter()
        .clean()
        .result;
}
/**
 * @param {Object|Object[]} objectOrArray
 * @param {Object}          config
 */
module.exports = function(objectOrArray, config) {
    if (objectOrArray instanceof Array) {
        return objectOrArray.map(object => mapObject(object, config));
    }
     
    return mapObject(objectOrArray, config);
};