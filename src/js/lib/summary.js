/*
 *  summary
 */
"use strict";

const $ = require('jquery');

const Majiang = require('@kobalab/majiang-core');

const { hide, show, fadeIn, fadeOut } = require('./fadein');

module.exports = function(root, paipu, viewpoint = 0, dummy_name = []) {

    for (let i = 0; i < 4; i++) {
        let id   = (viewpoint + i) % 4;
        let name = dummy_name[id] || paipu.player[id].replace(/\n.*$/, '');
        $('.r_player .name', root).eq(i).text(name);
    }

    let r_diff = $('.r_diff', root).eq(0).clone();
    let body = $('.r_diff', root).parent();
    body.empty();

    for (let log of paipu.log) {

        r_diff = r_diff.clone();
        $('*', r_diff).removeClass('zhuangjia plus minus');

        let qipai = log[0].qipai;
        $('.jushu', r_diff).text(['東','南','西','北'][qipai.zhuangfeng]
                               + ['一','二','三','四'][qipai.jushu] + '局');
        $('.changbang', r_diff).text(`${qipai.changbang}本場`);

        let diff = [0,0,0,0], lizhi = ['','','',''], lz, last;
        for (let msg of log) {

            last = msg;

            if (msg.hule)   msg.hule.fenpei.forEach((x, l)=> diff[l] += x);
            if (msg.pingju) msg.pingju.fenpei.forEach((x, l)=> diff[l] += x);

            if (msg.hule || msg.pingju && msg.pingju.name.match(/^三家和/))
                continue;
            if (lz != null) { lizhi[lz] = '*'; lz = null }
            if (msg.dapai && msg.dapai.p.slice(-1) == '*') lz = msg.dapai.l;
        }

        $('.last', r_diff).text(last.hule && last.hule.baojia == null ? 'ツモ'
                              : last.hule                             ? 'ロン'
                              : last.pingju                           ? '流局'
                              :                                       　 '−' );
        for (let i = 0; i < 4; i++) {

            let l = (8 + viewpoint - paipu.qijia - qipai.jushu + i) % 4;

            if (l == 0) $('.diff', r_diff).parent().eq(i).addClass('zhuangjia');

            if (last.hule && diff[l] > 0)
                    $('.diff', r_diff).eq(i).addClass('plus');
            if (last.hule && last.hule.baojia == l)
                    $('.diff', r_diff).eq(i).addClass('minus');

            diff[l] = diff[l] > 0 ? '+' + diff[l]
                    : diff[l] < 0 ? ''  + diff[l]
                    :               '';
            $('.diff', r_diff).eq(i).text(diff[l]);

            $('.lizhi', r_diff).eq(i).text(lizhi[l]);
        }
        body.append(r_diff);
    }

    let defen = $('.r_defen .defen', root).removeClass('plus minus');
    let point = $('.r_point .point', root).removeClass('plus minus');

    for (let i = 0; i < 4; i++) {

        let id = (viewpoint + i) % 4;

        defen.eq(i).text(('' + (paipu.defen[id] ?? ''))
                                    .replace(/(\d+)(\d{3})$/,'$1,$2'));
        if (paipu.rank[id] == 1) defen.eq(i).addClass('plus');
        if (paipu.defen[id] < 0) defen.eq(i).addClass('minus');

        point.eq(i).text((paipu.point[id] > 0 ? '+' : '')
                            + (paipu.point[id] ?? '-'));
        if (paipu.point[id] > 0) point.eq(i).addClass('plus');
        if (paipu.point[id] < 0) point.eq(i).addClass('minus');
    }

    return root;
}
