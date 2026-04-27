/*!
 *  電脳麻将: 牌理 v0.7.2
 *
 *  Copyright(C) 2017 Satoshi Kobayashi
 *  Released under the MIT license
 *  https://github.com/kobalab/Majiang/blob/master/LICENSE
 */
"use strict";

const { setSelector, clearSelector, live } = Majiang.UI.Util;

const model = {};
const view  = {};

let _row;
let pref;
let link;

const rule = Majiang.rule();

function repair_shan(shan, shoupai) {
    let paistr = shoupai.toString();
    for (let suitstr of paistr.match(/[mpsz][\d\+\=\-]+/g)) {
        let s = suitstr[0];
        for (let n of suitstr.match(/\d/g)) {
            let i = shan._pai.indexOf(s+n);
            if (i >= 0) shan._pai.splice(i, 1);
        }
    }
}

function qipai(paistr) {

    $('.paili').empty();
    $('.status a').removeAttr('href');

    view.status();

    model.shan = new Majiang.Shan(rule);

    if (paistr) {
        model.shoupai = Majiang.Shoupai.fromString(paistr);
        history.replaceState('', '', `#${model.shoupai.toString()}`);
        repair_shan(model.shan, model.shoupai);
        if (! model.shoupai._zimo) model.shoupai.zimo(model.shan.zimo());
    }
    else {
        let qipai = [];
        while (qipai.length < 13) qipai.push(model.shan.zimo());
        model.shoupai = new Majiang.Shoupai(qipai);
        model.shoupai.zimo(model.shan.zimo());
    }
    model.lizhi = false;

    while (model.shan.paishu > 17) model.shan.zimo();

    $('[name="paistr"]').val(model.shoupai.toString());

    view.shoupai = new Majiang.UI.Shoupai(
                                $('.shoupai'), view.pai, model.shoupai
                            ).redraw(true);

    model.he = new Majiang.He();
    view.he  = new Majiang.UI.He($('.he'), view.pai, model.he, 1).redraw();

    model.n_xiangting = null;

    paili(1000);
}

function set_handler(focus) {

    if (Majiang.Util.xiangting(model.shoupai) == -1) return;

    for (let p of model.shoupai.get_dapai()) {
        let pai = $(p.slice(-1) == '_'
                        ? `.pai.zimo[data-pai="${p.slice(0,2)}"]`
                        : `.pai:not(.zimo)[data-pai="${p}"]`,
                    $('.shoupai .bingpai'));
        pai.attr('role','button')
            .on('click', (ev)=>{
                $(ev.target).addClass('dapai');
                dapai(p);
            });
    }
    setSelector($('.shoupai .pai[role="button"]'), 'dapai',
                { focus: focus, release: $('.live .log') });
}

function clear_handler() {
    clearSelector('dapai');
    $('.shoupai .pai[role="button"]').off('click');
}

function dapai(p) {

    clear_handler();
    view.status();

    if (pref.sound_on) view.audio('dapai').play();

    model.shoupai.dapai(p);
    view.shoupai.dapai(p);

    if (! model.lizhi && Majiang.Util.xiangting(model.shoupai) == 0) {
        model.lizhi = true;
        p += '*';
        if (pref.sound_on) view.audio('lizhi').play();
        view.status('リーチ');
    }

    model.he.dapai(p);
    view.he.dapai(p);

    view.log(view.pai(p).attr('alt'));

    setTimeout(zimo, 600);
}

function zimo() {

    $('.paili').empty();

    view.shoupai.redraw();
    view.he.redraw();

    if (! model.shan.paishu) {
        $('.status a').text('流局……');
        view.status('流局');
        setTimeout(()=> $('[type="button"]').trigger('focus'), 1000);
        return;
    }

    model.shoupai.zimo(model.shan.zimo());
    view.shoupai.redraw();

    paili();
}

function paili(delay) {

    let n_xiangting = Majiang.Util.xiangting(model.shoupai);

    if      (n_xiangting == -1) $('.status a').text('和了！！');
    else if (n_xiangting ==  0) $('.status a').text('聴牌！');
    else                        $('.status a').text(`${n_xiangting}向聴`);

    view.log();

    if (model.n_xiangting != n_xiangting) {
        if      (n_xiangting == -1) view.status('ホーラ');
        else if (n_xiangting ==  0) view.status('テンパイ');
        else                        view.status(`${n_xiangting}シャンテン`);
        model.n_xiangting = n_xiangting;
    }

    if (n_xiangting == -1) {
        if (pref.sound_on) view.audio('zimo').play();
        $('.status a').attr('href', link + model.shoupai + '/0/1/1');
        setTimeout(()=> $('[type="button"]').trigger('focus'), 1000);
        return;
    }

    let dapai = [];
    for (let p of model.shoupai.get_dapai()) {

        let shoupai = model.shoupai.clone().dapai(p);
        if (Majiang.Util.xiangting(shoupai) > n_xiangting) continue;

        p = p[0] + (+p[1]||5);
        if (dapai.find(dapai => dapai.p == p)) continue;
        let tingpai = Majiang.Util.tingpai(shoupai);
        let n = tingpai.map(p => 4 - model.shoupai._bingpai[p[0]][p[1]])
                       .reduce((x, y)=> x + y, 0);
        dapai.push({ p: p, tingpai: tingpai, n: n });
    }

    const cmp = (a, b) => b.n - a.n
                       || b.tingpai.length - a.tingpai.length
                       || (a.p < b.p ? -1 : 1);
    for (let d of dapai.sort(cmp)) {
        let row = _row.clone();
        $('.da', row).append(view.pai(d.p));
        for (let tp of d.tingpai) {
            $('.mo', row).append(view.pai(tp));
        }
        $('.n', row).text(d.n);
        $('.paili').append(row);
    }

    setTimeout(()=> set_handler(-1), delay);
}

$(function(){

    _row = $('.paili .row');
    link = $('.status a').attr('href');
    pref = localStorage.getItem('Majiang.pref')
                ? JSON.parse(localStorage.getItem('Majiang.pref'))
                : { sound_on: true };

    view.pai   = Majiang.UI.pai('#loaddata');
    view.audio = Majiang.UI.audio('#loaddata');

    view.status = live($('.live .status'), 'polite');
    view.log    = live($('.live .log'),    'polite');

    $('[type="button"]').on('click', ()=> qipai());
    $('form').on('submit', function(){
        qipai($('form input[name="paistr"]').val());
        return false;
    });
    $('form').on('reset', function(){
        $('input[name="paistr"]').trigger('focus');
        history.replaceState('', '', location.href.replace(/#.*$/,''));
    });
    $('[name="paistr"]').on('focus', ()=> clear_handler())
                        .on('blur',  ()=> set_handler());

    let paistr = location.hash.replace(/^#/,'');
    qipai(paistr);
});
