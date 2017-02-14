module.exports = (bookService, cacheService, promiseHandler) => {
    const BaseController = require('./base');

    Object.setPrototypeOf(AuthorController.prototype, BaseController.prototype);

    function AuthorController(bookService, promiseHandler) {
        BaseController.call(this, bookService, promiseHandler);

        this.routes['/'] = [{ method: 'get', cb: readAll }];

        this.registerRoutes();

        return this.router;

        function readAll(req, res) {
            bookService.readChunk(req.query)
                .then((books) => {
                    cacheService.set(req, books);
                    res.json(books);
                })
                .catch((err) => res.error(err));
        }
    }

    return new AuthorController(bookService, promiseHandler);
};