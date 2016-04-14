'use strict';

var WebService = require('../libs/WebService');

class UserWS extends WebService {
    constructor() {
        super();
    };

    delegate(req, res) {
        // Ajoute ligne dans expert
    };

    undelegate(req, res) {
        // Retire une ligne dans expert
    };

    create(req, res) {
        // Ajoute une ligne dans user (valide false), envoie un mail
    };

    delete(req, res) {
        // Retire une ligne dans user
    };

    verify(req, res) {
        // Passe un user à valide
    };
};

module.exports = UserWS;