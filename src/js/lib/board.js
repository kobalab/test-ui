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

class Score {

    constructor(root, model) {
        this._root  = root;
        this._model = model;
    }

    redraw() {

        const model = this._model;

        $('.jushu', this._root).text(
            feng_hanzi[model.zhuangfeng] + jushu_hanzi[model.jushu]);
        $('.changbang', this._root).text(model.changbang);
        $('.lizhibang', this._root).text(model.lizhibang);

        return this;
    }

    update() {
        return this;
    }
}

module.exports = class Board {

    constructor(root, pai, audio, model) {
        this._model = model;
        this._pai   = pai;
        this._view  = {
            score:   new Score($('.score', root), model),
            shoupai: [],
            he:      [],
        };
    }

    kaiju() {
        this._viewpoint = 0;
        return this;
    }

    redraw(viewpoint) {

        if (viewpoint != null) this._viewpoint = viewpoint;
        else                   viewpoint = this._viewpoint;

        const model = this._model, view  = this._view;

        view.score.redraw(viewpoint);

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

        console.log(msg);

        const model = this._model, view  = this._view;

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
            view.he[msg.dapai.l].dapai(msg.dapai.p);
        }

        this._lunban = model.lunban;

        return this;
    }

    say(...param)     { console.log('* say:',     param) }
    summary(...param) { console.log('*** summary:', param) }
}
