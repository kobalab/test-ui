/*!
 *  電脳麻将: 和了点計算 v0.2.4
 *
 *  Copyright(C) 2017 Satoshi Kobayashi
 *  Released under the MIT license
 *  https://github.com/kobalab/Majiang/blob/master/LICENSE
 */
"use strict";

const { hide, show, fadeIn, fadeOut } = Majiang.UI.Util;

let dialog;
let model = {
    shan: {},
};

function init() {

    let paistr = 'm123p123z1z1,s1-23,z222=';
    let baopai = ['z1'];

    $('input[name="paistr"]').val(paistr).focus();
    for (let i = 0; i < baopai.length; i++) {
        $('input[name="baopai"]').eq(i).val(baopai[i]);
    }
}

function submit(ev) {

    ev.preventDefault();

    let paistr = $('[name="paistr"]').val();
    if (! paistr) {
        return false;
    }
    let shoupai = Majiang.Shoupai.fromString(paistr);
    $('[name="paistr"]').val(shoupai.toString());

    let rongpai;
    if ($('[name="zimo"]:checked').val() == 0) {
        if (shoupai._zimo) {
            rongpai = shoupai._zimo + '=';
            shoupai.dapai(shoupai._zimo);
        }
    }

    let baopai   = $.makeArray($('[name="baopai"]'))
                        .map(n => Majiang.Shoupai.valid_pai($(n).val()))
                        .filter(p => p);
    let fubaopai = $.makeArray($('[name="fubaopai"]'))
                        .map(n => Majiang.Shoupai.valid_pai($(n).val()))
                        .filter(p => p);
    model.shan.baopai = baopai;

    let param = Majiang.Util.hule_param();
    param.zhuangfeng = + $('[name="zhuangfeng"]').val();
    param.menfeng    = + $('[name="menfeng"]').val();
    param.baopai     = baopai;
    param.fubaopai   = fubaopai;

    let hule = Majiang.Util.hule(shoupai, rongpai, param) || {};

    let paipu = {
        shoupai:    paistr,
        damanguan:  hule.damanguan,
        fu:         hule.fu,
        fanshu:     hule.fanshu,
        defen:      hule.defen,
        hupai:      hule.hupai,
    };

    dialog.hule(paipu);

    return false;
}

$(function(){

    dialog = new Majiang.UI.HuleDialog(
                        $('.dialog'), Majiang.UI.pai('#loaddata'),
                        model);

    $('form').on('submit', submit);
    $('form').on('reset', function(){
        hide($('.dialog'));
        $('form input[name="paistr"]').focus();
    });

    init();
});
