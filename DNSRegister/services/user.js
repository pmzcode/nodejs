/**
 * Created by MSI on 15.02.2017.
 */

const saltRounds = 10;
const Promise = require('bluebird');
module.exports = (userRepository, roleRepository, errors) => {
    const BaseService = require('./base');
    const config = require('../config.json');
    Object.setPrototypeOf(UserService.prototype, BaseService.prototype);

    function UserService(userRepository, domainRepository, errors) {
        BaseService.call(this, userRepository, errors);

        var self = this;

        self.update = update;
        self.grant = grant;
        self.revoke = revoke;
        self.readChunk=readChunk;
        function readChunk(options) {
            return new Promise((resolve, reject) => {
                options = Object.assign({}, config.defaults.readChunk,config.defaults.search, options);

                var limit = Number(options.limit);
                var offset =Number((options.page - 1) * options.limit);
                var searchKey ='%'+ options.searchKey+'%';
                userRepository.findAll({
                        limit: limit,
                        offset: offset,
                        order: [[options.orderField, options.order.toUpperCase()]],
                        raw: true,
                        where:{
                            $or:[
                                {
                                    email: {
                                        $like: searchKey
                                    }
                                }, {
                                    firstname: {
                                        $like: searchKey
                                    }
                                },{
                                    lastname:{
                                        $like: searchKey
                                    }
                                }
                            ]

                        },
                    include: [{
                        model: domainRepository
                    }]
                    }
                ).then(resolve).catch(reject);

            });
        }
        function update(data) {
            return new Promise((resolve, reject) => {
                bcrypt.hash(data.password, saltRounds, function(err, hash) {
                    if (err) {
                        throw err;
                    }
                var user = {
                    password: hash,
                    firstname: data.firstname,
                    lastname: data.lastname
                };

                self.baseUpdate(data.id, user)
                    .then(resolve).catch(reject);
                })
            })
        }


        function grant(userId, roleId) {
            return new Promise((resolve, reject) => {
               return Promise
                    .all([
                        userRepository.findById(userId),
                        domainRepository.findById(roleId)
                    ])
                    .spread((user, role) => {
                       return user.getRoles().then((roles)=>{
                            user.removeRoles(roles);
                            return user;
                        }).then((user)=>{
                            return user.addRole(role);
                        })


                    })
                    .then(() => resolve({ success: true }))
                    .catch(reject);
            });
        }

        function revoke(userId, roleId) {
            return new Promise((resolve, reject) => {
                Promise
                    .all([
                        userRepository.findById(userId),
                        roleRepository.findById(roleId)
                    ])
                    .spread((user, role) => {
                        return user.removeRole(role);
                    })
                    .then(() => resolve({ success: true }))
                    .catch(reject);
            });
        }
    }

    return new UserService(userRepository, roleRepository, errors);
};