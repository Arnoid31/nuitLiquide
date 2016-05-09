'use strict';

var Routes              = require('./../libs/Routes');
var AuthenticationWS    = require('./../webServices/AuthenticationWS');
var CommentWS           = require('./../webServices/CommentWS');
var DelegationWS        = require('./../webServices/DelegationWS');
var DomainWS            = require('./../webServices/DomainWS');
var ExpertWS            = require('./../webServices/ExpertWS');
var MessageWS           = require('./../webServices/MessageWS');
var PropositionWS       = require('./../webServices/PropositionWS');
var UserWS              = require('./../webServices/UserWS');

class ApiV1Routes extends Routes {
    constructor() {
        var authenticationWS    = new AuthenticationWS();
        var commentWS           = new CommentWS();
        var delegationWS        = new DelegationWS();
        var domainWS            = new DomainWS();
        var expertWS            = new ExpertWS();
        var messageWS           = new MessageWS();
        var propositionWS       = new PropositionWS();
        var userWS              = new UserWS();
        super('/api/v1/', [
            {
                'verb'      : 'post',
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
                    return delegationWS.delete(req, res);
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
                    return expertWS.create(req, res);
                }
            }, {
                'verb'      : 'post',
                'route'     : '/expert/delete',
                'function'  : function(req, res) {
                    return expertWS.delete(req, res);
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
                'verb'      : 'post',
                'route'     : '/user/verify',
                'function'  : function(req, res) {
                    return userWS.verifyPost(req, res);
                }
            },{
                'verb'      : 'post',
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
            }, {
                'verb'      : 'post',
                'route'     : '/message/get',
                'function'  : function(req, res) {
                    return messageWS.get(req, res);
                }
            }, {
                'verb'      : 'post',
                'route'     : '/message/delete',
                'function'  : function(req, res) {
                    return messageWS.delete(req, res);
                }
            }, {
                'verb'      : 'post',
                'route'     : '/comment/create',
                'function'  : function(req, res) {
                    return commentWS.create(req, res);
                }
            }
        ]);
    };
};

module.exports = ApiV1Routes;

