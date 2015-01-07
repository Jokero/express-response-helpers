var _         = require('lodash');
var mapObject = require('../mapObject');

module.exports = function(req, res, next) {
    res.sendObject = function(objectOrArray, map) {
        var response;
        if (!_.isArray(objectOrArray)) {
            response = mapObject(objectOrArray, map);
        } else {
            response = objectOrArray.map(function(object) {
                return mapObject(object, map);
            });
        }

        return res.sendData(response);
    };
    next();
};