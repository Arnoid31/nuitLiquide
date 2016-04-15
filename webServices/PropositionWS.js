'use strict';

var WebService = require('../libs/WebService');
var async = require('async');

class PropositionWS extends WebService {
    constructor() {
        super();
    };

    add(req, res) {
        // Ajoute une proposition
        var self = this;
        return self._checkAuth(req, res, function(req, res) {
            var label = req.body.label || null;
            var description = req.body.label || null;
            var domainId = parseInt(req.body.domainId) || null;
            var parentId = parseInt(req.body.parentId) || null;
            if (!label || !description || !domainId) return res.sendStatus(400);
            var query = 'INSERT INTO proposition (label, description, domainId' + ((!parentId) ? '' : ', parentId') +') ';
            query += 'VALUES (' + self.mySQL.escape(label) + ', ' + self.mySQL.escape(description) + ', ' + domainId + ((!parentId) ? '' : ', ' + parentId) + ')';
            return self.mySQL.query(query, function() {
                return res.sendStatus(201);
            });
        });
    };

    vote(req, res) {
        // Vote (positif ou négatif) pour une proposition
        var self = this;
        return self._checkAuth(req, res, function(req, res) {
            var userId = req.userId;
            var vote = req.body.vote || null;
            var propositionId = parseInt(req.body.propositionId) || null;
            if (!vote || !propositionId) return res.sendStatus(400);
            var query = 'REPLACE INTO vote (userId, propositionId, vote) VALUES ('+ userId +', ' + propositionId + ', ' + self.mySQL.escape(vote) + ')';
            return self.mySQL.query(query, function() {
                query = 'SELECT 1 ';
                query += 'FROM expert AS e ';
                query += 'INNER JOIN proposition AS p ON p.domainId = e.domainId AND p.id = ' + propositionId;
                query += 'WHERE e.userId = ' + userId;
                return self.mySQL.query(query, function(rows) {
                    if (rows.length === 0) return res.sendStatus(201);
                    query = 'SELECT d.userId AS id ';
                    query += 'FROM expert AS e ';
                    query += 'INNER JOIN delegation AS d ';
                    query += 'WHERE e.userId = ' + userId;
                    return self.mySQL.query(query, function(rows) {
                        async.each(rows, function(row, callback) {
                            var id = row.id;
                            query = 'INSERT IGNORE INTO vote (userId, propositionId, vote) VALUES ('+ id +', ' + propositionId + ', ' + self.mySQL.escape(vote) + ')';
                            self.mySQL.query(query, callback);
                        }, function() {
                            return res.sendStatus(201);
                        });
                    });
                });
            });
        });
    };

    get(req, res) {
        // Retourne une ou des propositions
    };
};

module.exports = PropositionWS;