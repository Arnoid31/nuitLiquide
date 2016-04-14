'use strict';

class Routes {
    constructor(str_route, arrObj_routes) {
        var self = this;
        this.mStr_route = str_route;
        this.mRtr_router = require('express').Router();
        for (var int_routeIndex in arrObj_routes) {
            this.mRtr_router[arrObj_routes[int_routeIndex]['verb']](arrObj_routes[int_routeIndex]['route'], arrObj_routes[int_routeIndex]['function']);
        }
    };

    getRoute() {
        return this.mStr_route;
    };

    getRouter() {
        return this.mRtr_router;
    };
};

module.exports = Routes;