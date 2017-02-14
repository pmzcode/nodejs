const express = require('express');

module.exports = (libraryService,bookService,authorService, userService, roleService, authService, cacheService, config) => {
    const router = express.Router();
    const bookController = require('./book')(bookService,cacheService,promiseHandler);
    const authorController = require('./author')(authorService, cacheService, promiseHandler);
    const userController = require('./user')(userService, promiseHandler);
    const roleController = require('./role')(roleService, promiseHandler);
    const authController = require('./auth')(authService, config);
    const libraryController = require('./library')(libraryService,cacheService,promiseHandler);
    router.use('/library',libraryController);
    router.use('/authors', authorController);
    router.use('/users', userController);
    router.use('/roles', roleController);
    router.use('/auth', authController);
    router.use('/books',bookController);
    return router;
};

function promiseHandler(res, promise) {
    promise
        .then((data) => res.json(data))
        .catch((err) => res.error(err));
}