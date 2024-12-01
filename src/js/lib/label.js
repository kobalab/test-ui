/*
 *  label.js
 */
"use strict";

function pai() {
    const suit  = { m: 'ワン', p: 'ピン', s: 'ソー' };
    const num   = [ '赤ウー', 'イー', 'リャン', 'サン', 'スー',
                   'ウー', 'ロー', 'チー', 'パー', 'キュー' ];
    const zipai = [ 'トン', 'ナン', 'シャー', 'ペー', 'ハク', 'ハツ', 'チュン' ];
    let rv = {};
    for (let s of ['m','p','s','z']) {
        for (let n = 0; n <= 9; n++) {
            if (s != 'z')            rv[s+n] = num[n] + suit[s];
            else if (0 < n && n < 8) rv[s+n] = zipai[n-1];
        }
    }
    return rv;
}

function mianzi() {
    return {
        '+':      'シモチャから',
        '=':      'トイメンから',
        '-':      'カミチャから',
        chi:      'チー',
        peng:     'ポン',
        minggang: 'カン',
        gang:     'カカン',
        angang:   'アンカン',
    };
}

module.exports = function(type) {
    if (type == 'pai')      return pai();
    if (type == 'mianzi')   return mianzi();
}
