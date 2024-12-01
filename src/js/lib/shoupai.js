/*
 *  Majiang.UI.Shoupai
 */
"use strict";

const $ = require('jquery');
const label = require('./label')('shoupai');

const mianzi = require('./mianzi');

module.exports = class Shoupai {

    constructor(root, pai, shoupai, open) {
        this._root    = root;
        this._pai     = pai;
        this._mianzi  = mianzi(pai);
        this._shoupai = shoupai;
        this._open    = open;
    }

    redraw(open) {

        if (open != null) this._open = open;
        const pai = this._open ? this._pai : ()=> this._pai('_');

        $('.bingpai', this._root).empty();
        let zimo = this._shoupai._zimo;
        for (let s of ['m','p','s','z']) {
            let bingpai = this._shoupai._bingpai[s];
            let n_hongpai = bingpai[0];
            for (let n = 1; n < bingpai.length; n++) {
                let n_pai = bingpai[n];
                if (s+n == zimo)           { n_pai--              }
                if (n == 5 && s+0 == zimo) { n_pai--; n_hongpai-- }
                for (let i = 0; i < n_pai; i++) {
                    let p = (n ==5 && n_hongpai > i) ? s+0 : s+n;
                    $('.bingpai', this._root).append(pai(p));
                }
            }
        }
        let n_pai = this._shoupai._bingpai._ + (zimo == '_' ? -1 : 0);
        for (let i = 0; i < n_pai; i++) {
            $('.bingpai', this._root).append(this._pai('_'));
        }
        if (zimo && zimo.length <= 2) {
            $('.bingpai', this._root).append(pai(zimo).addClass('zimo'));
        }

        $('.fulou', this._root).empty();
        for (let m of this._shoupai._fulou) {
            $('.fulou', this._root).append(this._mianzi(m));
        }

        return this;
    }

    adjust() {
        let shoupai = this._root.width();
        let bingpai = $('.bingpai', this._root).width();
        let fulou   = $('.fulou', this._root).width();
        if (fulou < shoupai) {
            let overflow = bingpai + fulou - shoupai;
            if (overflow > 0)
                $('.bingpai', this._root).css('margin-left', `${- overflow}px`);
            else
                $('.bingpai', this._root).css('margin-left', '');
        }
        else {
            $('.bingpai', this._root).css('margin-left', '');
        }
        return this;
    }

    dapai(p) {

        let dapai = $('.bingpai .pai.dapai', this._root);
        if (! dapai.length) {
            if (p[2] == '_') dapai = $('.bingpai .pai.zimo', this._root);
        }
        if (! dapai.length) {
            if (this._open) {
                dapai = $(`.bingpai .pai[data-pai="${p.slice(0,2)}"]`,
                          this._root).eq(0);
            }
            else {
                dapai = $('.bingpai .pai', this._root);
                dapai = dapai.eq(Math.random()*(dapai.length - 1)|0);
            }
        }
        dapai.addClass('deleted');

        return this;
    }
}
