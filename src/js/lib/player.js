/*
 *  Majiang.UI.Player
 */
"use strict";

const $ = require('jquery');
const Majiang = require('@kobalab/majiang-core');

const PaipuReader = require('./reader');

const { hide, show, fadeIn }         = require('./fadein');
const { setSelector, clearSelector } = require('./selector');

const mianzi = require('./mianzi');

const dir = {
    '+': 'シモチャ',
    '=': 'トイメン',
    '-': 'カミチャ',
};

const pai_label = require('./label')('pai');

module.exports = class Player extends Majiang.Player {

    constructor(root, pai, audio) {
        super();
        this._root = root;
        this._mianzi = mianzi(pai)
        this._reader = new PaipuReader($('.live', root));

        this._timer_id;

        let beep = audio('beep');
        this.sound_on = true;
        this.beep = ()=>{
            if (this.sound_on) {
                beep.currentTime = 0;
                beep.play();
            }
        };

        this.init();
    }

    init() {
        $('.select-action', this._root).attr('role','alertdialog');
    }

    callback(msg) {
        this.clear_handler();
        this._callback(msg);
        return false;
    }

    clear_handler() {
        this.clear_timer();
        this.clear_action();
        this.clear_mianzi();
        this.clear_dapai();
        $('.kaiju, .dialog, .summary', this._root).off('click');
        clearSelector('kaiju');
        clearSelector('dialog');
        clearSelector('summary');
    }

    set_action_label(label) {
        $('.select-action', this._root).attr('aria-label', label);
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
        $('.select-action', this._root).removeAttr('aria-label');
        this._root.off('click');
        const buttons = $('.select-action', this._root);
        clearSelector('action');
        hide($('.button', buttons).off('click').removeAttr('role'));
        hide(buttons);
    }

    select_mianzi(mm) {
        const mianzi = $('.select-mianzi', this._root);
        for (let m of mm) {
            let msg = m.match(/\d/g).length == 4 ? { gang: m } : { fulou: m };
            if (! this._default_reply) this._default_reply = msg;
            let label = m.match(/\d{3}.?\d/) ? pai_label[m.slice(0,2)] + ' カン'
                      : m.match(/\d(?![\+\=\-])/g)
                            .map(n => pai_label[m[0] + n])
                            .join(' ');
            mianzi.append(
                this._mianzi(m).attr('role','button')
                               .attr('aria-label', label)
                               .on('click', ()=>{
                                   this.clear_mianzi();
                                   return this.callback(msg);
                               }));
        }
        show(mianzi.width($('.shoupai.main .bingpai', this._root).width()));
        setSelector($('.mianzi', mianzi), 'mianzi',
                    { forcus: null, touch: false });
        return false;
    }

    clear_mianzi() {
        const mianzi = $('.select-mianzi', this._root);
        clearSelector('mianzi');
        $('.mianzi', mianzi).off('click');
        hide(mianzi);
        mianzi.empty();
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
                if (! this._default_reply) this._default_reply = { dapai: p };
            }
            pai.attr('role','button').on('click', (ev)=>{
                this.clear_dapai();
                $(ev.target).addClass('dapai');
                return this.callback({ dapai: p });
            });
        }
        setSelector($('.pai[role="button"]', bingpai), 'dapai', { focus: -1 });
    }

    clear_dapai() {
        $('.shoupai.main .bingpai .pai', this._root)
                .off('click')
                .removeAttr('role')
                .removeClass('blink');
        clearSelector('dapai');
    }

    set_timer(dialog, limit = 0, allowed = 0) {

        show($('.timeout', this._root).text(''));
        if (dialog) hide($('.timeout.main', this._root));

        let time_last;
        let time_limit = Date.now() + (limit + allowed) * 1000;
        this._timer_id = setInterval(()=>{
            let time_count = Math.ceil((time_limit - Date.now()) / 1000);
            if (time_count <= 0) {
                this.callback(this._default_reply);
                return;
            }
            if (time_count <= limit || time_count <= allowed) {
                if (! dialog) {
                    $('.timeout.main', this._root).width(
                        $('.shoupai.main .bingpai', this._root).width() + 20);
                }
                if (time_last != time_count) {
                    $('.timeout', this._root).text(time_count);
                    if (time_count <= 5 && ! dialog) this.beep();
                    time_last = time_count;
                }
            }
        }, 200);
    }

    clear_timer() {
        delete this._default_reply;
        hide($('.timeout', this._root).text(''));
        this._timer_id = clearInterval(this._timer_id);
    }

    action(msg, callback) {
        this.clear_handler();
        if (msg.timer) {
            this.set_timer(msg.kaiju || msg.hule || msg.pingju, ...msg.timer);
        }
        this._reader.read(msg);
        super.action(msg, callback);
    }

    action_kaiju(kaiju) {
        if (! this._view) return this.callback();
        setTimeout(()=>{
            setSelector($('.kaiju .submit', this._root), 'kaiju',
                        { prev: null, next: null });
            $('.kaiju', this._root).on('click', ()=> this.callback());
        }, 500);
    }

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

        if (this.allow_no_daopai(this.shoupai)) {
            this.add_action('daopai', ()=> this.callback());
        }

        if (dapai.l == this._menfeng) {
            this.select_action(
                this.allow_no_daopai(this.shoupai)
                    ? ()=> this.callback({ daopai: '-' })
                    : ()=> this.callback()
            );
            return;
        }

        let d = ['','+','=','-'][(4 + this._model.lunban - this._menfeng) % 4];
        let p = dapai.p + d;

        this.set_action_label(`${dir[d]} ${pai_label[p.slice(0,2)]}`);

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

        this.select_action(
            this.allow_no_daopai(this.shoupai)
                ? ()=> this.callback({ daopai: '-' })
                : ()=> this.callback()
        );
    }

    action_fulou(fulou) {

        if (fulou.l != this._menfeng) return this.callback();
        if (fulou.m.match(/^[mpsz]\d{4}/)) return this.callback();

        this.select_dapai();
    }

    action_gang(gang) {

        if (gang.l == this._menfeng) return this.callback();
        if (gang.m.match(/^[mpsz]\d{4}$/)) return this.callback();

        let d = ['','+','=','-'][(4 + this._model.lunban - this._menfeng) % 4];
        let p = gang.m[0] + gang.m.slice(-1) + d;

        this.set_action_label(`${dir[d]} ${pai_label[p.slice(0,2)]} カン`);

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

    action_jieju() {
        setSelector($('.summary .submit', this._root), 'summary',
                    { prev: null, next: null });
        $('.summary', this._root).on('click', ()=> this.callback());
    }
}
