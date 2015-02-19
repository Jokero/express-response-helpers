var _         = require('lodash');
var mapObject = require('../mapObject');

module.exports = function(req, res, next) {
    /**
     * @param {Object|Array} objectOrArray
     * @param {Object}       map
     * @param {Object}       [meta]
     */
    res.sendObject = function(objectOrArray, map, meta) {
        var data;
        if (!_.isArray(objectOrArray)) {
            data = mapObject(objectOrArray, map);
        } else {
            data = objectOrArray.map(function(object) {
                return mapObject(object, map);
            });
        }

        return res.sendData(data, meta);
    };

    next();
};