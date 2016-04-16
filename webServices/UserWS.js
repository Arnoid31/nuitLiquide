'use strict';

var WebService  = require('../libs/WebService');
var Mailer = require('../libs/Mailer');
var crypto          = require('crypto');

class UserWS extends WebService {
    constructor() {
        super();
        this.mailer = new Mailer();
    };

    /**
     * @api {post} user/create Crée un user inactif
     * @apiName Createuser
     * @apiGroup User
     *
     * @apiParam {String} email email du compte
     * @apiParam {String} password hash (algo à définir côté front, doit juste être reproductible) du password
    */
    create(req, res) {
        // Ajoute une ligne dans user (valide false), envoie un mail
        var self = this;
        var email = req.body.email || null;
        var password = req.body.password || null;
        if (!email || !password) return res.sendStatus(400);
        email = self.mySQL.escape(email);
        password = self.mySQL.escape(password);
        var query = 'INSERT INTO user (email, password) VALUES (' + email + ', ' + password + ')';
        return self.mySQL.query(query, function(err) {
            if (err) return res.sendStatus(500);
            query = 'SELECT id FROM user WHERE email = ' + email + ' AND password = ' + password;
            return self.mySQL.query(query, function(err, row) {
                if (err) res.sendStatus(500);
                var userId = row[0].id;
                return require('crypto').randomBytes(48, function(ex, buf) {
                    var token = buf.toString('hex');
                    query = 'INSERT INTO toValid (userId, token) VALUES (' + userId + ', "' + token + '")';
                    return self.mySQL.query(query, function() {
                        // TODO send mail to validate
                        return res.sendStatus(201);
                    });
                });
            });
        });
    };

    /**
     * @api {post} user/delete Supprime le user
     * @apiName Deleteuser
     * @apiGroup User
     *
     * @apiParam {String} token Token de la session en cours (donné par secret)
     * @apiParam {String} digest Hash du login, password, date, token & nonce
     * @apiParam {String} date Date utilisée pour la génération du digest
     * @apiParam {String} password hash (algo à définir côté front, doit juste être reproductible) du password
    */
    delete(req, res) {
        // Retire une ligne dans user
        var self = this;
        return self._checkAuth(req, res, function(req, res) {
            var userId = req.userId;
            var password = req.body.password || null;
            if (!password) return res.sendStatus(400);
            var query = 'DELETE FROM user WHERE id = ' + userId + ' AND password = ' + self.mySQL.escape(password);
            return self.mySQL.query(query, function() {
                return res.sendStatus(204);
            });
        });
    };

    /**
     * @api {get} user/verify/:email/:token Passe un user à actif
     * @apiName Verifyuser
     * @apiGroup User
     *
     * @apiParam {String} token Token d'activation (normalement envoyé par mail, pas dév pour le moment)
     * @apiParam {String} email email du user
    */
    verify(req, res) {
        // Passe un user à valide
        var self = this;
        var email = req.params.email || null;
        var token = req.params.token || null;
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