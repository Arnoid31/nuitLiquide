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
     *
     * @apiParam {String} token (facultatif) Token de la session en cours (donné par secret)
     * @apiParam {String} digest (facultatif) Hash du login, password, date, token & nonce
     * @apiParam {String} date (facultatif) Date utilisée pour la génération du digest
     * @apiParam {Number} propositionId (facultatif) Id de la proposition, retourne les amendements si renseigné
     * @apiParam {Number} domainId (facultatif) Id du domaine de l'expert
     * @apiParam {Number} expertId (facultatif) Id de l'expert
     * @apiParam {Array} vote (facultatif) 'Y', 'N' et/ou 'B' (toujours en array), retourne uniquement les propositions pour lesquelles le user a voté
     * @apiParam {Boolean} mine (facultatif) Retourne uniquement les propositions du user
     * @apiParam {Number} limit (facultatif, défaut 10) Nombre de lignes à retourner
     * @apiParam {Number} offset (facultatif, défaut 0) Début des lignes à retourner
     */
    get(req, res) {
        // Retourne une ou des propositions
        var propositionId = parseInt(req.body.propositionId) || null;
        var domainId = parseInt(req.body.domainId) || null;
        var expertId = parseInt(req.body.expertId) || null;
        var vote = req.body.vote || null;
        var mine = req.body.mine || null;
        if (mine != true && mine != false) mine = null;
        if (vote) {
            for (var int_voteIndex in vote) {
                if (vote[int_voteIndex] != 'Y' && vote[int_voteIndex] != 'N' && vote[int_voteIndex] != 'B') {
                    delete vote[int_voteIndex];
                }
            }
        }
        if (vote && vote.length === 0) vote = null;
        var limit = parseInt(req.body.limit) || 10;
        var offset = parseInt(req.body.offset) || 0;
        var self = this;
        return self._checkAuthOpt(req, res, function(authReq) {
            var userId = authReq.userId || null;
            var fields = [
                'p.id AS id',
                'label',
                'description',
                'p.creationDate AS creationDate',
                'p.domainId AS domainId',
                'parentId'
            ];
            if (expertId) fields.push('v.vote AS expertVote');
            if (userId) fields.push('v2.vote AS myVote');
            var query = 'SELECT ' + fields.join(', ') + ' FROM proposition AS p ';
            if (expertId) query += 'INNER JOIN vote AS v ON v.propositionId = p.id ';
            if (expertId) query += 'INNER JOIN expert AS e ON e.userId = v.userId AND e.domainId = p.domainId ';
            if (userId && !vote) query += 'LEFT JOIN vote AS v2 ON v2.propositionId = p.id AND v2.userId = ' + userId + ' ';
            if (userId && vote) query += 'INNER JOIN vote AS v2 ON v2.propositionId = p.id AND v2.userId = ' + userId + ' AND v2.vote IN (' + vote.join(',') + ') ';
            var criteria = ['p.parentId IS NULL'];
            if (domainId) criteria.push('p.domainId = ' + domainId);
            if (userId && (mine == true)) criteria.push('p.userId = ' + userId);
            if (userId && (mine == false)) criteria.push('p.userId != ' + userId);
            if (propositionId) criteria.push('p.id = ' + propositionId);
            query += 'WHERE ' + criteria.join(' AND ') + ' ';
            query += 'LIMIT ' + limit + ' OFFSET ' + offset;
            return self.mySQL.query(query, function(err, rows) {
                if (err) return res.sendStatus(500);
                if (propositionId) {
                    subQuery = 'SELECT p.id, label, description, creationDate, domainId, parentId FROM proposition WHERE parentId = ' + rows[0].id + ' ';
                    return self.mySQL.query(subQuery, function(err, rows2) {
                        if (err) return res.sendStatus(500);
                        if (rows2.length > 0) rows[0].amendements = rows2;
                        return res.json(rows);
                    });
                }
                return res.json(rows);
            });
        });
    };
};

module.exports = PropositionWS;
