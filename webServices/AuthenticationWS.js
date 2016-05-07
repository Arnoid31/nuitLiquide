'use strict';

var WebService  = require('../libs/WebService');
var crypto          = require('crypto');

class AuthenticationWS extends WebService {
    constructor() {
        super();
    };

    /**
     * @api {post} authentication/secret Retourne un token de session non attribué
     * @apiName Secret
     * @apiGroup Authentication
     */
    secret(req, res) {
        // Crée le token, renvoie secret
        var self = this;
        return crypto.randomBytes(48, function(ex, buf) {
            var token = buf.toString('hex');
            
            var query = 'INSERT INTO token (token, creationDate) VALUES ("' + token + '", NOW())';
            return self.mySQL.query(query, function(err) {
                if (err) return res.sendStatus(500);
                return res.json({
                    token   : token
                });
            });
        });
    };

    /**
     * @api {post} authentication/login Attribue le token de session au user
     * @apiName Login
     * @apiGroup Authentication
     *
     * @apiParam {String} token Token de la session en cours (donné par secret)
     * @apiParam {String} digest Hash du login, password, date, token & nonce
     * @apiParam {String} nonce Valeur aléatoire donnée par le front
     * @apiParam {String} date Date utilisée pour la génération du digest
     * @apiParam {String} email Email du user
     */
    login(req, res) {
        // Vérifie hash, ajoute nonce dans token
        var self = this;
        var email   = req.body.email    || null;
        var token   = req.body.token    || null;
        var nonce   = req.body.nonce    || null;
        var date    = req.body.date     || null;
        var digest  = req.body.digest   || null;
        if (!email || !token || !nonce || !date || !digest) return res.sendStatus(400);
        var query = 'SELECT id, password FROM user WHERE email = ' + self.mySQL.escape(email) + ' AND isValid = 1';
        return self.mySQL.query(query, function(err, row) {
            if (err) return res.sendStatus(500);
            if (row.length === 0) return res.sendStatus(404);
            var userId      = row[0].id;
            var password    = row[0].password;
            query = 'SELECT 1 FROM token WHERE token = ' + self.mySQL.escape(token) + ' AND nonce IS NULL AND TIMESTAMPDIFF(MINUTE,creationDate,NOW()) < 30 AND (expirationDate IS NULL OR expirationDate > NOW())';
            return self.mySQL.query(query, function(err, row) {
            
            	console.log(err);
                if (err) return res.sendStatus(500);
                if (row.length === 0) return res.sendStatus(401);
                
                
                /*
                var sDigest = crypto.createHmac('sha1', password).update(email).digest('hex');
                sDigest     = crypto.createHmac('sha1', date).update(sDigest).digest('hex');
                sDigest     = crypto.createHmac('sha1', token).update(sDigest).digest('hex');
                sDigest     = crypto.createHmac('sha1', nonce).update(sDigest).digest('hex');
                */
                var sDigest		= email + password + date + token + nonce;
                
                console.log(sDigest);
                if (sDigest != digest) return res.sendStatus(401);
                query = 'UPDATE token SET nonce = ' + self.mySQL.escape(nonce) + ', userId = ' + userId + ', expirationDate = DATE_ADD(NOW(), INTERVAL 30 MINUTE) WHERE token = ' + self.mySQL.escape(token);
                return self.mySQL.query(query, function(err) {
                    if (err) return res.sendStatus(500);
                    return res.sendStatus(418);
                });
            });
        });
    };

    /**
     * @api {post} authentication/logout Fait expirer le token de session du user
     * @apiName Logout
     * @apiGroup Authentication
     *
     * @apiParam {String} token Token de la session en cours (donné par secret)
     * @apiParam {String} digest Hash du login, password, date, token & nonce
     * @apiParam {String} date Date utilisée pour la génération du digest
     */
    logout(req, res) {
        // Fait expirer l'ensemble des tokens actifs pour le user
        var self = this;
        return self._checkAuth(req, res, function(authReq) {
            var userId = req.userId;
            var query = 'DELETE FROM token WHERE userId = ' + userId;
            return self.mySQL.query(query, function(err) {
                if (err) return res.sendStatus(500);
                return res.sendStatus(200);
            });
        });
    };

    
    /**
     * @api {post} authentication/checkToken permet de connaitre l'etat connecte ou en fonction du token
     * @apiName checkToken
     * @apiGroup Authentication
     * @apiParam {String} digest Hash du login, password, date, token & nonce
     * @apiParam {String} date Date utilisée pour la génération du digest
     * @apiParam {String} token Token de la session en cours (donné par secret)
     */
    checkToken(req, res) {
        var self = this;
        return self._checkAuth(req, res, function(authReq) {
            res.sendStatus(200);
            return res.json(rows);
        });
    };
};

module.exports = AuthenticationWS;
