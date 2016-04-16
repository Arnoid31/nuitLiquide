'use strict';

var app             = require('express')();
var server          = require('http').createServer(app);
var bodyParser      = require('body-parser');

app.use(function(req, res, next) {
    if (req.headers.origin) {
        res.header('Access-Control-Allow-Origin', '*')
        res.header('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,Authorization')
        res.header('Access-Control-Allow-Methods', 'GET,PUT,PATCH,POST,DELETE')
        if (req.method === 'OPTIONS') return res.sendStatus(200)
    }
    next()
})



var ServerConfig = require('./config/ServerConfig');
var ApiV1Routes = require('./config/ApiV1Routes');
var BaseRoutes = require('./config/BaseRoutes');

var serverConfig = new ServerConfig();
var apiV1Routes = new ApiV1Routes();
var baseRoutes = new BaseRoutes();

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(apiV1Routes.getRoute(), apiV1Routes.getRouter());
app.use(baseRoutes.getRoute(), baseRoutes.getRouter());

server.listen(serverConfig.getServerPort());
console.log('Listening on port ' + serverConfig.getServerPort());

