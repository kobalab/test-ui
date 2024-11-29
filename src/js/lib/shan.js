/*
 *  Majiang.UI.Shan
 */
"use strict";

module.exports = class Shan {

    constructor(root, pai, shan) {
        this._root = root;
        this._pai  = pai;
        this._shan = shan;
    }

    redraw() {

        let baopai = this._shan.baopai;
        $('.baopai', this._root).empty();
        for (let i = 0; i < 5; i++) {
            $('.baopai', this._root).append(this._pai(baopai[i] || '_'));
        }

        let fubaopai = this._shan.fubaopai || [];
        $('.fubaopai', this._root).empty();
        for (let i = 0; i < 5; i++) {
            $('.fubaopai', this._root).append(this._pai(fubaopai[i] || '_'));
        }

        return this.update();
    }

    update() {
        $('.paishu', this._root).text(this._shan.paishu);
        return this;
    }
}
