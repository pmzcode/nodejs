module.exports = (authorService, cacheService, promiseHandler) => {
    const BaseController = require('./base');

    Object.setPrototypeOf(AuthorController.prototype, BaseController.prototype);

    function AuthorController(authorService, promiseHandler) {
        BaseController.call(this, authorService, promiseHandler);

        this.routes['/'] = [{ method: 'get', cb: readAll }];

        this.registerRoutes();
        return this.router;

        function readAll(req, res) {

            authorService.readChunk(req.query)
                .then((authors) => {
                    cacheService.set(req, authors);
                    res.json(authors);
                })
                .catch((err) => res.error(err));
        }

    }

    return new AuthorController(authorService, promiseHandler);
};