module.exports = function(req, res, next) {
    /**
     * @param {Object} params
     * @param {Object}   params.model
     * @param {Object}   [params.conditions]
     * @param {Object}   [params.sort]
     * @param {Number}   [params.limit]
     * @param {Number}   [params.offset]
     * @param {Object} map
     */
    res.sendCollection = function(params, map) {
        var model      = params.model;
        var conditions = params.conditions || {};
        var sort       = params.sort || {};
        var limit      = params.hasOwnProperty('limit') ? params.limit : 20;
        var offset     = params.hasOwnProperty('offset') ? params.offset : 0;

        var collectionPromise = Promise.resolve([]);
        if (limit) {
            /**
             * todo: сейчас это железно завязано на такой интерфейс. если надо будет использовать что-то отличное,
             * это уже не будет работать
             */
            collectionPromise = model
                                    .find(conditions)
                                    .limit(limit)
                                    .skip(offset)
                                    .sort(sort)
                                    .exec();
        }

        var totalCountPromise = model.count(conditions).exec();

        Promise.all([collectionPromise, totalCountPromise])
            .then(function(results) {
                var collection = results[0];
                var totalCount = results[1];
                
                var meta = {
                    limit:      limit,
                    offset:     offset,
                    totalCount: totalCount
                };

                res.sendObject(collection, map, meta);
            })
            .catch(next);
    };

    next();
};