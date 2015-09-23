/**
 * todo: нужно навести порядок в https://github.com/edwardhotchkiss/mongoose-paginate и использовать его
 *
 * @param {Schema} schema
 */
module.exports = function(schema) {
    schema.statics.paginate = paginate;
};

/**
 * @param {Object}        [conditions={}]
 * @param {Object}        [params]
 * @param {Object|String}   [params.select]
 * @param {Object|String}   [params.populate]
 * @param {Object|String}   [params.sort={}]
 * @param {Number}          [params.limit=20]
 * @param {Number}          [params.offset=0]
 * @param {Boolean}         [params.lean=true]
 * @param {Boolean}         [params.assignId=true]
 *
 * @returns {Promise}
 */
function paginate(conditions, params) {
    conditions = conditions || {};
    params     = params || {};

    var select   = params.select;
    var populate = params.populate;
    var sort     = params.sort || {};
    var limit    = params.hasOwnProperty('limit') ? params.limit : 20;
    var offset   = params.hasOwnProperty('offset') ? params.offset : 0;
    var lean     = params.hasOwnProperty('lean') ? params.lean : true;
    var assignId = params.hasOwnProperty('assignId') ? params.assignId : true;

    var collectionPromise = Promise.resolve([]);
    if (limit) {
        var query = this.find(conditions)
                        .sort(sort)
                        .limit(limit)
                        .skip(offset)
                        .lean(lean);

        if (select) {
            query.select(select);
        }

        if (populate) {
            query.populate(populate);
        }

        collectionPromise = query.exec();
    }

    var totalCountPromise = this.count(conditions).exec();

    return Promise.all([collectionPromise, totalCountPromise]).then(function(result) {
        var data       = result[0];
        var totalCount = result[1];

        if (assignId) {
            data.forEach(function(item) {
                item.id = item._id;
            });
        }

        var meta = {
            limit:      limit,
            offset:     offset,
            totalCount: totalCount
        };

        return {
            data: data,
            meta: meta
        };
    });
}