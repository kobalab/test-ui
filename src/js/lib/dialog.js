/*
 *  Majiang.UI.HuleDialog
 */
"use strict";

const $ = require('jquery');

const Majiang = require('@kobalab/majiang-core');

const Shoupai = require('./shoupai');
const Shan    = require('./shan');

const { hide, show, fadeIn, fadeOut } = require('./fadein');

module.exports = class HuleDialog {

    constructor(root, pai) {
        this._root = root;
        this._pai  = pai;

        this._r_hupai = $('.r_hupai', root);
        this._r_defen = $('.r_defen', root);
    }

    hule(hule) {

        const root = this._root;

        new Shoupai($('.shoupai', root), this._pai,
                    Majiang.Shoupai.fromString(hule.shoupai)).redraw(true);

        $('.hupai', root).empty();

        if (hule.hupai) {
            for (let hupai of hule.hupai) {
                let r_hupai = this._r_hupai.clone();
                $('.name', r_hupai).text(hupai.name);
                $('.fanshu', r_hupai).text(`${hupai.fanshu}翻`);
                $('.hupai').append(r_hupai);
            }
            let r_defen = this._r_defen.clone();
            $('.defen', r_defen).text(
                    `${hule.fu}符 ${hule.fanshu}翻 ${hule.defen}点`);
            $('.hupai').append(r_defen);
        }
        else {
            let r_hupai = this._r_hupai.clone();
            $('.name', r_hupai).text('役なし');
            $('.hupai').append(r_hupai);
        }
        fadeIn(root);

        return this;
    }
}
