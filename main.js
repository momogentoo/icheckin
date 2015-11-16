/**
 *
 *  RESTful API server to respond check-in/out requests
 *
 */
var fs = require('fs');
var config = JSON.parse(fs.readFileSync('icheckin.json', 'utf8'));
var metadata = JSON.parse(fs.readFileSync('icheckin_meta.json', 'utf8'));
var restify = require('restify');
var server = restify.createServer(metadata);

var auth_tokens = require('./auth_tokens.js');

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

server.get('/ping/:rtoken', function (req, res, next) {
    //res.send(req.params);
    res.send(metadata);
    return next();
});

server.listen(8080, function () {
    console.log('%s listening at %s', server.name, server.url);
});


