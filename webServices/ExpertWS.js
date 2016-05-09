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
                var firstName = authReq.body.firstName || null;
                var lastName = authReq.body.lastName || null;
                var skills = authReq.body.skills || null;
                if (!domainId || !skills || !firstName || !lastName) return res.sendStatus(400);
                var query = 'INSERT INTO expert (userId, domainId, firstName, lastName, skills) VALUES (' + userId + ', ' + domainId + ', ' + self.mySQL.escape(firstName) + ', ' + self.mySQL.escape(lastName) + ', ' + self.mySQL.escape(skills) + ')';
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

    /**
     * @api {post} expert/get Enlève l'expertise au user
     * @apiName Getexpert
     * @apiGroup Expert
     *
     * @apiParam {String} token (facultatif) Token de la session en cours (donné par secret)
     * @apiParam {String} digest (facultatif) Hash du login, password, date, token & nonce
     * @apiParam {String} date (facultatif) Date utilisée pour la génération du digest
     * @apiParam {Number} domainId (facultatif) Id du domaine de l'expert
     * @apiParam {Number} expertId (facultatif) Id de l'expert
     * @apiParam {Number} mine (facultatif) Retourne uniquement les experts qui ont la délégation du user (si authentifié)
     * @apiParam {Number} me (facultatif) Retourne l'expert rattaché au userId (si authentifié)
     * @apiParam {Number} limit (facultatif, défaut 10) Nombre de lignes à retourner
     * @apiParam {Number} offset (facultatif, défaut 0) Début des lignes à retourner
     */
    get(req, res) {
        var self = this;
        var domainId = parseInt(req.body.domainId) || null;
        var expertId = parseInt(req.body.expertId) || null;
        var limit = parseInt(req.body.limit) || 10;
        var offset = parseInt(req.body.offset) || 0;
        var mine = parseInt(req.body.mine) || null;
        var me = parseInt(req.body.me) || null;
        return self._checkAuthOpt(req, res, function(authReq) {
            var userId = authReq.userId;
            var selectExpertQuery = 'SELECT e.id AS id, domainId, firstName, lastName, skills, e.creationDate AS creationDate, IF(d.userId IS NULL, 0, 1) AS isMine, COUNT(d2.userId) AS trusters FROM expert AS e ';
            selectExpertQuery += 'LEFT JOIN delegation AS d ON d.expertId = e.id AND d.userId = ' + (userId !== null && mine === 1 || 0) + ' ';
            selectExpertQuery += 'LEFT JOIN delegation AS d2 ON d2.expertId = e.id ';
            var criteria = ['1'];
            if (domainId) criteria.push('e.domainId = ' + domainId);
            if (expertId) criteria.push('e.id = ' + expertId);
            if (userId !== null && me === 1) criteria.push('e.userId = ' + userId);
            selectExpertQuery += 'WHERE ' + criteria.join(' AND ') + ' ';
            selectExpertQuery += 'GROUP BY e.id ';
            selectExpertQuery += 'LIMIT ' + limit + ' OFFSET ' + offset;
            return self.mySQL.query(selectExpertQuery, function(err, rows) {
                if (err) return res.sendStatus(500);
                return res.json(rows);
            });
        });
    };
};

module.exports = ExpertWS;
