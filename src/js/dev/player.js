/*
 *  Majiang.Dev.Player
 */
"use strict";

const Majiang = { UI: require('../lib/') };

module.exports = class Player extends Majiang.UI.Player {

    constructor(root) {
        super(root);
        this._reply = [];
        this._auto_replay = true;
    }

    action(msg, callback) {
        if (this._auto_replay) {
            super.action(msg);
            if (callback) callback(this._reply.shift());
        }
        else {
            if (callback) console.log(this._reply.shift());
            super.action(msg, callback);
        }
    }
}
