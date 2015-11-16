/**
 * This module manages tokens of icheck-in service
 *
 * */

var fs = require('fs');
var utils = require('./utils.js');

var rtoken_files = 'tokens_records.json';
var atoken_files = 'auth_tokens_records.json';

// File that contains tokens used for making requests - rtoken
var tokens_records = {};
if (utils.fileExists(rtoken_files)) {
    tokens_records = JSON.parse(fs.readFileSync(rtoken_files, 'utf8'));
}

// File that contains one-time use authentication token (atoken) vs request token (rtoken)
var auth_tokens_records = {};
if (utils.fileExists(atoken_files)) {
    auth_tokens_records = JSON.parse(fs.readFileSync(atoken_files, 'utf8'));
}

// Exported functions
exports.retrieve_rtoken = retrive_rtoken_by_atoken;
exports.validate_rtoken = validate_rtoken;

// Validate request token
function validate_rtoken(rtoken, secret) {
    if (rtoken == null || secret == null) {
        return -1;
    }

    if (tokens_records[rtoken] == null) {
        return -1;
    }
    else {
        // check if expired
        now = new Date();
        if ((tokens_records[rtoken].expire != -1) && (tokens_records[rtoken].expire < now.getTime())) {
            return -1;
        }
        else {
            return tokens_records[rtoken].uid;
        }
    }
}

// Get request token by auth-token and secret
function retrive_rtoken_by_atoken(atoken, secret) {
    if (atoken == null || secret == null) {
        return null;
    }

    // No such auth-token
    if (auth_tokens_records[atoken] == null) {
        return null;
    }
    else {
        //
        //TODO: make use of secret
        //
        // auth-token valid
        rtoken = auth_tokens_records[atoken].rtoken;

        // Decrease counter by 1
        auth_tokens_records[atoken].total = auth_tokens_records[atoken].total - 1;

        // Used up token, remove it
        if (auth_tokens_records[atoken].total == 0) {
            delete auth_tokens_records[atoken];
        }

        // Return it
        return rtoken;
    }
}

