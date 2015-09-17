module.exports = function(req, res, next) {
    /**
     * @param {Object} params
     * @param {Model}    params.model
     * @param {Object}   [params.conditions]
     * @param {Object}   [params.populateOptions]
     * @param {Object}   [params.sort]
     * @param {Number}   [params.limit]
     * @param {Number}   [params.offset]
     * @param {Boolean}  [params.lean=true]
     * @param {Object} map
     */
    res.sendCollection = function(params, map) {
        var model           = params.model;
        var conditions      = params.conditions || {};
        var populateOptions = params.populateOptions;
        var sort            = params.sort || {};
        var limit           = params.hasOwnProperty('limit') ? params.limit : 20;
        var offset          = params.hasOwnProperty('offset') ? params.offset : 0;
        var lean            = params.hasOwnProperty('lean') ? params.lean : true;

        var collectionPromise = Promise.resolve([]);
        if (limit) {
            var query = model.find(conditions)
                .sort(sort)
                .limit(limit)
                .skip(offset)
                .lean(lean);

            if (populateOptions) {
                query = query.populate(populateOptions);
            }

            collectionPromise = query.exec();
        }

        var totalCountPromise = model.count(conditions).exec();

        Promise.all([collectionPromise, totalCountPromise])
            .then(function(results) {
                var collection = results[0];
                if (lean) {
                    collection.forEach(function(item) {
                        item.id = item._id;
                    });
                }

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