module.exports = (libraryService, cacheService, promiseHandler) => {
    const BaseController = require('./base');

    Object.setPrototypeOf(LibraryController.prototype, BaseController.prototype);

    function LibraryController(libraryService, promiseHandler) {
        BaseController.call(this, libraryService, promiseHandler);

       // this.routes['/'] = [{ method: 'post', cb: readAll }];


        this.registerRoutes();

        return this.router;

        function readAll(req, res) {
            libraryService.readChunk(req.params)
                .then((books) => {
                    cacheService.set(req, books);
                    res.json(books);
                })
                .catch((err) => res.error(err));
        }

    }

    return new LibraryController(libraryService, promiseHandler);
};