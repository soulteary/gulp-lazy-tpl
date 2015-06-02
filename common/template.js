/* global module, require */

'use strict';

var conf = require('../conf/config');
var gutil = require('gulp-util');
var through = require('through2');
var PluginError = gutil.PluginError;
var helper = require('./helper');

module.exports = function(params, template) {

    // 根据参数选择渲染模式
    if (params.length) {
        params.mode = params.mode || 'normal';
    } else {
        params.mode = 'normal';
    }

    return through.obj(function(file, enc, callback) {
        var complete = function(error, contents) {
            if (error) {
                this.emit('error', new PluginError(conf.PLUGIN_NAME, error));
                if (callback) {
                    callback();
                }
                return false;
            } else {
                try {
                    file.contents = template(file, contents, params);
                    this.push(file);
                    if (callback) {
                        callback();
                    }
                    return true;
                } catch (exception) {
                    this.emit('error', new PluginError(conf.PLUGIN_NAME, exception, {fileName : file.path}));
                }
            }
        }.bind(this);
        if (file.isBuffer()) {
            return complete(null, file.contents.toString());
        } else if (file.isStream()) {
            return helper.readStream(file.contents, complete);
        }
    });
};
