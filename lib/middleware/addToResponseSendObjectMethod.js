var _         = require('lodash');
var mapObject = require('../mapObject');

module.exports = function(req, res, next) {
    /**
     * @param {Object|Array} objectOrArray
     * @param {Object}       map
     * @param {Object}       [meta]
     */
    res.sendObject = function(objectOrArray, map, meta) {
        var data, dataPromise;

        if (!_.isArray(objectOrArray)) {
            dataPromise = Promise.resolve(mapObject(objectOrArray, map));
        } else {
            data = objectOrArray.map(function(object, index) {
                return Promise.resolve(mapObject(object, map, index, objectOrArray));
            });

            dataPromise = Promise.all(data);
        }

        dataPromise
            .then(function(data) {
                res.sendData(data, meta);
            })
            .catch(next);

        return dataPromise;
    };

    next();
};