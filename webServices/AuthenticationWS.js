'use strict';

var WebService  = require('../libs/WebService');
var crypto      = require('crypto');

class AuthenticationWS extends WebService {
    constructor() {
        super();
    };

    secret(req, res) {
        // Crée le token, renvoie secret
        var self = this;
        return crypto.randomBytes(48, function(ex, buf) {
            var token = buf.toString('hex');
            var query = 'INSERT INTO token (token) VALUES ("' + token + '")';
            return self.mySQL.query(query, function() {
                return res.json({
                    token   : token
                });
            });
        });
    };

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
        return self.mySQL.query(query, function(row) {
            if (row.length === 0) return res.sendStatus(404);
            var userId      = row[0].id;
            var password    = row[0].password;
            query = 'SELECT 1 FROM token WHERE token = ' + self.mySQL.escape(token) + ' AND nonce IS NULL AND DATE_ADD(creationDate, 30 MINUTES) < NOW() AND (expirationDate IS NULL OR expirationDate > NOW())';
            return self.mySQL.query(query, function(row) {
                if (row.length === 0) return res.sendStatus(401);
                var sDigest = crypto.createHmac('sha1', password).update(email).digest('hex');
                sDigest     = crypto.createHmac('sha1', date).update(sDigest).digest('hex');
                sDigest     = crypto.createHmac('sha1', token).update(sDigest).digest('hex');
                sDigest     = crypto.createHmac('sha1', nonce).update(sDigest).digest('hex');
                if (sDigest != digest) return res.sendStatus(401);
                query = 'UPDATE token SET nonce = ' + self.mySQL.escape(nonce) + ', userId = ' + userId + ', expirationDate = DATE_ADD(NOW(), 30 MINUTES) WHERE token = ' + self.mySQL.escape(token);
                return self.mySQL.query(query, function() {
                    return res.sendStatus(418);
                });
            });
        });
    };

    logout(req, res) {
        // Fait expirer l'ensemble des tokens actifs pour le user
        var userId = req.userId;
        var query = 'UPDATE token SET expirationDate = NOW() WHERE userId = ' + userId + ' AND expirationDate > NOW()';
        return this.mySQL.query(query, function() {
            return res.sendStatus(200);
        });
    };

    checkAuth(req, res, cb) {
        // Ajoute userId dans req si trouvé à partir de token
        var self = this;
        var token   = req.body.token    || null;
        var digest  = req.body.digest   || null;
        var date    = req.body.date     || null;
        if (!token || !digest || !date) return res.sendStatus(400);
        var query = 'SELECT userId, email, password, nonce ';
        query += 'FROM token AS t ';
        query += 'INNER JOIN user AS u ON u.id = t.userId ';
        query += 'WHERE token = ' + self.mySQL.escape(token) + ' AND DATE_ADD(creationDate, 30 MINUTES) < NOW() AND (expirationDate IS NULL OR expirationDate > NOW() AND isValid = 1';
        return self.mySQL.query(query, function(row) {
            if (row.length === 0) return res.send(401);
            var password    = row[0].password;
            var email       = row[0].email;
            var nonce       = row[0].nonce;
            var sDigest = crypto.createHmac('sha1', password).update(email).digest('hex');
            sDigest     = crypto.createHmac('sha1', date).update(sDigest).digest('hex');
            sDigest     = crypto.createHmac('sha1', token).update(sDigest).digest('hex');
            sDigest     = crypto.createHmac('sha1', nonce).update(sDigest).digest('hex');
            if (sDigest != digest) return res.sendStatus(401);
            req.userId = row[0].userId;
            return cb(req, res);
        });
    };
};

module.exports = AuthenticationWS;