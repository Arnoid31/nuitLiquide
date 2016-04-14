'use strict';

var mysql           = require('mysql');
var ServerConfig    = require('./../config/ServerConfig');

class MySQL {
    constructor() {
        var self = this;
        var serverConfig = new ServerConfig();
        this.connection = mysql.createConnection(serverConfig.getMySQLConfig());
        this.connection.connect();
    };

    query(str_query, func_callback) {
        console.log(str_query);
        this.connection.query(str_query, function(err, rows, fields) {
            if (err) throw err;
            return func_callback(rows, fields);
        });
    };

    close() {
        this.connection.end();
    };

    escape(str_field) {
        return mysql.escape(str_field);
    };
};

module.exports = MySQL;