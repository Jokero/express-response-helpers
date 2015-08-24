var mapObject = require('../mapObject');

module.exports = function(req, res, next) {
    /**
     * @param {Object|Object[]} objectOrArray
     * @param {Object}          map
     * @param {Object}          [meta]
     */
    res.sendObject = function(objectOrArray, map, meta) {
        var mapPromise;

        if (objectOrArray instanceof Array) {
            var promises = objectOrArray.map(function(object, index) {
                return mapObject(object, map, index, objectOrArray);
            });
            mapPromise = Promise.all(promises);
        } else {
            mapPromise = mapObject(objectOrArray, map);
        }

        return mapPromise.then(function(data) {
            res.sendData(data, meta);
        });
    };

    next();
};
