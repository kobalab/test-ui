/*!
 *  電脳麻将: 牌理 v0.2.2
 *
 *  Copyright(C) 2017 Satoshi Kobayashi
 *  Released under the MIT license
 *  https://github.com/kobalab/Majiang/blob/master/LICENSE
 */
"use strict";

const model = {};
const view  = {};

const rule = Majiang.rule();

function qipai() {

    model.shan = new Majiang.Shan(rule);

    let qipai = [];
    while (qipai.length < 13) qipai.push(model.shan.zimo());
    model.shoupai = new Majiang.Shoupai(qipai);
    model.shoupai.zimo(model.shan.zimo());

    let paistr = model.shoupai.toString();
    $('[name="paistr"]').val(paistr);

    view.shoupai = new Majiang.UI.Shoupai(
                                $('.shoupai'), view.pai, model.shoupai
                            ).redraw(true);    
}

$(function(){

    view.pai   = Majiang.UI.pai('#loaddata');
    view.audio = Majiang.UI.audio('#loaddata');

    qipai();
});
