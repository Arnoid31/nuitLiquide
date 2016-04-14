'use strict';

var Routes              = require('./../libs/Routes');
var AuthenticationWS    = require('./../webServices/AuthenticationWS');
var UserWS              = require('./../webServices/UserWS');
var PropositionWS       = require('./../webServices/PropositionWS');

class ApiV1Routes extends Routes {
    constructor() {
        var authenticationWS = new AuthenticationWS();
        var userWS = new UserWS();
        var propositionWS = new PropositionWS();
        super('/api/v1/', [
            {
                'verb'      : 'post',
                'route'     : '/secret',
                'function'  : function(req, res) {
                    return authenticationWS.secret(req, res);
                }
            }, {
                'verb'      : 'post',
                'route'     : '/login',
                'function'  : function(req, res) {
                    return authenticationWS.login(req, res);
                }
            }, {
                'verb'      : 'post',
                'route'     : '/logout',
                'function'  : function(req, res) {
                    return authenticationWS.logout(req, res);
                }
            }, {
                'verb'      : 'post',
                'route'     : '/delegate',
                'function'  : function(req, res) {
                    return authenticationWS.checkAuth(req, res, userWS.delegate);
                }
            }, {
                'verb'      : 'post',
                'route'     : '/undelegate',
                'function'  : function(req, res) {
                    return authenticationWS.checkAuth(req, res, userWS.undelegate);
                }
            }, {
                'verb'      : 'post',
                'route'     : '/addExpert',
                'function'  : function(req, res) {
                    return authenticationWS.checkAuth(req, res, userWS.addExpert);
                }
            }, {
                'verb'      : 'post',
                'route'     : '/removeExpert',
                'function'  : function(req, res) {
                    return authenticationWS.checkAuth(req, res, userWS.removeExpert);
                }
            }, {
                'verb'      : 'post',
                'route'     : '/create',
                'function'  : function(req, res) {
                    return userWS.create(req, res);
                }
            }, {
                'verb'      : 'post',
                'route'     : '/delete',
                'function'  : function(req, res) {
                    return authenticationWS.checkAuth(req, res, userWS.delete);
                }
            }, {
                'verb'      : 'post',
                'route'     : '/propose',
                'function'  : function(req, res) {
                    return authenticationWS.checkAuth(req, res, propositionWS.add);
                }
            }, {
                'verb'      : 'post',
                'route'     : '/vote',
                'function'  : function(req, res) {
                    return authenticationWS.checkAuth(req, res, propositionWS.vote);
                }
            }, {
                'verb'      : 'get',
                'route'     : '/verify',
                'function'  : function(req, res) {
                    return userWS.verify(req, res);
                }
            }
        ]);
    };
};

module.exports = ApiV1Routes;