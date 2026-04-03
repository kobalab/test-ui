/*!
 *  電脳麻将 v0.3.1
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

    let game;

    function start() {

        clearSelector('title');

        hide($('#board .board .dialog'));
        hide($('#board .board .summary'));
        hide($('#board .board > .player'));

        let players = [ new Majiang.UI.Player($('#board .board')) ];
        for (let i = 1; i < 4; i++) players[i] = new Majiang.AI;
        game      = new Majiang.Game(players, start);
        game.view = new Majiang.UI.Board($('#board .board'), pai, audio,
                                            game.model);

        let gamectl = new Majiang.UI.GameCtl(
                        $('#board .controller'), 'Majiang.pref',
                        game, game._view);

        $('body').attr('class','board');
        scale($('#board'), $('#space'));

        game.kaiju();
    }

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
