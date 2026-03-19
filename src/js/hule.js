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

    let param = Majiang.Util.hule_param();

    let hule = Majiang.Util.hule(shoupai, null, param) || {};

    let paipu = {
        shoupai: paistr,
        fu:      hule.fu,
        fanshu:  hule.fanshu,
        defen:   hule.defen,
        hupai:   hule.hupai,
    };

    dialog.hule(paipu);

    return false;
}

$(function(){

    dialog = new Majiang.UI.HuleDialog(
                        $('.dialog'), Majiang.UI.pai('#loaddata'));

    $('form').on('submit', submit);
    $('form').on('reset', function(){
        hide($('.dialog'));
        $('form input[name="paistr"]').focus();
    });

    init();
});
