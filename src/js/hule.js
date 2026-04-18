/*!
 *  電脳麻将: 和了点計算 v0.7.0
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

function init(fragment) {

    if (fragment) {

        let [ paistr, baopai, fubaopai, zimo, zhuangfeng, menfeng,
              lizhi, yifa, haidi, lingshang, qianggang, tianhu, rule ]
                    = fragment.split(/\//);
        baopai   = (baopai   || '').split(/,/);
        fubaopai = (fubaopai || '').split(/,/);

        $('[name="paistr"]').val(paistr);
        for (let i = 0; i < baopai.length; i++) {
            $('[name="baopai"]').eq(i).val(baopai[i]);
        }
        for (let i = 0; i < fubaopai.length; i++) {
            $('[name="fubaopai"]').eq(i).val(fubaopai[i]);
        }
        $(`[name="zimo"][value="${zimo}"]`).click();
        $('[name="zhuangfeng"]').val(zhuangfeng || 0);
        $('[name="menfeng"]').val(menfeng || 0);
        $(`[name="lizhi"][value="${lizhi}"]`).click();
        if (+yifa)      $('[name="yifa"]').click();
        if (+haidi)     $('[name="haidi"]').click();
        if (+lingshang) $('[name="lingshang"]').click();
        if (+qianggang) $('[name="qianggang"]').click();
        if (+tianhu)    $('[name="tianhu"]').click();
        if (rule)       $('select[name="rule"]').val(rule);

        $('form').submit();
    }
    else {
        let paistr = 'm123p123z1z1,s1-23,z222=';
        let baopai = ['z1'];

        $('[name="paistr"]').val(paistr).focus();
        for (let i = 0; i < baopai.length; i++) {
            $('[name="baopai"]').eq(i).val(baopai[i]);
        }
    }
}

function submit() {

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

    let lizhi = + $('[name="lizhi"]:checked').val() || 0;

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
        l:          param.menfeng,
        shoupai:    paistr,
        baojia:     rongpai || (param.menfeng + 2) % 4,
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

    let fragment = '#' + [
                    paistr,
                    baopai.join(','),
                    fubaopai.join(','),
                    $('[name="zimo"]:checked').val(),
                    $('[name="zhuangfeng"]').val(),
                    $('[name="menfeng"]').val(),
                    $('[name="lizhi"]:checked').val(),
                    + $('[name="yifa"]').prop('checked'),
                    + $('[name="haidi"]').prop('checked'),
                    + $('[name="lingshang"]').prop('checked'),
                    + $('[name="qianggang"]').prop('checked'),
                    + $('[name="tianhu"]:checked').val() || 0
                ].join('/');

    history.replaceState('', '', fragment);

    return false;
}

$(function(){

    dialog = new Majiang.UI.HuleDialog(
                        $('.dialog'), Majiang.UI.pai('#loaddata'),
                        model);

    $('form').on('submit', submit);

    $('form').on('reset', function(){
        hide($('.dialog'));
        $('[name="fubaopai"]').parent().addClass('hide');
        $('[name="yifa"]').prop('disabled', true);
        $('[name="tianhu"]').next().text('地和');
        $('[name="tianhu"]').val(2);
        $('form [name="paistr"]').focus();
    });

    $('[name="zimo"]').on('change', function(){
        if ($(this, ':checked').val() == 1) {
            $('[name="qianggang"]').prop('checked', false);
        }
        else {
            $('[name="lingshang"]').prop('checked', false);
            $('[name="tianhu"]').prop('checked', false);
        }
    });
    $('[name="menfeng"]').on('change', function(){
        if ($(this, ':selected').val() == 0) {
            $('[name="tianhu"]').next().text('天和');
            $('[name="tianhu"]').val(1);
        }
        else {
            $('[name="tianhu"]').next().text('地和');
            $('[name="tianhu"]').val(2);
        }
    });
    $('[name="lizhi"]').on('change', function(){
        if ($(this).prop('checked')) {
            let val = $(this).val() == 1 ? 2 : 1;
            $(`[name="lizhi"][value="${val}"]`).prop('checked', false);
            show($('[name="fubaopai"]').parent());
            $('[name="yifa"]').prop('disabled', false);
            $('[name="tianhu"]').prop('checked', false);
        }
        else {
            hide($('[name="fubaopai"]').parent());
            $('[name="yifa"]').prop('checked', false)
                              .prop('disabled', true);
        }
    });
    $('[name="yifa"]').on('change', function(){
        if ($(this).prop('checked')) {
            $('[name="lingshang"]').prop('checked', false);
        }
    });
    $('[name="haidi"]').on('change', function(){
        if ($(this).prop('checked')) {
            $('[name="lingshang"]').prop('checked', false);
            $('[name="qianggang"]').prop('checked', false);
            $('[name="tianhu"]').prop('checked', false);
        }
    });
    $('[name="lingshang"]').on('change', function(){
        if ($(this).prop('checked')) {
            $('[name="yifa"]').prop('checked', false);
            $('[name="haidi"]').prop('checked', false);
            $('[name="qianggang"]').prop('checked', false);
            $('[name="tianhu"]').prop('checked', false);
            $('[name="zimo"][value="1"]').click();
        }
    });
    $('[name="qianggang"]').on('change', function(){
        if ($(this).prop('checked')) {
            $('[name="haidi"]').prop('checked', false);
            $('[name="lingshang"]').prop('checked', false);
            $('[name="tianhu"]').prop('checked', false);
            $('[name="zimo"][value="0"]').click();
        }
    });
    $('[name="tianhu"]').on('change', function(){
        if ($(this).prop('checked')) {
            $('[name="lizhi"]').prop('checked', false);
            $('[name="fubaopai"]').parent().addClass('hide');
            $('[name="yifa"]').prop('checked', false)
                              .prop('disabled', true);
            $('[name="haidi"]').prop('checked', false);
            $('[name="lingshang"]').prop('checked', false);
            $('[name="qianggang"]').prop('checked', false);
            $('[name="zimo"][value="1"]').click();
        }
    });

    let fragment = location.hash.replace(/^#/,'');
    init(fragment);
});
