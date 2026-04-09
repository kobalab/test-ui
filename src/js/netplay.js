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

    let sock, myid;

    function init() {

        sock = io('/', { path: `${base}/server/socket.io` });

        sock.on('HELLO', hello);
        sock.on('ROOM',  room);

        hide($('#title .loading'));
    }

    function hello(user) {
        if (! user) {
            $('body').attr('class','title');
            show($('#title .login'));
            return;
        }
        myid = user.uid;
        hide($('#room > form'));
        $('body').attr('class','room');
        $('#room .netplay .name').text(user.name);
        show($('#room .netplay'));
    }

    let row, src;
    function room(msg) {
        if (! row) {
            row = $('#room .user').eq(0);
            src = $('img', row).attr('src');
        }
        $('#room [name="room_no"]').val(msg.room_no);
        $('#room > form .room').empty();
        for (let user of msg.user) {
            let r  = row.clone();
            $('.name', r).text(user.name);
            if (msg.user[0].uid == myid || user.uid == myid) {
                show($('[name="quit"]', r).on('click', ()=>{
                    sock.emit('ROOM', msg.room_no, user.uid);
                }));
            }
            $('#room > form .room').append(r);
        }
        hide($('#room .netplay'));
        show($('#room > form'));
    }

    $('#room form.room').on('submit', (ev)=>{
        let room_no = $('[name="room_no"]', $(ev.target)).val();
        sock.emit('ROOM', room_no);
        return false;
    });

    $(window).on('load', init);
    if (loaded) $(window).trigger('load');
});
$(window).on('load', ()=> loaded = true);
