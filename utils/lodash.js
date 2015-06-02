/* global module, require */

'use strict';

/**
 * inspire by gulp-template
 */

var lodash = require('lodash').template;
var template = require('../common/template');
var path = require('path');

function getTemplate(content, option) {
    return lodash(content, option);
}

function process(file, contents, params) {
    var code = getTemplate(contents, params.option);
    var TPL = '';

    if (params.commentHeader) {
        TPL = '/**\n* {fileName}\n*\n* @date {date}\n*/\n';
        TPL = TPL.replace('{fileName}', path.basename(file.path, '.html'));
        TPL = TPL.replace('{date}', ((new Date()).toISOString().split('T'))[0]);
    }

    switch (params.mode) {
        case 'amd':
        case 'cmd':
            TPL += '/* global define */\ndefine(function () {\n    \'use strict\';\n\n';
            TPL += 'return ' + code;
            TPL += '\n});';
            break;
        case 'commonjs':
            TPL += '/* global module */\n\'use strict\';\n\n';
            TPL += 'module.exports = ' + code;
            break;
        default :
            return console.error('Not Support type:' + params.mode);
    }

    return new Buffer(TPL);
}

module.exports = function(params) {
    return template(params, process);
};
