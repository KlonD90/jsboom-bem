var Susanin = require('susanin'),

    model = require('../model'),
    HttpError = require('../errors').HttpError;

var router = null;

/**
 * Initialize application routes
 * Iterates through compiled model route objects and creates Susanin routes
 * @returns {exports}
 */
function init() {
    router = model.getRoutes().reduce(function(prev, item) {
        prev.addRoute(item);
        return prev
    }, new Susanin());
};

/**
 * Router middleware
 * @param router - {Object} router module
 * @returns {Function}
 */
module.exports = function() {
    init();

    return function(req, res, next) {
        var route = router.findFirst(decodeURIComponent(req.path));

        if(!route) {
            return next(new HttpError(HttpError.CODES.NOT_FOUND));
        }

        req.route = route[0].getName();
        req.params = route[1];

        next();
    };
};
