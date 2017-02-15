/**
 * Created by MSI on 15.02.2017.
 */
module.exports = (domainRepository, errors) => {
    const BaseService = require('./base');

    Object.setPrototypeOf(DomainService.prototype, BaseService.prototype);

    function DomainService(domainRepository, errors) {
        BaseService.call(this, domainRepository, errors);

        var self = this;

        self.create = create;

        function create(data) {
            return new Promise((resolve, reject) => {
                var user = {
                    name: data.name
                };

                self.baseCreate(user)
                    .then(resolve).catch(reject);
            });
        }
    }

    return new DomainService(domainRepository, errors);
};