var assert = require('assert');
var book_keeper = require('../book_keeper.js');

describe('add_record', function(){
    var book = {};

    it('returns return_code = -1 if no parameter is given', function(){
        assert.equal(-1, book_keeper.add_record(null, null).return_code);
    })

    var record_digest = {};
    it('returns valid UUID if a simple record is inserted', function(){
        record_digest = book_keeper.add_record(book, 
            {
                "action" : "CHECKIN", 
                "rtoken" : "DEADBEEF", 
                "uid" : 7777
            },
            null, null);
        assert.equal(0, record_digest.return_code);
 //       assert.equal(true, record_digest.hasOwnProperty("uuid"));
        assert.equal(true, record_digest.hasOwnProperty("key"));
        //assert.equal(record_digest.uuid, record_digest.key);
    })

    var record_digest_followup = {};
    it('inserts a follow-up action and updates related action record', function(){
        record_digest_followup = book_keeper.add_record(book, 
            {
                "action" : "CHECKOUT", 
                "rtoken" : "DEADBEEF", 
                "uid" : 7777
            },
            "CHECKIN",
            record_digest.key);
        assert.equal(0, record_digest_followup.return_code);
        //console.log(JSON.stringify(book));
    })

})

