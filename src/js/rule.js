/*!
 *  電脳麻将: ルール設定 v0.6.1
 *
 *  Copyright(C) 2017 Satoshi Kobayashi
 *  Released under the MIT license
 *  https://github.com/kobalab/Majiang/blob/master/LICENSE
 */
"use strict";

const { fadeIn, fadeOut} = Majiang.UI.Util;

const preset = require('./conf/rule.json');

function unsaved() {
    $(window).on('beforeunload', (ev)=>{
        const message = 'ページを離れますがよろしいですか？';
        ev.returnValue = message;
        return message;
    });
}

function round_point(p, round) {
    p = isNaN(p) ? '0'
      : + p > 0  ? '+' + (+ p)
      :            ''  + (+ p);
    if (round) p.replace(/\.\d*$/,'');
    else       p = ! p.match(/\./) ? p + '.0' : p;
    return p;
}

function repair_point() {
    let round = $('[name="順位点四捨五入あり"]').prop('checked');
    let sum = 0;
    for (let i = 1; i < 4; i++) {
        let p = + $('[name="順位点"]').eq(i).val();
        sum += p;
        $('[name="順位点"]').eq(i).val(round_point(p, round))
    }
    $('[name="順位点"]').eq(0).val(round_point(-sum, round))
}

function repair_gang() {
    if (+ $('[name="裏ドラあり"]:checked').val()
        && + $('[name="カンドラあり"]:checked').val())
    {
        $('[name="カン裏あり"]').prop('disabled', false);
    }
    else {
        $('[name="カン裏あり"]').prop('disabled', true).val([0]);
    }

    if (+ $('[name="カンドラあり"]:checked').val()) {
        $('[name="カンドラ後乗せ"]').prop('disabled', false);
    }
    else {
        $('[name="カンドラ後乗せ"]').prop('disabled', true)
                                  .prop('checked', false);
    }
}

function repair_damanguan() {
    if (+ $('[name="役満の複合あり"]:checked').val()) {
        $('[name="ダブル役満あり"]').prop('disabled', false);
    }
    else {
        $('[name="ダブル役満あり"]').prop('disabled', true).val([0]);
    }
}

function set_form(rule) {

    for (let key of Object.keys(rule)) {

        let value;

        if (key == '順位点') {
            value = rule[key].find(n => n.match(/\./)) ? 0 : 1;
            $('[name="順位点四捨五入あり"]').val([value]);
            for (let i = 1; i < 4; i++) {
                $('[name="順位点"]').eq(i).val(rule[key][i]);
            }
            continue;
        }
        if (key == "赤牌") {
            $('[name="赤牌"]').eq(0).val(rule[key].m);
            $('[name="赤牌"]').eq(1).val(rule[key].p);
            $('[name="赤牌"]').eq(2).val(rule[key].s);
            continue;
        }

        if ($(`[name="${key}"]`).attr('type') == 'radio' ||
            $(`[name="${key}"]`).attr('type') == 'checkbox')
        {
            value = rule[key] === false ? [0]
                  : rule[key] === true  ? [1]
                  :                       [rule[key]];
        }
        else {
            value = rule[key];
        }
        $(`[name="${key}"]`).val(value);
    }

    repair_point();
    repair_gang();
    repair_damanguan();

    fadeIn($('form'));
}

function get_form() {

    let rule = Majiang.rule();

    for (let key of Object.keys(rule)) {

        if (key == '順位点') {
            for (let i = 0; i < 4; i++) {
                rule[key][i] = $('[name="順位点"]').eq(i).val();
            }
        }
        else if (key == '赤牌') {
            rule[key].m = + $('[name="赤牌"]').eq(0).val();
            rule[key].p = + $('[name="赤牌"]').eq(1).val();
            rule[key].s = + $('[name="赤牌"]').eq(2).val();
        }
        else if ($(`[name="${key}"]`).attr('type') == 'radio') {
            rule[key] = + $(`[name="${key}"]:checked`).val();
            if ($(`[name="${key}"]`).length == 2) {
                rule[key] = rule[key] != 0;
            }
        }
        else if ($(`[name="${key}"]`).attr('type') == 'checkbox') {
            rule[key] = $(`[name="${key}"]`).prop('checked');
        }
        else {
            rule[key] = + $(`[name="${key}"]`).val();
        }
    }
    return rule;
}

$(function(){

    for (let key of Object.keys(preset)) {
        $('select[name="プリセット"]').append($('<option>').val(key).text(key));
    }
    if (localStorage.getItem('Majiang.rule')) {
        $('select[name="プリセット"]').append($('<option>')
                                    .val('-').text('カスタムルール'));
        $('select[name="プリセット"]').val('-');
    }

    let rule = Majiang.rule(
                    JSON.parse(localStorage.getItem('Majiang.rule')||'{}'));
    set_form(rule);

    $('[name="配給原点"]').on('change', function(){
        let p = $(this).val();
        if (isNaN(p) || p <= 0) $(this).val(Majiang.rule()['配給原点']);
        else if (p > 30000)     $(this).val(30000);
    });
    $('[name="順位点"]').on('change', repair_point);
    $('[name="順位点四捨五入あり"]').on('change', repair_point);
    $('[name="裏ドラあり"]').on('change', repair_gang);
    $('[name="カンドラあり"]').on('change', repair_gang);
    $('[name="役満の複合あり"]').on('change', repair_damanguan);

    $('[name="プリセット"]').on('change', ()=>{
        let key = $('[name="プリセット"]').val();
        set_form(Majiang.rule(preset[key] || {}));
        unsaved();
        return false;
    });

    $('form').on('change', unsaved);

    $('form').on('submit', (ev)=>{

        if (! localStorage.getItem('Majiang.rule')) {
            $('select[name="プリセット"]').append(
                                $('<option>').val('-').text('カスタムルール'));
        }
        localStorage.setItem('Majiang.rule', JSON.stringify(get_form()));

        $(window).off('beforeunload');

        $('[name="プリセット"]').val('-');
        fadeIn($('form'));
        fadeIn($('.message'));
        setTimeout(()=> $('.message').trigger('click'), 2000);

        return false;
    });

    $('.message').on('click', function(){
        fadeOut($(this));
        return false;
    });
});
