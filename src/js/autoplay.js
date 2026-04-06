/*!
 *  電脳麻将: 自動対戦 v0.4.0
 *
 *  Copyright(C) 2017 Satoshi Kobayashi
 *  Released under the MIT license
 *  https://github.com/kobalab/Majiang/blob/master/LICENSE
 */
"use strict";

const { hide, show, fadeIn, scale,
        setSelector, clearSelector  } = Majiang.UI.Util;

let loaded;

const rule = Majiang.rule(
                JSON.parse(localStorage.getItem('Majiang.rule'))||'{}');

$(function(){

    const pai   = Majiang.UI.pai($('#loaddata'));
    const audio = Majiang.UI.audio($('#loaddata'));

    let game;
    let open_shoupai = false;
    let he_type      = false;

    function start() {

        clearSelector('title');

        hide($('#board .board .dialog'));
        hide($('#board .board .summary'));

        if (game) {
            open_shoupai = game._view.open_shoupai;
            he_type      = game._view.he_type;
        }

        let players = [];
        for (let i = 0; i < 4; i++) players[i] = new Majiang.AI;
        game      = new Majiang.Game(players, start, rule);
        game.view = new Majiang.UI.Board($('#board .board'), pai, audio,
                                            game.model);

        game._model.title
                = game._model.title.replace(/^[^\n]*/, $('title').text());
        game._view.open_shoupai = open_shoupai;
        game._view.he_type      = he_type;

        $(window).off('keyup');

        let gamectl = new Majiang.UI.GameCtl(
                        $('#board .controller'), 'Majiang.pref',
                        game, game._view);

        const download = ()=>{
            let blob = new Blob([ JSON.stringify(game._paipu)],
                                { type: 'application/json' });
            $('#board .download a')
                .attr('href', URL.createObjectURL(blob))
                .attr('download', '牌譜.json');
            show($('#board .download'));
        };

        $('#board .board').off('click').on('click', ()=>{
            hide($('#board .download'));
            if (gamectl.stoped) gamectl.start();
            else                gamectl.stop(download);
            game.handler = ()=> gamectl.stop(download);
        });
        $('#board .board > .shoupai')
                .off('click', '.pai')
                .on('click', '.pai', ()=> gamectl.shoupai());
        $('#board .board > .he')
                .off('click', '.pai')
                .on('click', '.pai', ()=> gamectl.he());

        $(window).on('keyup', (ev)=>{
            if (ev.key == ' ') {
                hide($('#board .download'));
                if (gamectl.stoped) gamectl.start();
                else                gamectl.stop(download);
                game.handler = ()=> gamectl.stop(download);
            }
            else if (ev.key == 's') gamectl.shoupai();
            else if (ev.key == 'h') gamectl.he();
            return false;
        });

        $('body').attr('class','board');
        scale($('#board'), $('#space'));

        game.wait = 5000;
        game.kaiju();
    }

    $(window).on('resize', ()=>scale($('#board'), $('#space')));

    hide($('#board .board > .player'));
    hide($('#board .board .submit'));

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
