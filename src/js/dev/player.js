/*
 *  Majiang.Dev.Player
 */
"use strict";

const Majiang = { UI: require('../lib/') };
const $ = require('jquery');

module.exports = class Player extends Majiang.UI.Player {

    constructor(root) {
        super(root);
        this._reply = [];
        root.append($('<div id="debug">').hide());
        this._auto_replay = true;
    }

    action(msg, callback) {
        if (this._auto_replay) {
            $('#debug').hide();
            super.action(msg);
            if (callback) callback(this._reply.shift());
        }
        else {
            if (callback) {
                let reply = JSON.stringify(this._reply.shift());
                if (reply == '{}')  $('#debug').text('').hide();
                else                $('#debug').text(reply).show();
            }
            super.action(msg, callback);
        }
    }
}
