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
            score: new Score($('.score', root), model),
        };
    }

    kaiju() {
        console.log('*** kaiju');
        return this;
    }

    redraw() {

        const model = this._model;
        const view  = this._view;

        view.score.redraw();
        view.shan = new Shan($('.score .shan', this._root), this._pai,
                                model.shan).redraw();

        return this;
    }

    update(data) {

        const model = this._model;
        const view  = this._view;

        view.score.update();
        view.shan.update();

        return this;
    }

    say(...param)     { console.log('* say:',     param) }
    summary(...param) { console.log('*** summary:', param) }
}
