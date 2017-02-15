module.exports = (domainService, promiseHandler) => {
    const BaseController = require('./base');

    Object.setPrototypeOf(DomainController.prototype, BaseController.prototype);

    function DomainController(domainService, promiseHandler) {
        BaseController.call(this, domainService, promiseHandler);

        this.routes['/update'] = undefined;

        this.registerRoutes();

        return this.router;
    }

    return new DomainController(domainService, promiseHandler);
};