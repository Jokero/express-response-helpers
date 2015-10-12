/**
 * todo: выпилить, как решатся https://github.com/jshttp/http-errors/issues/20 и https://github.com/jshttp/http-errors/issues/17
 */
exports.HttpError               = require('./httpError');
exports.BadRequestHttpError     = require('./httpError/badRequest');
exports.ConflictHttpError       = require('./httpError/conflict');
exports.ForbiddenHttpError      = require('./httpError/forbidden');
exports.NotFoundHttpError       = require('./httpError/notFound');
exports.InternalServerHttpError = require('./httpError/internalServerError');
exports.UnauthorizedHttpError   = require('./httpError/unauthorized');
exports.NotImplementedHttpError = require('./httpError/notImplemented');