/* global describe, it */

'use strict';

var lazyTpl = require('../');
var gutil = require('gulp-util');

describe('lodash Template', function() {
    it('should process files with default options just as expected :)', function(done) {
        var stream = lazyTpl('lodash', {mode : 'amd', commentHeader : false});
        var tplContent = 'hello <%= user %>!';

        stream.on('data', function(file) {
            var finalContent = file.contents.toString().trim().replace(/\n/g, '');
            var expectContent = '/* global define */define(function () {    \'use strict\';return function (obj) {obj || (obj = {});var __t, __p = \'\', __e = _.escape;with (obj) {__p += \'hello \' +((__t = ( user )) == null ? \'\' : __t) +\'!\';}return __p}});';
            finalContent.should.equal(expectContent);
        });

        stream.once('end', function() {
            done();
        });

        var file = new gutil.File({
            path     : 'name.html',
            cwd      : './',
            base     : './',
            contents : new Buffer(tplContent)
        });
        stream.write(file);
        stream.end();
    });

    it('should not throw errors inside a stream', function(done) {
        var stream = lazyTpl('lodash', {mode : 'amd', commentHeader : false});
        var tplContent = '<div>hello <%!= user %>!</div>';

        stream.on('end', function() {
            done();
        });

        stream.on('error', function(e) {
            e.message.should.eql('Unexpected token !=');
            done();
        });

        var file = new gutil.File({
            path     : 'name.html',
            cwd      : './',
            base     : './',
            contents : new Buffer(tplContent)
        });
        stream.write(file);
        stream.end();
    });
});
