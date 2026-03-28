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

    constructor(root, pai, model, viewpoint = 0) {
        this._root  = root;
        this._pai   = pai;
        this._model = model;
        this._viewpoint = viewpoint;

        this._r_hupai = $('.r_hupai', root).eq(0);
        this._r_defen = $('.r_defen', root).eq(0);
    }

    hule(hule) {

        const root = this._root;

        hide($('.pingju', root));
        show($('.hule', root));

        if (hule.fubaopai) show($('.shan .fubaopai', root));
        else               hide($('.shan .fubaopai', root));

        new Shan($('.shan', root), this._pai, this._model.shan).redraw();

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

        $('.changbang', this._node).text(this._model.changbang);
        $('.lizhibang', this._node).text(this._model.lizhibang);

        if (hule.fenpei) this.fenpei(hule.fenpei);

        fadeIn(root);

        return this;
    }

    pingju(pingju) {

        hide($('.hule', this._root));
        show($('.pingju', this._root));

        $('.pingju', this._root).text(pingju.name);

        if (pingju.fenpei) this.fenpei(pingju.fenpei);

        fadeIn(this._root);

        return this;
    }

    fenpei(fenpei) {

        const feng_hanzi = ['東','南','西','北'];
        const class_name = ['main','xiajia','duimian','shangjia'];

        $('.fenpei .diff', this._root).removeClass('plus minus');

        for (let l = 0; l < 4; l++) {

            let id = this._model.player_id[l];
            let c  = class_name[(4 + id - this._viewpoint) % 4];

            let root = $(`.fenpei .${c}`, this._root);

            $('.feng', root).text(feng_hanzi[l]);

            let name = this._model.player[id].replace(/\n.*$/,'');
            $('.name', root).text(name);

            let defen = ('' + this._model.defen[id])
                                    .replace(/(\d*)(\d{3})$/, '$1,$2');
            $('.defen', root).text(defen);

            let diff = fenpei[l];
            if      (diff > 0) $('.diff', root).addClass('plus');
            else if (diff < 0) $('.diff', root).addClass('minus');
            diff = diff > 0 ? '+' + diff
                 : diff < 0 ? '' + diff
                 :            '';
            diff = diff.replace(/(\d*)(\d{3})$/, '$1,$2');
            $('.diff', root).text(diff);
        }
    }

    hide() {
        hide(this._root);
        return this;
    }
}
