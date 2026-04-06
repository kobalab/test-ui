/*
 *  リーチ不成立の牌譜を探す
 */
"use strict";

class AnaLog extends require('@kobalab/majiang-analog') {

    last(log) {
        let lizhi;
        for (let msg of log) {

            if      (lizhi && msg.hule)
                        console.log(this.idx(lizhi.l));
            else if (lizhi && msg.pingju)
                        console.log(this.idx(lizhi.l), msg.pingju.name);
            else        lizhi = null;

            if (msg.dapai && msg.dapai.p.slice(-1) == '*') lizhi = msg.dapai;
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
