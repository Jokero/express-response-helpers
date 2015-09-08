var mapObject = require('../mapObject');

module.exports = function(req, res, next) {
    /**
     * @param {Object|Object[]} objectOrArray
     * @param {Object}          map
     * @param {Object}          [meta]
     */
    res.sendObject = function(objectOrArray, map, meta) {
        var data;

        if (objectOrArray instanceof Array) {
            data = objectOrArray.map(function(object) {
                return mapObject(object, map);
            });
        } else {
            data = mapObject(objectOrArray, map);
        }

        return res.sendData(data, meta);
    };

    next();
};