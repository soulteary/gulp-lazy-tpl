/* global module, require */

'use strict';

/**
 * inspire by gulp-dotify
 */

var doT = require('dot').template;
var template = require('../common/template');
var path = require('path');

function getTemplate(content) {
    return doT(content).toString();
}

function process(file, contents, params) {
    var code = getTemplate(contents);
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
            // shim different form OSx to linux
            TPL += code.replace(/function anonymous\(it\W?.*\)/gm, 'function render(it)');
            TPL += '\n    return render;\n});';
            break;
        case 'commonjs':
            TPL += '/* global module */\n\'use strict\';\n\n';
            TPL += code.replace(/function anonymous\(it\W?.*\)/gm, 'module.exports = function render(it)');
            break;
        default :
            return console.error('Not Support type:' + params.mode);
    }

    return new Buffer(TPL);
}

module.exports = function(params) {
    return template(params, process);
};
