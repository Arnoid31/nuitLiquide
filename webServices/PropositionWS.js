'use strict';

var WebService = require('../libs/WebService');

class PropositionWS extends WebService {
    constructor() {
        super();
    };

    add(req, res) {
        // Ajoute une proposition
        var self = this;
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
    };

    vote(req, res) {
        // Vote (positif ou négatif) pour une proposition
        // TODO GERER les délégations
        var self = this;
        var userId = req.userId;
        var vote = req.body.vote || null;
        var propositionId = parseInt(req.body.propositionId) || null;
        if (!vote || !propositionId) return res.sendStatus(400);
        var query = 'REPLACE INTO vote (userId, propositionId, vote) VALUES ('+ userId +', ' + propositionId + ', ' + self.mySQL.escape(vote) + ')';
        return self.mySQL.query(query, function() {
            return res.sendStatus(200);
        });
    };

    get(req, res) {
        // Retourne une ou des propositions
    };
};

module.exports = PropositionWS;