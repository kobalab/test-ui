/*!
 *  電脳麻将: ネット対戦 v0.5.0
 *
 *  Copyright(C) 2017 Satoshi Kobayashi
 *  Released under the MIT license
 *  https://github.com/kobalab/Majiang/blob/master/LICENSE
 */
"use strict";

const { hide, show, fadeIn, scale,
        setSelector, clearSelector  } = Majiang.UI.Util;

const base = location.pathname.replace(/\/.*?$/,'');

let loaded;

$(function(){

    let sock;

    function init() {

        sock = io('/', { path: `${base}/server/socket.io` });

        sock.on('HELLO', hello);

        hide($('#title .loading'));
    }

    function hello(user) {
        console.log('**', user);
        if (! user) {
            $('body').attr('class','title');
            show($('#title .login'));
            return;
        }
        $('body').attr('class','room');
    }

    $(window).on('load', init);
    if (loaded) $(window).trigger('load');
});
$(window).on('load', ()=> loaded = true);
