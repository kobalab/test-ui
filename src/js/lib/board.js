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

module.exports = class Board {

    constructor(root, pai, audio, model) {
        this._model = model;
    }

    kaiju() {
        console.log('**** START ****');
    }

    redraw() {
        const model = this._model;
        console.log('**', feng_hanzi[model.zhuangfeng]
                        + jushu_hanzi[model.jushu]
                        + ` ${model.changbang}本場`);
    }

    update(data) {
        const model = this._model;
        console.log('* 牌数:',  model.shan.paishu);
    }

    say(...param)     { console.log('* say:',     param) }
    summary(...param) { console.log('*** summary:', param) }
}
