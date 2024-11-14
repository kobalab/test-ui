/*
 *  Majiang.UI.pai
 */
"use strict";

const $ = require('jquery');

module.exports = function(loaddata) {

    const pai = {};

    $('.pai', loaddata).each((i, n)=>{
        let p = $(n).data('pai');
        pai[p] = $(n);
    });

    return function(p){
        return pai[p.slice(0,2)].clone();
    }
}
