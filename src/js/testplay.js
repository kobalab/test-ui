/*!
 *  電脳麻将: 試験対戦 v0.3.1
 *
 *  Copyright(C) 2017 Satoshi Kobayashi
 *  Released under the MIT license
 *  https://github.com/kobalab/Majiang/blob/master/LICENSE
 */
"use strict";

const { hide, show, fadeIn, scale,
        setSelector, clearSelector  } = Majiang.UI.Util;

let loaded;

$(function(){

    const pai   = Majiang.UI.pai($('#loaddata'));
    const audio = Majiang.UI.audio($('#loaddata'));

    const script = localStorage.getItem('Majiang.paipu')
                    && JSON.parse(localStorage.getItem('Majiang.paipu'))[0];

    function start() {

        clearSelector('title');

        hide($('#board .board .dialog'));
        hide($('#board .board .summary'));

        let players = [ new Majiang.Dev.Player($('#board .board')) ];
        for (let i = 1; i < 4; i++) players[i] = new Majiang.AI;
        let game  = script ? new Majiang.Dev.Game(script, Majiang.rule())
                           : new Majiang.Game(players);
        if (script) game._players[0] = players[0];
        game.view = new Majiang.UI.Board($('#board .board'), pai, audio,
                                            game.model);

        let gamectl = new Majiang.UI.GameCtl(
                        $('#board .controller'), 'Majiang.pref',
                        game, game._view);

        for (let i = 1; i < 4; i++) {
            $('#board .board > .player').eq(i).off('click').on('click', ()=>{
                if (script) return false;
                game.stop(()=>{
                    game._view.redraw((game._view._viewpoint + i) % 4);
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

    $('#board .navi [role="button"]').on('click', ()=>{
        $('#board .navi').toggleClass('active');
        return false;
    });

    $(window).on('load', function(){
        setSelector($('#title .start'), 'title');
        hide($('#title .loading'));
        $('#title .start').on('click', start)
        show($('#title .start'));
    });
    if (loaded) $(window).trigger('load');
});

$(window).on('load', ()=> loaded = true);
