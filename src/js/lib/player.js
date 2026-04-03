/*
 *  Majiang.UI.Player
 */
"use strict";

const $ = require('jquery');
const Majiang = require('@kobalab/majiang-core');

const { hide, show, fadeIn }         = require('./fadein');
const { setSelector, clearSelector } = require('./selector');

module.exports = class Player extends Majiang.Player {

    constructor(root) {
        super();
        this._root = root;
    }

    callback(reply) {
        this._root.off('click');
        this._callback(reply);
        return false;
    }

    select_dapai() {

        const bingpai = $('.shoupai.main .bingpai', this._root);
        for (let p of this.get_dapai(this.shoupai)) {
            let pai = p.slice(-1) == '_'
                        ? $(`.pai.zimo[data-pai="${p.slice(0,2)}"]`, bingpai)
                        : $(`.pai[data-pai="${p}"]`, bingpai)
            pai.attr('role','button').on('click', (ev)=>{
                $(ev.target).addClass('dapai');
                this.callback({ dapai: p });
            });
        }
        setSelector($('.pai[role="button"]', bingpai), 'dapai', { focus: -1 });
    }

    action_kaiju(kaiju) { this.callback() }
    action_qipai(qipai) { this.callback() }

    action_zimo(zimo) {

        if (zimo.l != this._menfeng) return this.callback();

        this.select_dapai();
    }

    action_dapai(dapai) { this.callback() }
    action_fulou(fulou) { this.callback() }
    action_gang(gang) { this.callback() }

    action_hule() {
        setTimeout(()=> {
            $('.dialog button', this._root).focus();
            this._root.on('click', ()=> this.callback());
        }, 800);
    }

    action_pingju() { this.action_hule() }

    action_jieju() {}
}
