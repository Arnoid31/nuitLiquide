'use strict';

var WebService  = require('../libs/WebService');

class ExpertWS extends WebService {
    constructor() {
        super();
    };

    /**
     * @api {post} expert/create Rajoute le user aux experts sur un domaine
     * @apiName CreateExpert
     * @apiGroup Expert
     *
     * @apiParam {String} token Token de la session en cours (donné par secret)
     * @apiParam {String} digest Hash du login, password, date, token & nonce
     * @apiParam {String} date Date utilisée pour la génération du digest
     * @apiParam {Number} domainId id du domaine de l'expert
     * @apiParam {String} skills compétences/présentation de l'expert (texte libre)
    */
    create(req, res) {
        var self = this;
        return self._checkAuth(req, res, function(authReq) {
            var userId = authReq.userId;
            var selectExpertQuery = 'SELECT 1 FROM expert WHERE userId = ' + userId;
            return self.mySQL.query(selectExpertQuery, function(err, rows) {
                if (err) return res.sendStatus(500);
                if (rows.length > 0) return res.sendStatus(403);
                var domainId = parseInt(authReq.body.domainId) || null;
                var skills = authReq.body.skills || null;
                if (!domainId || !skills) return res.sendStatus(400);
                var query = 'INSERT INTO expert (userId, domainId, skills) VALUES (' + userId + ', ' + domainId + ', ' + self.mySQL.escape(skills) + ')';
                self.mySQL.query(query, function(err) {
                    if (err) return res.sendStatus(500);
                    return res.sendStatus(201);
                });
            });
        });
    };

    /**
     * @api {post} expert/delete Enlève l'expertise au user
     * @apiName Deleteexpert
     * @apiGroup Expert
     *
     * @apiParam {String} token Token de la session en cours (donné par secret)
     * @apiParam {String} digest Hash du login, password, date, token & nonce
     * @apiParam {String} date Date utilisée pour la génération du digest
    */
    delete(req, res) {
        var self = this;
        return self._checkAuth(req, res, function(authReq) {
            var userId = authReq.userId;
            var query = 'DELETE FROM expert WHERE userId = ' + userId;
            return self.mySQL.query(query, function(err) {
                if (err) return res.sendStatus(500);
                return res.sendStatus(200);
            });
        });
    };

    get(req, res) {
        var self = this;
        return self._checkAuthOpt(req, res, function(authReq) {
            var selectExpertQuery = 'SELECT id, userId, domainId, skills, creationDate FROM expert';
            return self.mySQL.query(selectExpertQuery, function(err, rows) {
                if (err) return res.sendStatus(500);
                return res.json(rows);
            });
        });
    };
}

module.exports = ExpertWS;