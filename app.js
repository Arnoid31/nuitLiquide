'use strict';

var app             = require('express')();
var server          = require('http').createServer(app);
var bodyParser      = require('body-parser');

var ServerConfig = require('./config/ServerConfig');
var ApiV1Routes = require('./config/ApiV1Routes');

var serverConfig = new ServerConfig();
var apiV1Routes = new ApiV1Routes();

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(apiV1Routes.getRoute(), apiV1Routes.getRouter());

server.listen(serverConfig.getServerPort());
console.log('Listening on port ' + serverConfig.getServerPort());