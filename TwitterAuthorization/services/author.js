"use strict"
module.exports = (authorRepository, errors) => {
    const BaseService = require('./base');
    const config = require('../config.json');

    Object.setPrototypeOf(AuthorService.prototype, BaseService.prototype);

    function AuthorService(authorRepository, errors) {
        BaseService.call(this, authorRepository, errors);

        this.create = create;
        this.update = update;
        this.delete = del;
        this.readChunk=readChunk;
        function readChunk(options) {
            return new Promise((resolve, reject) => {
                options = Object.assign({}, config.defaults.readChunk,config.defaults.search, options);

                let limit = Number(options.limit);
                let offset =Number((options.page - 1) * options.limit);
                let searchKey ='%'+ options.searchKey+'%';

                authorRepository.findAll({
                        limit: limit,
                        offset: offset,
                        order: [[options.orderField, options.order.toUpperCase()]],
                        raw: true,
                    where:{
                        $or:[
                            {
                                name: {
                                    $like: searchKey
                                }
                            }, {
                                country: {
                                    $like: searchKey
                                }
                            },{
                                pseudonym:{
                                    $like: searchKey
                                }
                            },{
                                id:{
                                    $like: searchKey
                                }
                            }

                        ]
                    }

                    }
                ).then(resolve).catch(reject);

            });
        }

        function create(data) {
            return new Promise((resolve, reject) => {
                var author = {
                    name: data.name,
                    country:data.country,
                    pseudonym:data.pseudonym
                };

                this.baseCreate(author)
                    .then(resolve).catch(reject);
            });
        }

        function update(data) {
            return new Promise((resolve, reject) => {
                var author = {
                    name: data.name,
                    country:data.country,
                    pseudonym:data.pseudonym
                };

                this.baseUpdate(data.id, author)
                    .then(resolve).catch(reject);
            });
        }

        function del(id) {
            return new Promise((resolve, reject) => {
                this.baseDelete(id)
                    .then(resolve).catch(reject);
            });
        }

/*        function upvote(id) {
            return new Promise((resolve, reject) => {
                authorRepository.findById(id)
                    .then((author) => {
                        return author.increment({ rating: 1 })
                    })
                    .then(() => resolve({ success: true }))
                    .catch(reject);
            });
        }

        function downvote(id) {
            return new Promise((resolve, reject) => {
                authorRepository.findById(id)
                    .then((post) => {
                        return post.decrement({ rating: 1 })
                    })
                    .then(() => resolve({ success: true }))
                    .catch(reject);
            });
        }*/
    }

    return new AuthorService(authorRepository, errors);
};