'use strict';

var MySQL           = require('./../libs/MySQL');

class WebService {
    constructor() {
        this.mySQL = new MySQL();
    };
};

module.exports = WebService;