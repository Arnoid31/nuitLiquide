'use strict';

var WebService  = require('../libs/WebService');

class DomainWS extends WebService {
    constructor() {
        super();
    };

    /**
     * @api {get} domain/get Retourne la liste des domaines
     * @apiName Getdomain
     * @apiGroup Domain
     */
    get(req, res) {
        var self = this;
        var selectDomainQuery = 'SELECT * FROM domain';
        self.mySQL.query(selectDomainQuery, function(err, rows) {
            if (err) return res.sendStatus(500);
            return res.json(rows);
        });
    };
};

module.exports = DomainWS;