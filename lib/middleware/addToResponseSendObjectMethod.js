var _         = require('lodash');
var mapObject = require('../mapObject');

module.exports = function(req, res, next) {
    /**
     * @param {Object|Array} objectOrArray
     * @param {Object}       map
     * @param {Object}       [meta]
     */
    res.sendObject = function(objectOrArray, map, meta) {
        var promise;

        if (!_.isArray(objectOrArray)) {
            promise = mapObject(objectOrArray, map);
        } else {
            var arrayPromises = objectOrArray.map(function(object, index) {
                return mapObject(object, map, index, objectOrArray);
            });
            promise = Promise.all(arrayPromises);
        }

        return promise.then(function(data) {
            res.sendData(data, meta);
        });
    };

    next();
};
