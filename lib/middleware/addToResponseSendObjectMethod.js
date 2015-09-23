var transformer = require('transformer');

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
                return transformer(object, map).clean().filter();
            });
        } else {
            data = transformer(objectOrArray, map).clean().filter();
        }

        return res.sendData(data, meta);
    };

    next();
};