'use strict';

var Routes = require( './../libs/Routes');

class BaseRoutes extends Routes {
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

module.exports = BaseRoutes;
