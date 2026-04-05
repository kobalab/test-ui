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

        this.clear_action();
    }

    callback(msg) {
        clearSelector('dailog');
        this._root.off('click');
        this._callback(msg);
        return false;
    }

    add_action(type, callback) {
        show($(`.select-action .button.${type}`, this._root)
                    .attr('role','button')
                    .on('click', ()=>{
                        this.clear_action();
                        callback();
                    }));
    }

    select_action(callback = ()=>this.callback()) {
        const buttons = $('.select-action', this._root);
        if (! $('.button[role="button"]', buttons).length) return callback();
        this.add_action('cansel', callback);
        show(buttons.width($('.shoupai.main .bingpai', this._root).width()));
        setSelector($('.button[role="button"]', buttons), 'action',
                    { focus: -1, touch: false });
    }

    clear_action() {
        const buttons = $('.select-action', this._root);
        clearSelector('action');
        hide($('.button', buttons).off('click').removeAttr('role'));
        hide(buttons);
    }

    select_dapai(lizhi) {

        const bingpai = $('.shoupai.main .bingpai', this._root);
        for (let p of lizhi || this.get_dapai(this.shoupai)) {
            let pai = p.slice(-1) == '_'
                        ? $(`.pai.zimo[data-pai="${p.slice(0,2)}"]`, bingpai)
                        : $(`.pai[data-pai="${p}"]`, bingpai)
            if (lizhi) {
                pai.addClass('blink');
                p += '*';
            }
            pai.attr('role','button').on('click', (ev)=>{
                clearSelector('dapai');
                $(ev.target).addClass('dapai');
                this.callback({ dapai: p });
            });
        }
        setSelector($('.pai[role="button"]', bingpai), 'dapai', { focus: -1 });
    }

    action_kaiju(kaiju) { this.callback() }
    action_qipai(qipai) { this.callback() }

    action_zimo(zimo, gangzimo) {

        if (zimo.l != this._menfeng) return this.callback();

        if (this.allow_hule(this.shoupai, null, gangzimo)) {
            this.add_action('zimo', ()=> this.callback({ hule: '-' }));
        }

        let gang = this.get_gang_mianzi(this.shoupai);
        if (gang.length) {
            this.add_action('gang', ()=> this.callback({ gang: gang[0] }));
        }

        if (this.shoupai.lizhi) {
            this.select_action(()=> this.callback({ dapai: zimo.p + '_' }));
            return;
        }

        let lizhi = this.allow_lizhi(this.shoupai);
        if (lizhi.length) {
            this.add_action('lizhi', ()=> this.select_dapai(lizhi));
        }

        this.select_action(()=> this.select_dapai());
    }

    action_dapai(dapai) {

        if (dapai.l == this._menfeng) return this.callback();

        let d = ['','+','=','-'][(4 + this._model.lunban - this._menfeng) % 4];
        let p = dapai.p + d;

        if (this.allow_hule(this.shoupai, p)) {
            this.add_action('rong', ()=> this.callback({ hule: '-' }));
        }

        let gang = this.get_gang_mianzi(this.shoupai, p);
        if (gang.length) {
            this.add_action('gang', ()=> this.callback({ fulou: gang[0] }));
        }
        let peng = this.get_peng_mianzi(this.shoupai, p);
        if (peng.length) {
            this.add_action('peng', ()=> this.callback({ fulou: peng[0] }));
        }
        let chi = this.get_chi_mianzi(this.shoupai, p);
        if (chi.length) {
            this.add_action('chi', ()=> this.callback({ fulou: chi[0] }));
        }

        this.select_action();
    }

    action_fulou(fulou) {

        if (fulou.l != this._menfeng) return this.callback();
        if (fulou.m.match(/^[mpsz]\d{4}/)) return this.callback();

        this.select_action(()=> this.select_dapai());
    }

    action_gang(gang) { this.callback() }

    action_hule() {
        setSelector($('.dialog .submit', this._root), 'dialog',
                    { prev: null, next: null });
        $('.dialog', this._root).on('click', ()=> this.callback());
    }

    action_pingju() { this.action_hule() }

    action_jieju() {}
}
