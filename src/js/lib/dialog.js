/*
 *  Majiang.UI.HuleDialog
 */
"use strict";

const $ = require('jquery');

const Majiang = require('@kobalab/majiang-core');

const Shoupai = require('./shoupai');
const Shan    = require('./shan');

const { hide, show, fadeIn, fadeOut } = require('./fadein');

function manguan(manguan) {

    return manguan >= 4 * 6 ? '六倍役満 '
         : manguan >= 4 * 5 ? '五倍役満 '
         : manguan >= 4 * 4 ? '四倍役満 '
         : manguan >= 4 * 3 ? 'トリプル役満 '
         : manguan >= 4 * 2 ? 'ダブル役満 '
         : manguan >= 4     ? '役満 '
         : manguan >= 3     ? '三倍満 '
         : manguan >= 2     ? '倍満 '
         : manguan >= 1.5   ? '跳満 '
         : manguan >= 1     ? '満貫 '
         :                    '';
}

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
                $('.fanshu', r_hupai).text(
                    hupai.fanshu + (hupai.fanshu[0] == '*' ? '' : '翻'));
                $('.hupai').append(r_hupai);
            }
            let r_defen = this._r_defen.clone();
            let defen = (hule.damanguan ? ' '
                                        : `${hule.fu}符 ${hule.fanshu}翻 `)
                      + manguan(hule.defen / (hule.l == 0 ? 6 : 4) / 2000);
            defen += `${hule.defen}点`
            $('.defen', r_defen).text(defen);
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
