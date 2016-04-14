'use strict';

var WebService  = require('../libs/WebService');
var crypto      = require('crypto');
var Mailer = require('../libs/Mailer');

class UserWS extends WebService {
    constructor() {
        super();
		this.mailer = new Mailer();
    };

    delegate(req, res) {
        // Ajoute ligne dans delegate
        var self = this;
        var userId = req.userId;
        var expertId = parseInt(req.body.expertId) || null;
        if (!expertId) return res.sendStatus(400);
        var selectExpertQuery = 'SELECT userId FROM expert WHERE id = ' + expertId;
        return self.mySQL.query(selectExpertQuery, function(row) {
            if (row[0].userId == userId) return res.sendStatus(403);
            var query = 'INSERT INTO delegation (userId, expertId, domainId) VALUES (' + userId + ', ' + expertId + ')';
            return this.mySQL.query(query, function() {
                return res.sendStatus(201);
            });
        });
    };

    undelegate(req, res) {
        // Retire une ligne dans delegate
        var userId = req.userId;
        var expertId = parseInt(req.body.expertId) || null;
        if (!expertId) return res.sendStatus(400);
        var query = 'DELETE FROM delegation WHERE userId = ' + userId + ' AND expertId = ' + expertId;
        return this.mySQL.query(query, function() {
            return res.sendStatus(201);
        });
    };

    addExpert(req, res) {
        // Ajoute une ligne dans expert
        var self = this;
        var idUser = req.idUser;
        var domainId = parseInt(req.body.domainId) || null;
        var skills = req.body.skills || null;
        if (!domainId || !skills) return res.sendStatus(400);
        var query = 'INSERT INTO expert (userId, domainId, skills) VALUES (' + userId + ', ' + domainId + ', ' + skills + ')';
        self.mySQL.query(query, function() {
            return res.sendStatus(201);
        });
    };

    removeExpert(req, res) {
        // Ajoute une ligne dans expert
        var self = this;
        var idUser = req.idUser;
        var domainId = parseInt(req.body.domainId) || null;
        if (!domainId) return res.sendStatus(400);
        var query = 'DELETE FROM expert WHERE userId = ' + userId + ' AND domainId = ' + domainId;
        self.mySQL.query(query, function() {
            return res.sendStatus(200);
        });
    };

    create(req, res) {
        // Ajoute une ligne dans user (valide false), envoie un mail
        var self = this;
        var email = req.body.email || null;
        var password = req.body.password || null;
        if (!email || !password) return res.sendStatus(400);
        email = self.mySQL.escape(email);
        password = self.mySQL.escape(password);
        var query = 'INSERT INTO user (email, password) VALUES (' + email + ', ' + password + ')';
        return self.mySQL.query(query, function() {
            query = 'SELECT id FROM user WHERE email = ' + email + ' AND password = ' + password;
            return self.mySQL.query(query, function(row) {
                var userId = row[0].id;
                return require('crypto').randomBytes(48, function(ex, buf) {
                    var token = buf.toString('hex');
                    query = 'INSERT INTO toValid (userId, token) VALUES (' + userId + ', "' + token + '"';
                    return self.mySQL.query(query, function() {
                        // TODO send mail to validate
                        return res.sendStatus(201);
                    });
                });
            });
        });
    };

    delete(req, res) {
        // Retire une ligne dans user
        var self = this;
        var email = req.body.email || null;
        var password = req.body.password || null;
        if (!email || !password) return res.sendStatus(400);
        var query = 'DELETE FROM user WHERE email = ' + self.mySQL.escape(email) + ' AND password = ' + self.mySQL.escape(password);
        return self.mySQL.query(query, function() {
            return res.sendStatus(204);
        });
    };

    verify(req, res) {
        // Passe un user à valide
        var self = this;
        var email = req.body.email || null;
        var token = req.body.token || null;
        if (!email || !token) return res.sendStatus(400);
        var query = 'SELECT id FROM user WHERE email = ' + self.mySQL.escape(email) + ' AND isValid = 0';
        return self.mySQL.query(query, function(row) {
            if (row.length === 0) return res.sendStatus(404);
            var userId = row[0].id;
            query = 'UPDATE user SET isValid = 1 WHERE id = ' + userId;
            return self.mySQL.query(query, function() {
                query = 'DELETE FROM toValid WHERE userId = ' + userId;
                return self.mySQL.query(query, function() {
                    return res.sendStatus(200);
                });
            });
        });
    };
};

module.exports = UserWS;