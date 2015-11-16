var fs = require('fs');
var uuid = require('uuid');
var utils = require('./utils.js');


// Exported functions
exports.add_record = add_record;

// Add record
function add_record(book, action_detail, related_action, related_ruuid) {
    if (book == null || action_detail == null ) {
        return {
            "return_code" : -1
        };
    }

    var now = new Date();

    // Check if this is a new record chain for this uid
    if (!book.hasOwnProperty(action_detail.uid)) {
        book[action_detail.uid] = {};
    }

    // for action that no related action/record uuid (ruuid) is necessary
    if (related_action == null || related_ruuid == null) {
        record_uuid = uuid.v4();
        record_key = record_uuid;
        book[action_detail.uid][record_key] = {
            "token" : action_detail.rtoken,
            "action" : action_detail.action,
            "uid" : action_detail.uid,
            "timestamp"  : now.getTime(),
            "uuid" : record_uuid,
            "related_records" : []
        };

        return {
            "return_code" : 0,
            "key" : record_uuid,
            "uuid" : record_uuid
        };
    }
    else { 
        // This is an action related to a previous action
        // Add a new record in first
        record_digest = add_record(book, action_detail, null, null);
        if (record_digest.return_code === 0) {
            // Find related records by related_ruuid
            if (book[action_detail.uid].hasOwnProperty(related_ruuid)) {
                // Verify related action
                if (book[action_detail.uid][related_ruuid].action === related_action) {
                // Found, add digest so they can be linked 
                    book[action_detail.uid][related_ruuid].related_records.push({
                        "action" : action_detail.action,
                        "key" : record_digest.key
                    });

                    return {
                        "return_code" : 0,
                        "key" : record_uuid,
                        "uuid" : record_uuid
                    };
                }
            }

            // Cannot find related records or related action does not match
            return {
                "return_code" : 1,
                "key" : record_uuid,
                "uuid" : record_uuid
            };
        }
    }
}
