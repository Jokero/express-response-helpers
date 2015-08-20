var mapObject = require('../mapObject');

module.exports = function(req, res, next) {
    /**
     * @param {Object|Object[]} objectOrArray
     * @param {Object}          map
     * @param {Object}          [meta]
     */
    res.sendObject = function(objectOrArray, map, meta) {
        var promise;

        if (objectOrArray instanceof Array) {
            var arrayPromises = objectOrArray.map(function(object, index) {
                return mapObject(object, map, index, objectOrArray);
            });
            promise = Promise.all(arrayPromises);
        } else {
            promise = mapObject(objectOrArray, map);
        }

        return promise.then(function(data) {
            res.sendData(data, meta);
        });
    };

    next();
};
