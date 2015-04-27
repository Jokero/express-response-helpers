module.exports = function(req, res, next) {
    /**
     * @param {Object} params
     * @param {Model}    params.model
     * @param {Object}   [params.conditions]
     * @param {Object}   [params.sort]
     * @param {Number}   [params.limit]
     * @param {Number}   [params.offset]
     * @param {Function} [params.collectionPromiseFunction]
     * @param {Function} [params.totalCountPromiseFunction]
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
            if (params.collectionPromiseFunction) {
                collectionPromise = params.collectionPromiseFunction(model, conditions, sort, limit, offset);
            } else {
                collectionPromise = model
                                        .find(conditions)
                                        .limit(limit)
                                        .skip(offset)
                                        .sort(sort)
                                        .exec();
            }
        }

        var totalCountPromise;
        if (params.totalCountPromiseFunction) {
            totalCountPromise = params.totalCountPromiseFunction(model, conditions);
        } else {
            totalCountPromise = model.count(conditions).exec();
        }

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