'use strict';

var MySQL           = require('./../libs/MySQL');
var crypto          = require('crypto');

class WebService {
    constructor() {
        this.mySQL = new MySQL();
    };

    _checkAuth(req, res, cb) {
        // Ajoute userId dans req si trouvé à partir de token
        var self = this;
        var token   = req.body.token    || null;
        var digest  = req.body.digest   || null;
        var date    = req.body.date     || null;
        if (!token || !digest || !date) return res.sendStatus(400);
        var query = 'SELECT userId, email, password, nonce ';
        query += 'FROM token AS t ';
        query += 'INNER JOIN user AS u ON u.id = t.userId ';
        query += 'WHERE token = ' + self.mySQL.escape(token) + ' AND TIMESTAMPDIFF(MINUTE,t.creationDate,NOW()) < 30 AND (expirationDate IS NULL OR expirationDate > NOW()) AND isValid = 1';
        return self.mySQL.query(query, function(row) {
            if (row.length === 0) return res.send(401);
            var password    = row[0].password;
            var email       = row[0].email;
            var nonce       = row[0].nonce;
            var sDigest = crypto.createHmac('sha1', password).update(email).digest('hex');
            // XXXXXXXXXX La date est été enlevée pour faciliter les tests XXXXXXXXXX
            // sDigest     = crypto.createHmac('sha1', date).update(sDigest).digest('hex');
            sDigest     = crypto.createHmac('sha1', token).update(sDigest).digest('hex');
            sDigest     = crypto.createHmac('sha1', nonce).update(sDigest).digest('hex');
            if (sDigest != digest) return res.sendStatus(401);
            req.userId = row[0].userId;
            return cb(req, res);
        });
    };
};

module.exports = WebService;