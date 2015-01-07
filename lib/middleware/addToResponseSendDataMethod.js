module.exports = function(req, res, next) {
    res.sendData = function(data) {
        return res.json({ data: data });
    };
    next();
};