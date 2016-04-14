'use strict';

class ServerConfig {
    constructor() {
        this.mInt_serverPort = ****;
        this.mObj_mySQLConfig = {
            host        : '****',
            user        : '****',
            password    : '****',
            database    : '****'
        };
    };

    getServerPort() {
        return this.mInt_serverPort;
    };

    getMySQLConfig() {
        return this.mObj_mySQLConfig
    };
};

module.exports = ServerConfig;
