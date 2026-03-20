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

    if (! shoupai.menqian) {
        $('[name="lizhi"]').prop('checked', false);
        hide($('[name="fubaopai"]').parent());
        $('[name="yifa"]').prop('checked', false)
                          .prop('disabled', true);
        $('[name="tianhu"]').prop('checked', false);
    }
    if (! shoupai._fulou
            .find(m => m.replace(/0/g,'5').match(/^[mpsz](\d)\1\1.*\1.*$/)))
    {
        $('[name="lingshang"]').prop('checked', false);
    }
    if (rongpai) {
        $('[name="lingshang"]').prop('checked', false);
    }
    else {
        $('[name="qianggang"]').prop('checked', false);
    }

    let lizhi = + $('input[name="lizhi"]:checked').val() || 0;

    model.shan.baopai   = baopai;
    model.shan.fubaopai = lizhi ? fubaopai : null;

    let param = {
        rule: Majiang.rule(),
        zhuangfeng: + $('[name="zhuangfeng"]').val(),
        menfeng:    + $('[name="menfeng"]').val(),
        hupai: {
            lizhi:      lizhi,
            yifa:       $('[name="yifa"]').prop('checked'),
            qianggang:  $('[name="qianggang"]').prop('checked'),
            lingshang:  $('[name="lingshang"]').prop('checked'),
            haidi:      ! $('[name="haidi"]').prop('checked') ? 0
                            : ! rongpai                       ? 1
                            :                                   2,
            tianhu:     + $('[name="tianhu"]:checked').val() || 0,
        },
        baopai:     model.shan.baopai,
        fubaopai:   model.shan.fubaopai,
        jicun:      { changbang: 0, lizhibang: 0 }
    };

    let hule = Majiang.Util.hule(shoupai, rongpai, param) || {};

    let paipu = {
        shoupai:    paistr,
        fubaopai:   param.fubaopai,
        damanguan:  hule.damanguan,
        fu:         hule.fu,
        fanshu:     hule.fanshu,
        defen:      hule.defen,
        hupai:      hule.hupai,
    };

    dialog.hule(paipu);

    $('[name="baopai"]').val('');
    for (let i = 0; i < baopai.length; i++) {
        $('[name="baopai"]').eq(i).val(baopai[i]);
    }
    $('[name="fubaopai"]').val('');
    if (! model.shan.fubaopai) fubaopai = [];
    for (let i = 0; i < fubaopai.length; i++) {
        $('[name="fubaopai"]').eq(i).val(fubaopai[i]);
    }

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
