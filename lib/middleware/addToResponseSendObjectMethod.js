var transformResponse = require('./transformResponse');

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
                return transformResponse(object, map);
            });
        } else {
            data = transformResponse(objectOrArray, map);
        }

        return res.sendData(data, meta);
    };

    next();
};