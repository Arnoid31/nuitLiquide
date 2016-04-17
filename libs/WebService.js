'use strict';

var MySQL           = require('./../libs/MySQL');
var crypto          = require('crypto');

class WebService {
    constructor() {
        this.mySQL = new MySQL();
    };

    _checkAuth(req, res, cb) {
        return this.__checkAuth(req, res, false, cb);
    };

    _checkAuthOpt(req, res, cb) {
        return this.__checkAuth(req, res, true, cb);
    };

    __checkAuth(req, res, opt, cb) {
        var self = this;
        var token   = req.body.token    || null;
        var digest  = req.body.digest   || null;
        var date    = req.body.date     || null;
        if (!token || !digest || !date) {
            if (opt == true) return cb(req, res);
            return res.sendStatus(400);
        }
        var query = 'SELECT token, userId, email, password, nonce ';
        query += 'FROM token AS t ';
        query += 'INNER JOIN user AS u ON u.id = t.userId ';
        query += 'WHERE token = ' + self.mySQL.escape(token) + ' AND TIMESTAMPDIFF(MINUTE,t.creationDate,NOW()) < 30 AND (expirationDate IS NULL OR expirationDate > NOW()) AND isValid = 1';
        return self.mySQL.query(query, function(err, row) {
            if (err) return res.sendStatus(500);
            if (row.length === 0) {
                if (opt == true) return cb(req, res);
                return res.sendStatus(401);
            }
            var password    = row[0].password;
            var email       = row[0].email;
            var nonce       = row[0].nonce;
            var sDigest = crypto.createHmac('sha1', password).update(email).digest('hex');
            sDigest     = crypto.createHmac('sha1', date).update(sDigest).digest('hex');
            sDigest     = crypto.createHmac('sha1', token).update(sDigest).digest('hex');
            sDigest     = crypto.createHmac('sha1', nonce).update(sDigest).digest('hex');

           	// Pour le moment digest simple       
            sDigest		= email + password + date + token + nonce;
                                       
            if (sDigest != digest) {
                if (opt == true) return cb(req, res);
                return res.sendStatus(401);
            }
            var updateTokenQuery = 'UPDATE token SET expirationDate = DATE_ADD(NOW(), INTERVAL 30 MINUTE) WHERE token = ' + self.mySQL.escape(row[0].token);
            req.userId = row[0].userId;
            return self.mySQL.query(updateTokenQuery, function(err) {
                if (err) return res.sendStatus(500);
                return cb(req, res);
            });
        });
    }
};

module.exports = WebService;
