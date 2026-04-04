/*
 *  同時に複数カンできる牌譜例を探す
 */
"use strict";

class AnaLog extends require('@kobalab/majiang-analog') {

    init() { this._max = 0; }

    zimo(zimo) {
        if (zimo.l != 0) return;
        let shoupai = this.board.shoupai[0];
        let mianzi = shoupai.get_gang_mianzi();
        if (mianzi.length > this._max) {
            console.log(this.idx(0), mianzi);
            this._max = mianzi.length;
        }
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
