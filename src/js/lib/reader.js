/*
 *  Majiang.UI.PaipuReader
 */
"use strict";

const $ = require('jquery');

const pai_label = require('./label')('pai');

const feng_hanzi  = ['東','南','西','北'];
const jushu_hanzi = ['一局','二局','三局','四局'];

const dir = (m, l)=> ['私','シモチャ','トイメン','カミチャ'][(4 + l - m) % 4];

const jicun = { changbang: '本場', lizhibang: '供託' };

module.exports = class PaipuReader {

    constructor(root) {
        this._root = root;
        this._seq  = 0;
        $('[aria-live]', this._root).attr('aria-relevant','additions');
    }

    speak(level, text) {
        $(`[aria-live="${level}"]`, this._root).append($('<div>').text(text));
    }
    clear() {
        $('[aria-live]', this._root).empty();
    }
    polite(text)    { this.speak('polite',    text) }
    assertive(text) { this.speak('assertive', text) }

    kaiju(kaiju) {
        this.polite(kaiju.title);
    }

    qipai(qipai) {
        this._menfeng = qipai.shoupai.findIndex(s => s);
        this._lizhi   = false;
        let text = feng_hanzi[qipai.zhuangfeng]
                 + jushu_hanzi[qipai.jushu]
                 + `${qipai.changbang}本場 `
                 + `親 ${dir(this._menfeng, 0)} `
                 + `ドラ表示牌 ${pai_label[qipai.baopai]}`;
        this.assertive(text);
    }

    zimo(zimo) {
        if (zimo.l == this._menfeng) {
            this.assertive(`ツモ ${pai_label[zimo.p.slice(0,2)]}`);
        }
    }

    dapai(dapai) {
        if (dapai.l == this._menfeng) this.clear(Date.now());
        let text = pai_label[dapai.p.slice(0,2)]
        if (dapai.p.slice(-1) == '*') {
            text = `${dir(this._menfeng, dapai.l)} ${text} リーチ`;
            this.assertive(text);
            if (dapai.l == this._menfeng) this._lizhi = true;
        }
        else {
            this.polite(text);
        }
    }

    fulou(fulou) {
        let m = fulou.m.replace(/0/,'5');
        let mtype = m.match(/^[mpsz]\d{4}/)  ? 'カン'
                  : m.match(/^[mpsz](\d)\1/) ? 'ポン'
                  :                            'チー';
        this.assertive(`${dir(this._menfeng, fulou.l)} ${mtype}`);
    }

    gang(gang) {
        this.assertive(`${dir(this._menfeng, gang.l)} カン`);
    }

    kaigang(kaigang) {
        this.assertive(`ドラ表示牌 ${pai_label[kaigang.baopai]}`);
    }

    hule(hule) {
        let text;
        if (hule.baojia != null) {
            text = `${dir(this._menfeng, hule.l)} ロン。 ${hule.defen}`;
        }
        else {
            if (hule.l == 0) {
                text = `${dir(this._menfeng, hule.l)} ツモ。 ${hule.defen / 3} オール`;
            }
            else {
                text = `${dir(this._menfeng, hule.l)} ツモ `
                     + (hule.defen - ((hule.defen / 200)|0) * 100) / 2
                     + ' - ' + ((hule.defen / 200)|0) * 100;
            }
        }
        this.assertive(text);
    }

    pingju(pingju) {
        this.assertive(pingju.name);
    }

    read(msg) {
        if      (msg.kaiju)    this.kaiju  (msg.kaiju);
        else if (msg.qipai)    this.qipai  (msg.qipai);
        else if (msg.zimo)     this.zimo   (msg.zimo);
        else if (msg.dapai)    this.dapai  (msg.dapai);
        else if (msg.fulou)    this.fulou  (msg.fulou);
        else if (msg.gang)     this.gang   (msg.gang)
        else if (msg.gangzimo) this.zimo   (msg.gangzimo);
        else if (msg.kaigang)  this.kaigang(msg.kaigang)
        else if (msg.hule)     this.hule   (msg.hule);
        else if (msg.pingju)   this.pingju (msg.pingju);
    }
}
