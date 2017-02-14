"use strict"

var Promise = require("bluebird");
var bcrypt = require('bcryptjs');
const saltRounds = 10;

module.exports = (userRepository, roleRepository, errors) => {
    const permissions = require('../permissions.json');

    return {
        login: login,
        register: register,
        checkPermissions: checkPermissions,
        loginTwitter: loginTwitter
    };

    function login(data) {
        return new Promise((resolve, reject) => {
                userRepository.findOne({ where: { email: data.email }, attributes: ['id', 'password'] })
            .then((user) => {
                console.log("kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk");
                console.log("userpass:"+user.password+" datapass:"+data.password);
                user.getRoles().then((roles)=>{

                    console.log("userpass:"+user.password+" datapass:"+data.password);

                    //console.log(bcrypt.compare(data.password, user.password));
                    bcrypt.compare(data.password, user.password, function(err, res) {
                        console.error("err"+err+" res: "+res);
                        if(res && roles) resolve([user.id,roles[0].name]);
                        else {
                            reject(errors.wrongCredentials);
                        }
                    });

                });

            })
            .catch(reject);
        });
    }

    function register(data) {
        return new Promise((resolve, reject) => {
            bcrypt.hash(data.password, saltRounds, function(err, hash) {
                if (err) {
                    throw err;
                }
                var user = {
                    email: data.email,
                    password: hash,
                    firstname: data.firstname,
                    lastname: data.lastname
                };

                Promise.all([
                    userRepository.create(user),
                   // roleRepository.findOne({ where: { name: "user" } })
                ])
                    .spread((user, role) => {
                        console.log(roles);
                        //return user.addRole(role);
                    })
                    .then(() => resolve({ success: true }))
                    .catch(reject);
                console.log(hash);
            });
        });
    }

    function checkPermissions(userId, route) {
        return new Promise((resolve, reject) => {
            if (permissions[route] == undefined) resolve();
            else if (userId == undefined) reject();
            else {
                Promise.all([
                        userRepository.findById(userId),
                        roleRepository.findOne({ where: { name: permissions[route] } })
                    ])
                    .spread((user, role) => {
                        return user.hasRole(role);
                    })
                    .then((has) => {
                        if (has) resolve();
                        else reject();
                    })
                    .catch(reject);
            }
        });
    }


//Lab 7
    function loginTwitter(data) {
            return new Promise((resolve, reject) => {
                userRepository.findOne({ where: { email: data.email }, attributes: ['id', 'password'] })
                    .then((user) => {
                        user.getRoles().then((roles)=>{

                                if(roles) resolve([user.id,roles[0].name]);
                                else {
                                    reject(errors.wrongCredentials);
                                }
                            });

                        });

                    });
    }
};