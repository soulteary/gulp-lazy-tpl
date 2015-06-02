/* global describe, it */

'use strict';

var lazyTpl = require('../');
var gutil = require('gulp-util');

describe('doT Template', function() {
    it('should process files with default options just as expected :)', function(done) {
        var stream = lazyTpl('doT', {mode : 'amd', commentHeader : false});
        var tplContent = '';

        stream.on('data', function(file) {
            var finalContent = file.contents.toString().trim().replace(/\n/g, '');
            var expectContent = '/* global define */define(function () {    \'use strict\';function render(it) {var out=\'\';return out;}    return render;});';
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
        var stream = lazyTpl('doT', {mode : 'amd', commentHeader : false});
        var tplContent = '<div>{{!= it.name }}</div>';

        stream.on('end', function() {
            done();
        });

        stream.on('error', function(e) {
            e.message.should.eql('Unexpected token =');
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
