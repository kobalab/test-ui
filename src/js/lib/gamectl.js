/*
 *  Majiang.UI.GameCtl
 */
"use strict";

const { hide, show } = require('./fadein');

module.exports = class GameCtl {

    constructor(root, storage, game, ...views) {
        this._root    = root;
        this._storage = storage;
        this._game    = game;
        this._views   = views;

        if (game) game._view.no_player_name = true;

        hide($('> *:not(.speed)', root));

        this._pref = localStorage.getItem(storage)
                        ? JSON.parse(localStorage.getItem(storage))
                        : { sound_on: true, speed: 2 };

        this.sound(this._pref.sound_on);
        this.speed(this._pref.speed);

        this.set_handler();
    }

    set_handler() {

        this.clear_handler();

        $('.sound', this._root).on('click.controller', ()=>
                                    (this.sound(! this._pref.sound_on), false));
        $('.minus', this._root).on('click.controller', ()=>
                                    (this.speed(this._game.speed - 1), false));
        $('.plus',  this._root).on('click.controller', ()=>
                                    (this.speed(this._game.speed + 1), false));
    }

    clear_handler() {
        $('.sound, .minus, .plus', this._root).off('click.controller');
    }

    sound(on) {
        this._views.forEach(view => view.sound_on = on);
        if (on) {
            hide($('.sound.off'), this._root);
            show($('.sound.on'), this._root);
        }
        else {
            hide($('.sound.on'), this._root);
            show($('.sound.off'), this._root);
        }
        if (on != this._pref.sound_on) {
            this._pref.sound_on = on;
            localStorage.setItem(this._storage, JSON.stringify(this._pref));
        }
    }

    speed(speed) {
        if (! this._game) return;
        speed = speed | 0;
        if (speed < 1) speed = 1;
        if (speed > 5) speed = 5;
        this._game.speed = speed;
        $('.speed .step', this._root).each((i, n)=> {
            $(n).css('visibility', i < speed ? 'visible' : 'hidden');
        });
        if (speed != this._pref.speed) {
            this._pref.speed = speed;
            localStorage.setItem(this._storage, JSON.stringify(this._pref));
        }
    }
}
