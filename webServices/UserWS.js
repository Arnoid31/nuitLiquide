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
     * @api {post} /delegate Délègue la voix du user pour un expert sur un domaine
     * @apiName delegate
     * @apiGroup User
     *
     * @apiParam {String} token Token de la session en cours (donné par secret)
     * @apiParam {String} digest Hash du login, password, date, token & nonce
     * @apiParam {String} date Date utilisée pour la génération du digest
     * @apiParam {Number} expertId id de l'expert à qui la voix est déléguée
    */
    delegate(req, res) {
        // Ajoute ligne dans delegate
        var self = this;
        return self._checkAuth(req, res, function(req, res) {
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
        });
    };

    /**
     * @api {post} /undelegate Retire la voix du user pour un expert sur un domaine
     * @apiName undelegate
     * @apiGroup User
     *
     * @apiParam {String} token Token de la session en cours (donné par secret)
     * @apiParam {String} digest Hash du login, password, date, token & nonce
     * @apiParam {String} date Date utilisée pour la génération du digest
     * @apiParam {Number} expertId id de l'expert à qui la voix est déléguée
    */
    undelegate(req, res) {
        // Retire une ligne dans delegate
        var self = this;
        return self._checkAuth(req, res, function(req, res) {
            var userId = req.userId;
            var expertId = parseInt(req.body.expertId) || null;
            if (!expertId) return res.sendStatus(400);
            var query = 'DELETE FROM delegation WHERE userId = ' + userId + ' AND expertId = ' + expertId;
            return this.mySQL.query(query, function() {
                return res.sendStatus(201);
            });
        });
    };

    /**
     * @api {post} /addExpert Rajoute le user aux experts sur un domaine
     * @apiName addExpert
     * @apiGroup User
     *
     * @apiParam {String} token Token de la session en cours (donné par secret)
     * @apiParam {String} digest Hash du login, password, date, token & nonce
     * @apiParam {String} date Date utilisée pour la génération du digest
     * @apiParam {Number} domainId id du domaine de l'expert
     * @apiParam {String} skills compétences/présentation de l'expert (texte libre)
    */
    addExpert(req, res) {
        // Ajoute une ligne dans expert
        var self = this;
        return self._checkAuth(req, res, function(req, res) {
            var idUser = req.idUser;
            var domainId = parseInt(req.body.domainId) || null;
            var skills = req.body.skills || null;
            if (!domainId || !skills) return res.sendStatus(400);
            var query = 'INSERT INTO expert (userId, domainId, skills) VALUES (' + userId + ', ' + domainId + ', ' + self.mySQL.escape(skills) + ')';
            self.mySQL.query(query, function() {
                return res.sendStatus(201);
            });
        });
    };

    /**
     * @api {post} /removeExpert Enlève l'expertise au user
     * @apiName removeExpert
     * @apiGroup User
     *
     * @apiParam {String} token Token de la session en cours (donné par secret)
     * @apiParam {String} digest Hash du login, password, date, token & nonce
     * @apiParam {String} date Date utilisée pour la génération du digest
    */
    removeExpert(req, res) {
        // Ajoute une ligne dans expert
        var self = this;
        return self._checkAuth(req, res, function(req, res) {
            var idUser = req.idUser;
            if (!domainId) return res.sendStatus(400);
            var query = 'DELETE FROM expert WHERE userId = ' + userId;
            self.mySQL.query(query, function() {
                return res.sendStatus(200);
            });
        });
    };

    /**
     * @api {post} /create Crée un user inactif
     * @apiName create
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
        return self.mySQL.query(query, function() {
            query = 'SELECT id FROM user WHERE email = ' + email + ' AND password = ' + password;
            return self.mySQL.query(query, function(row) {
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
     * @api {post} /delete Supprime le user
     * @apiName delete
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
     * @api {get} /verify/:email/:token Passe un user à actif
     * @apiName verify
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