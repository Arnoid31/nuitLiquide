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
                'verb'      : 'get',
                'route'     : '/authentication/secret',
                'function'  : function(req, res) {
                    return authenticationWS.secret(req, res);
                }
            }, {
                'verb'      : 'post',
                'route'     : '/authentication/login',
                'function'  : function(req, res) {
                    return authenticationWS.login(req, res);
                }
            }, {
                'verb'      : 'post',
                'route'     : '/authentication/logout',
                'function'  : function(req, res) {
                    return authenticationWS.logout(req, res);
                }
            }, {
                'verb'      : 'post',
                'route'     : '/delegation/create',
                'function'  : function(req, res) {
                    return delegationWS.create(req, res);
                }
            }, {
                'verb'      : 'post',
                'route'     : '/delegation/delete',
                'function'  : function(req, res) {
                    return delegationWS.undelegate(req, res);
                }
            }, {
                'verb'      : 'post',
                'route'     : '/domain/get',
                'function'  : function(req, res) {
                    return domainWS.get(req, res);
                }
            }, {
                'verb'      : 'post',
                'route'     : '/expert/create',
                'function'  : function(req, res) {
                    return expertWS.addExpert(req, res);
                }
            }, {
                'verb'      : 'post',
                'route'     : '/expert/delete',
                'function'  : function(req, res) {
                    return expertWS.removeExpert(req, res);
                }
            }, {
                'verb'      : 'post',
                'route'     : '/expert/get',
                'function'  : function(req, res) {
                    return expertWS.get(req, res);
                }
            }, {
                'verb'      : 'post',
                'route'     : '/user/create',
                'function'  : function(req, res) {
                    return userWS.create(req, res);
                }
            }, {
                'verb'      : 'post',
                'route'     : '/user/delete',
                'function'  : function(req, res) {
                    return userWS.delete(req, res);
                }
            }, {
                'verb'      : 'get',
                'route'     : '/user/verify/:email/:token',
                'function'  : function(req, res) {
                    return userWS.verify(req, res);
                }
            }, {
                'verb'      : 'post',
                'route'     : '/proposition/create',
                'function'  : function(req, res) {
                    return propositionWS.create(req, res);
                }
            }, {
                'verb'      : 'post',
                'route'     : '/proposition/vote',
                'function'  : function(req, res) {
                    return propositionWS.vote(req, res);
                }
            }, {
                'verb'      : 'post',
                'route'     : '/proposition/get',
                'function'  : function(req, res) {
                    return propositionWS.get(req, res);
                }
            }
        ]);
    };
};

module.exports = ApiV1Routes;