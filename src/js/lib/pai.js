/*
 *  Majiang.UI.pai
 */
"use strict";

const $ = require('jquery');
const _label = require('./label')('pai');

module.exports = function(loaddata, label = _label) {

    const pai = {};

    $('.pai', loaddata).each((i, n)=>{
        let p = $(n).data('pai');
        if ($(n).attr('alt') != null) $(n).attr('alt', label[p]);
        else                          $(n).attr('aria-label', label[p]);
        pai[p] = $(n);
    });

    return function(p){
        return pai[p.slice(0,2)].clone();
    }
}
