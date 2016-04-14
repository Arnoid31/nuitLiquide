'use strict';

var WebService = require('../libs/WebService');

class PropositionWS extends WebService {
    constructor() {
        super();
    };

    add(req, res) {
        // Ajoute une proposition
    };

    vote(req, res) {
        // Vote (positif ou négatif) pour une proposition
    };

    get(req, res) {
        // Retourne une ou des propositions
    };
};

module.exports = PropositionWS;