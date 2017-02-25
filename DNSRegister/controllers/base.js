/**
 * Created by MSI on 15.02.2017.
 */
const express = require('express');

function BaseController(service, promiseHandler) {
    var self = this;

    this.registerRoutes = registerRoutes;
    this.router = express.Router();
    this.routes = {
        '/': [
            { method: 'get', cb: readAll },
            { method: 'post', cb: create }
        ],
        '/:id': [
            { method: 'get', cb: read },
            { method: 'put', cb: update },
            { method: 'delete', cb: del }
        ]
    };

    function readAll(req, res) {
        promiseHandler(res,
            service.readChunk(req.query)
        );
    }

    function read(req, res) {
        promiseHandler(res,
            service.read(req.params.id)
        );
    }

    function create(req, res) {
        promiseHandler(res,
            service.create(req.body)
        );
    }

    function update(req, res) {
        promiseHandler(res,
            service.update(req.body)
        );
    }

    function del(req, res) {
        promiseHandler(res,
            service.del(req.params.id)
        );
    }

    function registerRoutes() {
        for (var route in self.routes) {
            if (!self.routes.hasOwnProperty(route)) {
                continue;
            }

            var handlers = self.routes[route];

            if (handlers == undefined) continue;

            for (var handler of handlers) {
                self.router[handler.method](route, handler.cb);
            }
        }
    }
}

module.exports = BaseController;