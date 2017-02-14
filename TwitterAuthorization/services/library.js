module.exports = (libraryRepository, errors) => {
    const BaseService = require('./base');
    const Validator = require('./validate');
    const config = require('../config.json');
    Object.setPrototypeOf(LibraryService.prototype, BaseService.prototype);

    function LibraryService(libraryRepository, errors) {
        BaseService.call(this, libraryRepository, errors);

        this.create = create;
        this.update = update;
        this.readChunk=readChunk;
        this.delete=del;
        var self = this;
        function readChunk(options) {
            return new Promise((resolve, reject) => {
                options = Object.assign({}, config.defaults.readChunk,config.defaults.search, options);

                var limit = Number(options.limit);
                var offset =Number((options.page - 1) * options.limit);
                var searchKey ='%'+ options.searchKey+'%';
                libraryRepository.findAll({
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
                                }, {
                                    capacity: {
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
                if (Validator.validateLibrary(data)) reject(errors.validateLibrary);
                var library = {
                    title: data.title,
                    capacity:data.capacity
                };

                self.baseCreate(library)
                    .then(resolve).catch(reject);
            });
        }

        function update(data) {
            return new Promise((resolve, reject) => {
                if (Validator.validateLibrary(data)) reject(errors.validateLibrary);
                var library = {
                    title: data.title,
                    capacity:data.capacity
                };

                self.baseUpdate(data.id, library)
                    .then(resolve).catch(reject);
            });
        }
        function del(id) {
            return new Promise((resolve,reject)=>{
                self.baseDelete(id).then(resolve).catch(reject);
            })
        }
    }

    return new LibraryService(libraryRepository, errors);
};