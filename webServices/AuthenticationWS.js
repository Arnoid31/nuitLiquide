'use strict';

var WebService = require('../libs/WebService');

class AuthenticationWS extends WebService {
    constructor() {
        super();
    };

    secret(req, res) {
        // Cr�e le token, renvoie secret
    };

    login(req, res) {
        // V�rifie hash, ajoute nonce dans token
    };

    logout(req, res) {
        // Fait expirer l'ensemble des tokens actifs
    };

    checkAuth(req, res) {
        // Ajoute userId dans req si trouv� � partir de token
    };
};

module.exports = AuthenticationWS;