/* global module */

'use strict';

module.exports = {
    readStream : function(stream, done) {
        var buffer = '';
        stream.on('data', function(chunk) {
            return buffer += chunk;
        }).on('end', function() {
            return done(null, buffer);
        }).on('error', function(error) {
            return done(error);
        });
    }
};
