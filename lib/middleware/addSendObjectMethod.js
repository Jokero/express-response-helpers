const mapObject = require('../mapObject');

module.exports = function(req, res, next) {
    /**
     * @param {Object|Object[]} objectOrArray
     * @param {Object}          mapConfig
     * @param {Object}          [meta]
     */
    res.sendObject = function(objectOrArray, mapConfig, meta) {
        const data = mapObject(objectOrArray, mapConfig);

        return res.sendData(data, meta);
    };

    next();
};