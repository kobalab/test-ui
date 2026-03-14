/*!
 *  電脳麻将: 牌理 v0.2.2
 *
 *  Copyright(C) 2017 Satoshi Kobayashi
 *  Released under the MIT license
 *  https://github.com/kobalab/Majiang/blob/master/LICENSE
 */
"use strict";

const { setSelector, clearSelector } = Majiang.UI.Util;

const model = {};
const view  = {};

const rule = Majiang.rule();

function qipai() {

    model.shan = new Majiang.Shan(rule);

    let qipai = [];
    while (qipai.length < 13) qipai.push(model.shan.zimo());
    model.shoupai = new Majiang.Shoupai(qipai);
    model.shoupai.zimo(model.shan.zimo());

    model.lizhi = false;

    while (model.shan.paishu > 17) model.shan.zimo();

    let paistr = model.shoupai.toString();
    $('[name="paistr"]').val(paistr);

    view.shoupai = new Majiang.UI.Shoupai(
                                $('.shoupai'), view.pai, model.shoupai
                            ).redraw(true);

    model.he = new Majiang.He();
    view.he  = new Majiang.UI.He($('.he'), view.pai, model.he, 1).redraw();

    paili();
}

function set_handler() {

    for (let p of model.shoupai.get_dapai()) {
        let pai = $(p.slice(-1) == '_'
                        ? `.pai.zimo[data-pai="${p.slice(0,2)}"]`
                        : `.pai:not(.zimo)[data-pai="${p}"]`,
                    $('.shoupai .bingpai'));
        pai.attr('role','button')
            .on('click.dapai', (ev)=>{
                $(ev.target).addClass('dapai');
                dapai(p);
            });
    }
    setSelector($('.shoupai .pai[role="button"]'), 'dapai', { focus: -1 });
}

function clear_handler() {
    clearSelector('dapai');
    $('.shoupai .pai[role="button"]').off('click');
}

function dapai(p) {

    clear_handler();

    view.audio('dapai').play();

    model.shoupai.dapai(p);
    view.shoupai.dapai(p);

    if (! model.lizhi && Majiang.Util.xiangting(model.shoupai) == 0) {
        model.lizhi = true;
        p += '*';
        view.audio('lizhi').play();
    }

    model.he.dapai(p);
    view.he.dapai(p);

    setTimeout(zimo, 600);
}

function zimo() {

    view.shoupai.redraw();
    view.he.redraw();

    if (! model.shan.paishu) {
        $('.status').text('流局……');
        return;
    }

    model.shoupai.zimo(model.shan.zimo());
    view.shoupai.redraw();

    paili();
}

function paili() {

    let n_xiangting = Majiang.Util.xiangting(model.shoupai);

    if      (n_xiangting == -1) $('.status').text('和了！！');
    else if (n_xiangting ==  0) $('.status').text('聴牌！');
    else                        $('.status').text(`${n_xiangting}向聴`);

    if (n_xiangting == -1) {
        view.audio('zimo').play();
        return;
    }

    set_handler();
}

$(function(){

    view.pai   = Majiang.UI.pai('#loaddata');
    view.audio = Majiang.UI.audio('#loaddata');

    qipai();
});
