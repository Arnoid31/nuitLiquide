'use strict';

var WebService = require('../libs/WebService');
var async = require('async');

class PropositionWS extends WebService {
    constructor() {
        super();
    };

    /**
     * @api {post} proposition/create Fait expirer le token de session du user
     * @apiName Createproposition
     * @apiGroup Proposition
     *
     * @apiParam {String} token Token de la session en cours (donné par secret)
     * @apiParam {String} digest Hash du login, password, date, token & nonce
     * @apiParam {String} date Date utilisée pour la génération du digest
     * @apiParam {String} label Titre de la proposition
     * @apiParam {String} description Description de la proposition
     * @apiParam {Number} domainId Id du domaine de la proposition
     * @apiParam {Number} parentId (Facultatif, amendements seulement) Id de la proposition à laquelle est rattachée cet amendement
    */
    create(req, res) {
        // Ajoute une proposition
        var self = this;
        return self._checkAuth(req, res, function(authReq) {
            var userId = authReq.userId;
            var label = authReq.body.label || null;
            var description = authReq.body.description || null;
            var domainId = parseInt(authReq.body.domainId) || null;
            var parentId = parseInt(authReq.body.parentId) || null;
            if (!label || !description || !domainId) return res.sendStatus(400);
            var query = 'INSERT INTO proposition (label, description, userId, domainId' + ((!parentId) ? '' : ', parentId') +') ';
            query += 'VALUES (' + self.mySQL.escape(label) + ', ' + self.mySQL.escape(description) + ', ' + userId + ', ' + domainId + ((!parentId) ? '' : ', ' + parentId) + ')';
            return self.mySQL.query(query, function() {
                return res.sendStatus(201);
            });
        });
    };

    /**
     * @api {post} /vote Fait expirer le token de session du user
     * @apiName vote
     * @apiGroup Proposition
     *
     * @apiParam {String} token Token de la session en cours (donné par secret)
     * @apiParam {String} digest Hash du login, password, date, token & nonce
     * @apiParam {String} date Date utilisée pour la génération du digest
     * @apiParam {String} vote 'Y' (yes), 'N' (no) ou 'B' (blanc)
     * @apiParam {Number} propositionId Id de la proposition
    */
    vote(req, res) {
        // Vote (positif ou négatif) pour une proposition
        var self = this;
        return self._checkAuth(req, res, function(req, res) {
            var userId = req.userId;
            var vote = req.body.vote || null;
            var propositionId = parseInt(req.body.propositionId) || null;
            if (!vote || !propositionId) return res.sendStatus(400);
            var query = 'REPLACE INTO vote (userId, propositionId, vote) VALUES ('+ userId +', ' + propositionId + ', ' + self.mySQL.escape(vote) + ')';
            return self.mySQL.query(query, function(err) {
                if (err) res.sendStatus(500);
                query = 'SELECT 1 ';
                query += 'FROM expert AS e ';
                query += 'INNER JOIN proposition AS p ON p.domainId = e.domainId AND p.id = ' + propositionId+ ' ';
                query += 'WHERE e.userId = ' + userId;
                return self.mySQL.query(query, function(err, rows) {
                    if (err) res.sendStatus(500);
                    if (rows.length === 0) return res.sendStatus(201);
                    query = 'SELECT d.userId AS id ';
                    query += 'FROM expert AS e ';
                    query += 'INNER JOIN delegation AS d ';
                    query += 'WHERE e.userId = ' + userId;
                    return self.mySQL.query(query, function(err, rows) {
                        if (err) res.sendStatus(500);
                        return async.each(rows, function(row, callback) {
                            var id = row.id;
                            query = 'INSERT IGNORE INTO vote (userId, propositionId, vote) VALUES ('+ id +', ' + propositionId + ', ' + self.mySQL.escape(vote) + ')';
                            return self.mySQL.query(query, callback);
                        }, function(err) {
                            if(err) return res.sendStatus(500);
                            return res.sendStatus(201);
                        });
                    });
                });
            });
        });
    };

    /**
     * @api {post} /getProposition Retourne toutes les propositions, amené à évoluer avec des paramètres optionnels
     * @apiName getProposition
     * @apiGroup Proposition
    */
    get(req, res) {
        // Retourne une ou des propositions
        var self = this;
        self._checkAuthOpt(req, res, function(authReq) {
            var query = 'SELECT id, label, description, creationDate, domainId, parentId FROM proposition';
            return self.mySQL.query(query, function(err, rows) {
                if (err) return res.sendStatus(500);
                return res.json(rows);
            });
        });
    };
};

module.exports = PropositionWS;