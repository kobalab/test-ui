/*!
 *  電脳麻将: 自動対戦 v0.3.0
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

    function start() {

        clearSelector('title');
        $('body').attr('class','board');
        scale($('#board'), $('#space'));

        let players = [];
        for (let i = 0; i < 4; i++) players[i] = new Majiang.AI;
        let game  = new Majiang.Game(players, start);
        game.view = new Majiang.UI.Board($('#board .board'), pai, audio,
                                            game.model);
        game._view.no_player_name = true;
        game._view.sound_on = localStorage.getItem('Majiang.pref')
                                ? JSON.parse(localStorage.getItem(
                                        'Majiang.pref')).sound_on
                                : true;
        game.speed = 2;
        game.wait = 5000;

        hide($('#board .board .dialog button'));
        hide($('#board .board .summary button'));

        $('#board .board').off('click').on('click', ()=>{
            if (game._stop) game.start();
            else            game.stop();
        });

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
