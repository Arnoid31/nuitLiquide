'use strict';

var Routes = require( './../libs/Routes');

export default class BaseRoutes extends Routes {
    var self = this;

    constructor() {
        super('/', [
            {
                'verb'      : 'get',
                'route'     : '',
                'function'  : function(req, res) {
                    res.sendFile(require('path').resolve(__dirname + '/../views/index.html'));
                }
            }
        ]);
    };
};
