/*
 * Utility functions
 * */

var fs = require('fs');

// Check if file exists
exports.fileExists = function(filePath) {
    try
    {
        return fs.statSync(filePath).isFile();
    }
    catch (err)
    {
        return false;
    }
}
