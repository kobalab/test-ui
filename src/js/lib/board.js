/*
 *  Majiang.UI.Board
 */
"use strict";

const $ = require('jquery');

const Shoupai    = require('./shoupai');
const Shan       = require('./shan');
const He         = require('./he');
const HuleDialog = require('./dialog');

const { hide, show, fadeIn, fadeOut } = require('./fadein');

const class_name  = ['main','xiajia','duimian','shangjia'];
const feng_hanzi  = ['東','南','西','北'];
const jushu_hanzi = ['一局','二局','三局','四局'];

const say_text   = { chi:   'チー',
                     peng:  'ポン',
                     gang:  'カン',
                     lizhi: 'リーチ',
                     rong:  'ロン',
                     zimo:  'ツモ'    };

function score(root, model, viewpoint) {

    $('.jushu', root).text(feng_hanzi[model.zhuangfeng]
                            + jushu_hanzi[model.jushu]);
    $('.changbang', root).text(model.changbang);
    $('.lizhibang', root).text(model.lizhibang);

    for (let l = 0; l < 4; l++) {

        let id = model.player_id[l];
        let defen = '' + model.defen[id];
        defen = defen.replace(/(\d*)(\d{3})$/, '$1,$2');
        defen = feng_hanzi[l] + ': ' + defen;

        let c = class_name[(4 + id - viewpoint) % 4];
        $(`.defen .${c}`, root).text(defen);
    }
}

module.exports = class Board {

    constructor(root, pai, audio, model) {

        this._model = model;
        this._pai   = pai;
        this._view  = {
            shoupai: [],
            he:      [],
        };

        this.sound_on = true;

        this.set_audio(audio);
    }

    set_audio(audio) {
        this._audio = {};
        for (let name of Object.keys(say_text)) {
            this._audio[name] = [];
            for (let l = 0; l < 4; l++) this._audio[name][l] = audio(name);
        }
        this._audio.dapai = audio('dapai');
        this._audio.gong  = audio('gong');
    }

    kaiju() {
        this._viewpoint = 0;
        return this;
    }

    redraw(viewpoint) {

        if (viewpoint != null) this._viewpoint = viewpoint;
        else                   viewpoint = this._viewpoint;

        const model = this._model, view = this._view;

        score($('.score', this._root), model, viewpoint);

        view.shan = new Shan($('.score .shan', this._root), this._pai,
                                model.shan).redraw();

        for (let l = 0; l < 4; l++) {
            let c    = class_name[(4 + model.player_id[l] - viewpoint) % 4];
            let open = model.player_id[l] == viewpoint;

            view.shoupai[l]
                    = new Shoupai($(`.shoupai.${c}`, this._root),
                                    this._pai, model.shoupai[l]
                                ).redraw(open);

            view.he[l] = new He($(`.he.${c}`, this._root),
                                    this._pai, model.he[l]
                                ).redraw();
        }
        this._lunban = model.lunban;

        return this;
    }

    update(msg = {}) {

        const model = this._model, view = this._view;

        if (this._lunban >= 0 && this._lunban != model.lunban) {
            view.he[this._lunban].redraw();
            view.shoupai[this._lunban].redraw();
        }

        if (msg.zimo) {
            view.shan.update();
            view.shoupai[msg.zimo.l].redraw();
        }
        else if (msg.dapai) {
            view.shoupai[msg.dapai.l].dapai(msg.dapai.p);
            if (this.sound_on) {
                this._audio.dapai.currentTime = 0;
                this._audio.dapai.play();
            }
            view.he[msg.dapai.l].dapai(msg.dapai.p);
        }
        else if (msg.fulou) {
            view.shoupai[msg.fulou.l].redraw();
        }
        else if (msg.gang) {
            view.shoupai[msg.gang.l].redraw();
        }
        else if (msg.gangzimo) {
            view.shan.update();
            view.shoupai[msg.gangzimo.l].redraw();
        }
        else if (msg.kaigang) {
            view.shan.redraw();
        }

        class_name.forEach(c => $(`.${c}`, this._root).removeClass('lunban'));
        if (model.lunban >= 0) {
            let id = model.player_id[model.lunban];
            let c  = class_name[(4 + id - this._viewpoint) % 4];
            $(`.${c}`, this._root).addClass('lunban');
        }
        this._lunban = model.lunban;

        return this;
    }

    say(name, l) {
        if (this.sound_on) {
            this._audio[name][l].currentTime = 0;
            this._audio[name][l].play();
        }
        return this;
    }

    summary(...param) { console.log('*** summary:', param) }
}
