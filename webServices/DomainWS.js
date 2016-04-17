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
     *
     * @apiParam {Number} domainId (Facultatif) Id du domaine
     */
    get(req, res) {
        var self = this;
        var domainId = parseInt(req.body.domainId) || null;
        var selectDomainQuery = 'SELECT id, label FROM domain ';
        if (req.body.domainId) selectDomainQuery += 'WHERE id = ' + domainId;
        return self.mySQL.query(selectDomainQuery, function(err, rows) {
            if (err) return res.sendStatus(500);
            return res.json(rows);
        });
    };
};

module.exports = DomainWS;