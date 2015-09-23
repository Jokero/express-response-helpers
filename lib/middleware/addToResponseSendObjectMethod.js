var transformer = require('validate'); // todo: require('transformer');

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
                return transformer(object, map).clean().filter().result;
            });
        } else {
            data = transformer(objectOrArray, map).clean().filter().result;
        }

        return res.sendData(data, meta);
    };

    next();
};