"use strict";

const Promise = require("bluebird");
module.exports = (bookRepository,libraryRepository,authorRepository, errors) => {
    const BaseService = require('./base');
    const config =require('../config.json');
    const Validator = require('./validate');
    Object.setPrototypeOf(BookService.prototype, BaseService.prototype);

    function BookService(bookRepository, errors) {
        BaseService.call(this, bookRepository, errors);
        let self =this;
        self.create = create;
        self.update = update;
        self.readChunk=readChunk;
        self.delete=del;
        function readChunk(options) {
            return new Promise((resolve, reject) => {
                options = Object.assign({}, config.defaults.readChunk,config.defaults.search, options);

                var limit = Number(options.limit);
                var offset =Number((options.page - 1) * options.limit);
                var searchKey ='%'+ options.searchKey+'%';
                bookRepository.findAll({
                        limit: limit,
                        offset: offset,
                        order: [[options.orderField, options.order.toUpperCase()]],
                        raw: true,
                        where:{
                            $or:[
                                {
                                    title: {
                                        $like: searchKey
                                    }
                                },{
                                    genre:{
                                        $like: searchKey
                                    }
                                },{
                                    id:{
                                        $like: searchKey
                                    }
                                }

                            ]
                        },
                    include: [{
                        model: authorRepository
                    },{
                            model:libraryRepository
                    }]
                    }
                ).then(resolve).catch(reject);

            });
        }

        function create(data) {
            return new Promise((resolve, reject) => {
                if (Validator.validateBook(data)) reject(errors.validateBook);
                    let book = {
                        title: data.title,
                        releaseDate: data.releaseDate,
                        genre: data.genre
                    };
                Promise.all([
                    self.baseCreate(book),
                    libraryRepository.findById(data.library),
                    authorRepository.findById(data.author)
                ]).spread((book,library,author)=>{
                    return Promise.all([
                        library.addBook(book),
                        author.addBook(book)
                    ]);

                }).then(() => resolve({ success: true }))
                    .catch(reject);
            });
        }

        function update(data) {
            return new Promise((resolve, reject) => {
                if (Validator.validateBook(data)) reject(errors.validateBook);
                let book = {
                    title: data.title,
                    releaseDate:data.releaseDate,
                    genre:data.genre
                };

                self.baseUpdate(data.id, book)
                    .then(resolve).catch(reject);
            });
        }
        function del(id) {
            return new Promise((resolve,reject)=>{
                self.baseDelete(id).then(resolve).catch(reject);
            })
        }
    }

    return new BookService(bookRepository, errors);
};