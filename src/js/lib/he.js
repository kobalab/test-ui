/*
 *  Majiang.UI.He
 */
"use strict";

const $ = require('jquery');

const { show, hide } = require('./fadein');
const label = require('./label')('he');

function add_label(pai, label) {
    if (pai.attr('alt'))
            pai.attr('alt', pai.attr('alt') + ' ' + label);
    else    pai.attr('aria-label', pai.attr('aria-label') + ' ' + label);
    return pai;
}

module.exports = class He {

    constructor(root, pai, he, type = 0) {
        this._root = root;
        this._pai  = pai;
        this._he   = he;
        this._type = type;
        hide($('.chouma', this._root));
    }

    redraw(type) {

        if (type != null) this._type = type;

        $('.dapai', this._root).empty();
        let lizhi = false;
        let i = 0;
        for (let p of this._he._pai) {

            if (p.match(/\*/)) {
                lizhi = true;
                show($('.chouma', this._root));
            }
            if (this._type != 2 && p.match(/[\+\=\-]$/)) continue;

            let pai = this._pai(p);
            if (this._type != 0 && p[2] == '_') {
                add_label(pai.addClass('zimo'), label.zimo);
            }
            if (p.match(/[\+\=\-]$/)) {
                add_label(pai.addClass('fulou'), label.fulou);
            }
            if (lizhi) {
                pai = $('<span>').addClass('lizhi')
                                 .attr('aria-label',label.lizhi)
                                 .append(pai);
                lizhi = false;
            }
            $('.dapai', this._root).append(pai);

            i++;
            if (i < 6 * 3 && i % 6 == 0) {
                $('.dapai', this._root).append($('<div>').addClass('break'));
            }
        }
        return this;
    }

    dapai(p) {
        let pai = this._pai(p).addClass('dapai');
        if (p[2]== '_') pai.addClass('zimo');
        if (p.match(/\*/)) pai = $('<span>').addClass('lizhi')
                                            .attr('aria-label',label.lizhi)
                                            .append(pai);
        $('.dapai', this._root).append(pai);
        return this;
    }
}
