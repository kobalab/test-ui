/*!
 *  電脳麻将: ネット対戦 v0.6.3
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
        $('#room .netplay .name').text(user.name);
        if (user.icon) {
            $('#room .netplay img').attr('src', user.icon)
                                   .attr('title', user.uid);
        }
        $('body').attr('class','room');
        show($('#room .netplay'));
    }

    const row = $('#room .user').eq(0);
    const src = $('img', row).attr('src');

    function room(msg) {

        $('#room [name="room_no"]').val(msg.room_no);
        $('#room > form .room').empty();
        for (let user of msg.user) {
            let r  = row.clone();
            if (user.icon) $('img', r).attr('src', user.icon);
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

        let players = [], seq = 0;
        sock.removeAllListeners('GAME');
        sock.on('GAME', (msg)=>{
            if (msg.players) {
                players = msg.players;
            }
            else if (msg.seq) {
                if (seq && msg.seq != seq) location.reload();
                player.action(msg, (rep = {})=>{
                    rep.seq = msg.seq;
                    sock.emit('GAME', rep);
                    seq = msg.seq + 1;
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
            player._view.players(players);
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

        let room_no = $('[name="room_no"]', $(ev.target)).val();

        let rule = $('[name="rule"]', $(ev.target)).val();
        rule = ! rule      ? {}
             : rule == '-' ? JSON.parse(
                                localStorage.getItem('Majiang.rule')||"{}")
             :               preset[rule];
        rule = Majiang.rule(rule);

        let timer = $('[name="timer"]', $(ev.target)).val();
        timer = timer.match(/(\d+)/g);
        if (timer) timer = timer.map(t => +t);

        sock.emit('START', room_no, rule, timer);
        return false;
    });

    $(window).on('resize', ()=>scale($('#board'), $('#space')));

    $('#board .navi').on('click', function(){ $(this).toggleClass('active') });

    $('#title .login form').each(function(){
        let method = $(this).attr('method');
        let url    = $(this).attr('action');
        fetch(url, { method: method, redirect: 'manual' })
            .then(res => res.status == 404 && hide($(this)));
    });

    $(window).on('load', init);
    if (loaded) $(window).trigger('load');
});
$(window).on('load', ()=> loaded = true);
