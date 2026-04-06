/*
 *  Majiang.UI.Player
 */
"use strict";

const $ = require('jquery');
const Majiang = require('@kobalab/majiang-core');

const { hide, show, fadeIn }         = require('./fadein');
const { setSelector, clearSelector } = require('./selector');

const mianzi = require('./mianzi');

module.exports = class Player extends Majiang.Player {

    constructor(root, pai) {
        super();
        this._root = root;
        this._mianzi = mianzi(pai)

        this.clear_action();
    }

    callback(msg) {
        clearSelector('dailog');
        $('.dialog', this._root).off('click');
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
                        return false;
                    }));
    }

    select_action(callback = ()=>this.callback()) {
        const buttons = $('.select-action', this._root);
        if (! $('.button[role="button"]', buttons).length) return callback();
        this.add_action('cansel', callback);
        this._root.on('click', ()=>
            $('.select-action .button.cansel', this._root).trigger('click'));
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

    select_mianzi(mm) {
        const mianzi = $('.select-mianzi', this._root);
        mianzi.empty();
        for (let m of mm) {
            let msg = m.match(/\d/g).length == 4 ? { gang: m } : { fulou: m };
            mianzi.append(
                this._mianzi(m).attr('role','button').on('click', ()=>{
                    clearSelector('mianzi');
                    $('.mianzi', mianzi).off('click');
                    hide(mianzi);
                    return this.callback(msg)
                }));
        }
        show(mianzi.width($('.shoupai.main .bingpai', this._root).width()));
        setSelector($('.mianzi', mianzi), 'mianzi',
                    { forcus: null, touch: false });
        return false;
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
                $('.pai', bingpai).removeAttr('role').removeClass('blink');
                clearSelector('dapai');
                $(ev.target).addClass('dapai');
                return this.callback({ dapai: p });
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

        if (this.allow_pingju(this.shoupai)) {
            this.add_action('pingju', ()=> this.callback({daopai: '-'}));
        }

        let gang = this.get_gang_mianzi(this.shoupai);
        if (gang.length == 1) {
            this.add_action('gang', ()=> this.callback({ gang: gang[0] }));
        }
        else if (gang.length > 1) {
            this.add_action('gang', ()=> this.select_mianzi(gang));
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
        if (peng.length == 1) {
            this.add_action('peng', ()=> this.callback({ fulou: peng[0] }));
        }
        else if (peng.length > 1) {
            this.add_action('peng', ()=> this.select_mianzi(peng));
        }

        let chi = this.get_chi_mianzi(this.shoupai, p);
        if (chi.length == 1) {
            this.add_action('chi', ()=> this.callback({ fulou: chi[0] }));
        }
        else if (chi.length > 1) {
            this.add_action('chi', ()=> this.select_mianzi(chi));
        }

        this.select_action();
    }

    action_fulou(fulou) {

        if (fulou.l != this._menfeng) return this.callback();
        if (fulou.m.match(/^[mpsz]\d{4}/)) return this.callback();

        this.select_action(()=> this.select_dapai());
    }

    action_gang(gang) {

        if (gang.l == this._menfeng) return this.callback();
        if (gang.m.match(/^[mpsz]\d{4}$/)) return this.callback();

        let d = ['','+','=','-'][(4 + this._model.lunban - this._menfeng) % 4];
        let p = gang.m[0] + gang.m.slice(-1) + d;

        if (this.allow_hule(this.shoupai, p, true)) {
            this.add_action('rong', ()=> this.callback({ hule: '-' }));
        }

        this.select_action();
    }

    action_hule() {
        setSelector($('.dialog .submit', this._root), 'dialog',
                    { prev: null, next: null });
        $('.dialog', this._root).on('click', ()=> this.callback());
    }

    action_pingju() { this.action_hule() }

    action_jieju() {}
}
