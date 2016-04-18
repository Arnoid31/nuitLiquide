'use strict';

var WebService = require('../libs/WebService');

class DelegationWS extends WebService {
    constructor() {
        super();
    };

    /**
     * @api {post} delegation/create Attribue la voix du user à l'expert donné
     * @apiName Createdelegation
     * @apiGroup Delegation
     *
     * @apiParam {String} token Token de la session en cours (donné par secret)
     * @apiParam {String} digest Hash du login, password, date, token & nonce
     * @apiParam {String} date Date utilisée pour la génération du digest
     * @apiParam {Number} expertId Id de l'expert à qui donner la voix
     */
    create(req, res) {
        var self = this;
        return self._checkAuth(req, res, function(req, res) {
            var userId = req.userId;
            var expertId = parseInt(req.body.expertId) || null;
            if (!expertId) return res.sendStatus(400);
            var selectExpertQuery = 'SELECT userId FROM expert WHERE id = ' + expertId;
            return self.mySQL.query(selectExpertQuery, function(err, row) {
                if (err) return res.sendStatus(500);
                if (row[0].userId == userId) return res.sendStatus(403);
                var query = 'INSERT INTO delegation (userId, expertId) VALUES (' + userId + ', ' + expertId + ')';
                return self.mySQL.query(query, function(err) {
                    if (err) return res.sendStatus(500);
                    return res.sendStatus(201);
                });
            });
        });
    };

    /**
     * @api {post} /delegation/delete Retire la voix du user pour un expert sur un domaine
     * @apiName Deletedelegation
     * @apiGroup Delegation
     *
     * @apiParam {String} token Token de la session en cours (donné par secret)
     * @apiParam {String} digest Hash du login, password, date, token & nonce
     * @apiParam {String} date Date utilisée pour la génération du digest
     * @apiParam {Number} expertId Id de l'expert à qui retirer la voix du user
     */
    delete(req, res) {
        var self = this;
        return self._checkAuth(req, res, function(req, res) {
            var userId = req.userId;
            var expertId = parseInt(req.body.expertId) || null;
            if (!expertId) return res.sendStatus(400);
            var query = 'DELETE FROM delegation WHERE userId = ' + userId + ' AND expertId = ' + expertId;
            return self.mySQL.query(query, function(err) {
                if (err) return res.sendStatus(500);
                return res.sendStatus(201);
            });
        });
    };

    /**
     * @api {post} /delegation/get Retourne les experts concernés par le user
     * @apiName Getdelegation
     * @apiGroup Delegation
     *
     * @apiParam {String} token Token de la session en cours (donné par secret)
     * @apiParam {String} digest Hash du login, password, date, token & nonce
     * @apiParam {String} date Date utilisée pour la génération du digest
     */
    get(req, res) {
        var self = this;
        return self._checkAuth(req, res, function(authReq) {
            var userId = authReq.userId;
            var query = 'SELECT e.id AS id, e.domainId AS domainId, e.firstName AS firstName, e.lastName AS lastName, e.skills AS skills ';
            query += 'FROM expert AS e ';
            query += 'INNER JOIN delegation AS d ON d.expertId = e.id AND d.userId = ' + userId + ' ';
            return self.mySQL.query(query, function(err, rows) {
                if (err) return res.sendStatus(500);
                return res.json(rows);
            });
        });
    };
};

module.exports = DelegationWS;