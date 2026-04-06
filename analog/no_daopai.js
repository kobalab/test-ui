/*
 *  ハイテイ手番でノーテン宣言
 */
"use strict";

const Majiang = require('@kobalab/majiang-core');

class AnaLog extends require('@kobalab/majiang-analog') {

    dapai(dapai) {
        if (this.board.shan.paishu > 0) return;
        if (this.board.menfeng(0) != dapai.l) return;
        if (Majiang.Util.xiangting(this.board.shoupai[dapai.l]) > 0) return;
        console.log(this.idx(dapai.l));
    }
}

const yargs = require('yargs');
const argv = yargs
    .usage('Usage: $0 <log-dir>...')
    .option('recursive', { alias: 'r', boolean: true })
    .option('times',     { alias: 't' })
    .option('silent',    { alias: 's', boolean: true })
    .demandCommand(1)
    .argv;
const filename = argv._;

AnaLog.analyze(filename, argv);
