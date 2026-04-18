/*!
 *  電脳麻将: 試験対戦 v0.7.0
 *
 *  Copyright(C) 2017 Satoshi Kobayashi
 *  Released under the MIT license
 *  https://github.com/kobalab/Majiang/blob/master/LICENSE
 */
"use strict";

Majiang.Dev.Player = class Player extends Majiang.UI.Player {

    constructor(root, pai, audio) {
        super(root, pai, audio);
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

const { hide, show, fadeIn, scale,
        setSelector, clearSelector  } = Majiang.UI.Util;

let loaded;

const rule = Majiang.rule(
                JSON.parse(localStorage.getItem('Majiang.rule'))||'{}');

$(function(){

    const pai   = Majiang.UI.pai($('#loaddata'));
    const audio = Majiang.UI.audio($('#loaddata'));

    const script = localStorage.getItem('Majiang.paipu')
                    && JSON.parse(localStorage.getItem('Majiang.paipu'))[0];

    function start() {

        clearSelector('title');

        hide($('#board .board .dialog'));
        hide($('#board .board .summary'));

        let players = [ new Majiang.Dev.Player($('#board .board'),
                                                            pai, audio) ];
        for (let i = 1; i < 4; i++) players[i] = new Majiang.AI;
        let game  = script ? new Majiang.Dev.Game(script, rule)
                           : new Majiang.Game(players, ()=>{}, rule);
        if (script) game._players[0] = players[0];
        game.view = new Majiang.UI.Board($('#board .board'), pai, audio,
                                            game.model);

        let gamectl = new Majiang.UI.GameCtl(
                        $('#board .controller'), 'Majiang.pref',
                        game, game.view);

        for (let i = 1; i < 4; i++) {
            $('#board .board > .player').eq(i).off('click').on('click', ()=>{
                if (script) return false;
                game.stop(()=>{
                    game.view.redraw((game.view._viewpoint + i) % 4);
                    game.start();
                });
                return false;
            });
        }

        $(window).on('keyup', (ev)=>{
            if (script && ev.key == ' ') {
                players[0]._auto_replay = ! players[0]._auto_replay;
            }
        });

        $('body').attr('class','board');
        scale($('#board'), $('#space'));

        game.wait = 5000;
        game.kaiju();
    }

    $(window).on('resize', ()=>scale($('#board'), $('#space')));

    $('#board .navi').on('click', function(){ $(this).toggleClass('active') });

    $(window).on('load', function(){
        setSelector($('#title .start'), 'title');
        hide($('#title .loading'));
        $('#title .start').on('click', start)
        show($('#title .start'));
    });
    if (loaded) $(window).trigger('load');
});

$(window).on('load', ()=> loaded = true);
