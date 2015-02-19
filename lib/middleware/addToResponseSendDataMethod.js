module.exports = function(req, res, next) {
    /**
     * @param {*}      data
     * @param {Object} [meta]
     */
    res.sendData = function(data, meta) {
        var response = { data: data };

        if (meta) {
            response.meta = meta;
        }

        return res.json(response);
    };

    next();
};