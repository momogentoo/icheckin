/**
 *
 *  RESTful API service to respond check-in/out requests
 *
 */
var fs = require('fs');
var crypto = require('crypto');
var config = JSON.parse(fs.readFileSync('icheckin.json', 'utf8'));
var metadata = JSON.parse(fs.readFileSync('icheckin_meta.json', 'utf8'));
var restify = require('restify');
var server = restify.createServer(metadata);

var auth_tokens = require('./auth_tokens.js');
var book_keeper = require('./book_keeper.js');

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

var action_codes = {
    'checkin' : 0,
    'checkout' : 1,
    'ping' : 2,
    'auth' : 3,
    'dismiss' : 4
};

var book = {};

// Ping service by rtoken and return service meta data
function ping(req, res, next) {
    if (auth_tokens.validate_rtoken(req.params.rtoken, 'any') != -1) {
        console.log('[ping] ' + uid);
        res.send(metadata);
    }
    else {
        console.log('Unauthorized request: ' + req.params.rtoken);
        res.send(401);
    }
    return next();
}

function checkin(req, res, next) {
    var uid = -1;
    if ((uid = auth_tokens.validate_rtoken(req.params.rtoken, 'any')) == -1) {
        res.send(401);
    }

    console.log('[checkin] ' + uid);
    record_digest = book_keeper.add_record(book, {
        "rtoken" : req.params.rtoken,
        "action" : action_codes.checkin,
        "uid" : uid
    }, null, null);

    res.send(record_digest);

    console.log(JSON.stringify(book));

    return next();
}

function checkout(req, res, next) {
    var uid = -1;
    if ((uid = auth_tokens.validate_rtoken(req.params.rtoken, 'any')) == -1) {
        res.send(401);
    }

    // UUID of related action record is required
    if (!req.params.hasOwnProperty('ruuid')) {
        res.send(400);
    }

    console.log('[checkout] ' + uid);
    record_digest = book_keeper.add_record(book, {
        "rtoken" : req.params.rtoken,
        "action" : action_codes.checkout,
        "uid" : uid
    }, 
    action_codes.checkin, req.params.ruuid);

    res.send(record_digest);

    console.log(JSON.stringify(book));

    return next();
}

function track(req, res, next) {
}

server.get('/ping/:rtoken', ping);
server.get('/checkin/:rtoken', checkin);
server.get('/checkout/:rtoken', checkout);
server.get('/track/:rtoken', track);

server.listen(8080, function () {
    console.log('%s listening at %s', server.name, server.url);
});


