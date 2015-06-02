/* global module, require */

'use strict';

module.exports = function(tplType, params) {

    if (!tplType) {
        throw('PLEASE SELECT A TPL TYPE.');
    }

    params = params || {};

    if (!params.hasOwnProperty('length')) {
        params.length = 0;
    }
    for (var item in params) {
        if (params.hasOwnProperty(item) && item !== 'length') {
            params.length += 1;
        }
    }

    switch (tplType) {
        case 'doT':
            return require('./utils/doT')(params);
        case 'lodash':
            return require('./utils/lodash')(params);
        default :
            throw('Do Not Support Template Type:' + tplType);
    }
};
