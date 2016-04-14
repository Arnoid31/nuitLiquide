'use strict';

var WebService = require('../libs/WebService');

class AuthenticationWS extends WebService {
    constructor() {
        super();
    };

    secret(req, res) {
        // Crée le token, renvoie secret
    };

    login(req, res) {
        // Vérifie hash, ajoute nonce dans token
    };

    logout(req, res) {
        // Fait expirer l'ensemble des tokens actifs
    };

    checkAuth(req, res) {
        // Ajoute userId dans req si trouvé à partir de token
    };
};

module.exports = AuthenticationWS;