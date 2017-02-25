const express = require('express');

module.exports = (userService, domainService, config) => {
    const router = express.Router();
    const userController = require('./user')(userService, promiseHandler);
    const domainController = require('./domain')(domainService, promiseHandler);


    router.use('/user', userController);
    router.use('/domain', domainController);

    return router;
};

function promiseHandler(res, promise) {
    promise
        .then((data) => res.json(data));

}