'use strict';

var WebService = require('../libs/WebService');

class MessageWS extends WebService {
    constructor() {
        super();
    };

    /**
     * @api {post} /delegation/delete Supprime le message
     * @apiName Deletemessage
     * @apiGroup Message
     *
     * @apiParam {String} token Token de la session en cours (donné par secret)
     * @apiParam {String} digest Hash du login, password, date, token & nonce
     * @apiParam {String} date Date utilisée pour la génération du digest
     * @apiParam {Number} messageId Id du message à supprimer
     */
    delete(req, res) {
        var self = this;
        return self._checkAuth(req, res, function(req, res) {
            var userId = req.userId;
            var messageId = parseInt(req.body.messageId) || null;
            if (!messageId) return res.sendStatus(400);
            var query = 'DELETE FROM message WHERE userId = ' + userId + ' AND id = ' + messageId;
            return self.mySQL.query(query, function(err) {
                if (err) return res.sendStatus(500);
                return res.sendStatus(201);
            });
        });
    };

    /**
     * @api {post} /messageId/get Retourne les messages du user
     * @apiName GetmessageId
     * @apiGroup Message
     *
     * @apiParam {String} token Token de la session en cours (donné par secret)
     * @apiParam {String} digest Hash du login, password, date, token & nonce
     * @apiParam {String} date Date utilisée pour la génération du digest
     * @apiParam {Boolean} isRed (facultatif) Retourne uniquement les messages lus/non lus
     * @apiParam {Number} limit (facultatif, défaut 10) Nombre de lignes à retourner
     * @apiParam {Number} offset (facultatif, défaut 0) Début des lignes à retourner
     */
    get(req, res) {
        var self = this;
        return self._checkAuth(req, res, function(authReq) {
            var userId = authReq.userId;
            var limit = parseInt(authReq.body.limit) || 10;
            var offset = parseInt(authReq.body.offset) || 0;
            var isRed = authReq.body.isRed || null;
            if (isRed != null && isRed != true && isRed != false) isRed = null;
            if (isRed != null && isRed == true) isRed = 1;
            if (isRed != null && isRed == false) isRed = 0;
            var query = 'SELECT m.id AS id, m.label AS label, m.content AS content, m.isRed AS isRed, m.creationDate AS creationDate ';
            query += 'FROM message AS m ';
            query += 'WHERE m.userId = ' + userId + ' ';
            if (isRed) query += 'AND m.isRed = ' + isRed + ' ';
            query += 'LIMIT ' + limit + ' OFFSET ' + offset + ' ';
            return self.mySQL.query(query, function(err, rows) {
                if (err) return res.sendStatus(500);
                return res.json(rows);
            });
        });
    };
};

module.exports = MessageWS;