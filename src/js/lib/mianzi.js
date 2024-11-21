/*
 *  Majiang.UI.mianzi
 */
"use strict";

const $ = require('jquery');
const label = require('./label')('mianzi');

module.exports = function(pai) {

    function get_label(p) {
        return pai(p).attr('alt')
                    ? [ 'alt',        pai(p).attr('alt')        ]
                    : [ 'aria-label', pai(p).attr('aria-label') ];
    }

    return function(m) {
        let mianzi = $('<span>').addClass('mianzi');
        let s = m[0];
        if (m.replace(/0/g,'5').match(/^[mpsz](\d)\1\1\1$/)) {
            let nn = m.match(/\d/g);
            mianzi.attr('aria-label', label.angang)
                  .append(pai('_').attr(...get_label(s+nn[0])))
                  .append(pai(s+nn[2]))
                  .append(pai(s+nn[3]))
                  .append(pai('_').attr(...get_label(s+nn[1])));
        }
        else if (m.replace(/0/g,'5').match(/^[mpsz](\d)\1\1/)) {
            let gang  = m.match(/[\+\=\-]\d$/);
            let d     = m.match(/[\+\=\-]/);
            let nn    = m.match(/\d/g);
            let pai_s = pai(s+nn[0]);
            let pai_e = (! gang && nn.length == 4)
                                         ? nn.slice(1, 3).map(n=>pai(s+n))
                                         : nn.slice(1, 2).map(n=>pai(s+n));
            let pai_r = $('<span>').addClass('rotate')
                            .append(gang ? nn.slice(-2).map(n=>pai(s+n))
                                         : nn.slice(-1).map(n=>pai(s+n)));
            mianzi.attr('aria-label', label[d]
                            + (  gang           ? label.gang
                               : nn.length == 4 ? label.minggang
                               :                  label.peng ));
            if (d == '+') mianzi.append(pai_s).append(pai_e).append(pai_r);
            if (d == '=') mianzi.append(pai_s).append(pai_r).append(pai_e);
            if (d == '-') mianzi.append(pai_r).append(pai_s).append(pai_e);
        }
        else {
            let nn = m.match(/\d(?=\-)/).concat(m.match(/\d(?!\-)/g));
            mianzi.attr('aria-label', label.chi)
                  .append($('<span>').addClass('rotate').append(pai(s+nn[0])))
                  .append(pai(s+nn[1]))
                  .append(pai(s+nn[2]));
        }
        return mianzi;
    }
}
