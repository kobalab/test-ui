/*!
 *  電脳麻将: ネット対戦 v0.6.0
 *
 *  Copyright(C) 2017 Satoshi Kobayashi
 *  Released under the MIT license
 *  https://github.com/kobalab/Majiang/blob/master/LICENSE
 */
"use strict";

const { hide, show, fadeIn, fadeOut, scale,
        setSelector, clearSelector  } = Majiang.UI.Util;

const preset = require('./conf/rule.json');

const base = location.pathname.replace(/\/[^\/]*?$/,'');

let loaded;

$(function(){

    const pai   = Majiang.UI.pai($('#loaddata'));
    const audio = Majiang.UI.audio($('#loaddata'));

    let sock, myuid;

    function init() {

        sock = io('/', { path: `${base}/server/socket.io` });

        sock.on('HELLO', hello);
        sock.on('ROOM',  room);
        sock.on('START', start);
        sock.on('END',   end);
        sock.on('ERROR', error);

        hide($('#title .loading'));
    }

    function hello(user) {
        if (! user) {
            $('body').attr('class','title');
            show($('#title .login'));
            return;
        }
        myuid = user.uid;
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
            if (msg.user[0].uid == myuid || user.uid == myuid) {
                show($('[name="quit"]', r).on('click', ()=>{
                    sock.emit('ROOM', msg.room_no, user.uid);
                }));
            }
            if (user.offline) r.addClass('offline');
            else              r.removeClass('offline');
            $('#room > form .room').append(r);
        }
        if (msg.user[0].uid == myuid) show($('#room > form .submit'));
        else                          hide($('#room > form .submit'));

        hide($('#room .netplay'));
        show($('#room > form'));
    }

    function start() {

        const player = new Majiang.UI.Player($('#board .board'), pai, audio);
        player.view  = new Majiang.UI.Board($('#board .board'), pai, audio,
                                                player.model);
        new Majiang.UI.GameCtl($('#board .controller'), 'Majiang.pref',
                                null, player, player._view);

        $('body').attr('class','board');
        scale($('#board'), $('#space'));

        sock.removeAllListeners('GAME');
        sock.on('GAME', (msg)=>{
            if (msg.players) {
            }
            else if (msg.seq) {
                player.action(msg, (rep = {})=>{
                    rep.seq = msg.seq;
                    sock.emit('GAME', rep);
                });
            }
            else if (msg.say) {
                player._view.say(msg.say.name, msg.say.l);
            }
            else {
                player.action(msg);
                if (msg.kaiju && msg.kaiju.log) {
                    let log = msg.kaiju.log.pop();
                    for (let msg of log) {
                        player.action(msg);
                    }
                }
            }
        });
    }

    function end(paipu) {

        sock.removeAllListeners('GAME');
        $('body').attr('class','room');
        hide($('#room > form'));
        show($('#room .netplay'));
    }

    function error(msg) {
        const error = $('#room .error');
        fadeIn(error.text(msg).on('click', ()=> fadeOut(error)));
        setTimeout(()=> error.trigger('click'), 5000);
    }

    for (let key of Object.keys(preset)) {
        $('select[name="rule"]').append($('<option>').val(key).text(key));
    }
    if (localStorage.getItem('Majiang.rule')) {
        $('select[name="rule"]').append(
                        $('<option>').val('-').text('カスタムルール'));
    }

    $('#room form.room').on('submit', (ev)=>{
        let room_no = $('[name="room_no"]', $(ev.target)).val();
        sock.emit('ROOM', room_no);
        return false;
    });
    $('#room > form').on('submit', (ev)=>{
        ev.preventDefault();
        let room_no = $('[name="room_no"]', $(ev.target)).val();
        let rule = $('[name="rule"]', $(ev.target)).val();
        rule = ! rule      ? {}
             : rule == '-' ? JSON.parse(
                                localStorage.getItem('Majiang.rule')||"{}")
             :               preset[rule];
        rule = Majiang.rule(rule);
        sock.emit('START', room_no, rule);
        return false;
    });

    $(window).on('resize', ()=>scale($('#board'), $('#space')));

    $('#board .navi').on('click', function(){ $(this).toggleClass('active') });

    $(window).on('load', init);
    if (loaded) $(window).trigger('load');
});
$(window).on('load', ()=> loaded = true);
