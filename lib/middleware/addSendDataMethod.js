module.exports = function(req, res, next) {
    /**
     * @param {*}      data
     * @param {Object} [meta]
     */
    res.sendData = function(data, meta) {
        const response = { data: data };

        if (meta) {
            response.meta = meta;
        }

        return res.send(response);
    };

    next();
};