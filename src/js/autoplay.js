/*!
 *  電脳麻将: 自動対戦 v0.2.8
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

    let game;
    const pai   = Majiang.UI.pai($('#loaddata'));
    const audio = Majiang.UI.audio($('#loaddata'));

    function start() {
        console.log('*** START ***');
        clearSelector('title');
        $('body').attr('class','board');
        scale($('#board'), $('#space'));

        let players = [];
        for (let i = 0; i < 4; i++) players[i] = new Majiang.AI;
        game      = new Majiang.Game(players, start);
        game.view = new Majiang.UI.Board($('#board'), pai, audio, game.model);

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
