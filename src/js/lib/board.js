/*
 *  Majiang.UI.Board
 */
"use strict";

const $ = require('jquery');

const Shoupai    = require('./shoupai');
const Shan       = require('./shan');
const He         = require('./he');
const HuleDialog = require('./dialog');
const summary    = require('./summary');

const { hide, show, fadeIn, fadeOut } = require('./fadein');

const class_name  = ['main','xiajia','duimian','shangjia'];
const feng_hanzi  = ['東','南','西','北'];
const jushu_hanzi = ['一局','二局','三局','四局'];

const say_text   = { chi:   'チー',
                     peng:  'ポン',
                     gang:  'カン',
                     lizhi: 'リーチ',
                     rong:  'ロン',
                     zimo:  'ツモ'    };

const jicun = { changbang: '本場', lizhibang: '供託' };

const player_name = ['私','上家','対面','下家'];

function set_aria(root) {

    $('.score', root).attr('role','region')
                     .attr('aria-label','局情報');
//    $('.score .jushu', root).attr('aria-live','polite');
    for (let key of Object.keys(jicun)) {
        const node = $(`.score .${key}`).parent();
        const img = $('img', node);
        if (img.length == 1 && ! img.attr('alt'))
                img.attr('alt', jicun[key]);
        else    node.attr('aria-label', jicun[key]);
    }

    $('.shan .baopai', root).attr('aria-label','ドラ表示牌');

    for (let i = 0; i < 4; i++) {
        $(`.he.${class_name[i]}`, root)
            .attr('role','region')
            .attr('aria-label', `${player_name[i]}: 捨て牌`)
//            .attr('aria-live','assertive')
//            .attr('aria-relevant','additions');
        $(`.he.${class_name[i]} .chouma`, root)
            .attr('aria-label', 'リーチ');
    }
}

function score(root, model, viewpoint) {

    $('.jushu', root).text(feng_hanzi[model.zhuangfeng]
                            + jushu_hanzi[model.jushu]);
    $('.changbang', root).text(model.changbang);
    $('.lizhibang', root).text(model.lizhibang);

    for (let l = 0; l < 4; l++) {

        let id = model.player_id[l];
        let defen = '' + model.defen[id];
        defen = defen.replace(/(\d+)(\d{3})$/, '$1,$2');
        defen = feng_hanzi[l] + ': ' + defen;

        let c = class_name[(4 + id - viewpoint) % 4];
        $(`.defen .${c}`, root).text(defen);
    }
}

module.exports = class Board {

    constructor(root, pai, audio, model) {

        this._root  = root;
        this._model = model;
        this._pai   = pai;
        this._audio = {};
        this._view  = {
            shoupai: [],
            he:      [],
            say:     [],
            dialog:  null
        };

        this.sound_on     = true;
        this.open_shoupai = false;
        this.he_type      = 0;
        this.dummy_name   = [];

        this.set_audio(audio);
        set_aria(root);
    }

    set_audio(audio) {
        for (let name of Object.keys(say_text)) {
            this._audio[name] = [];
            for (let l = 0; l < 4; l++) this._audio[name][l] = audio(name);
        }
        this._audio.dapai = audio('dapai');
        this._audio.gong  = audio('gong');
    }

    kaiju(viewpoint = 0) {

        this._viewpoint = viewpoint;

        this.summary();

        let title = $('<span>').text(this._model.title).html()
                                    .replace(/\n/g,'<br aria-hidden="true">');
        $('.kaiju .title').html(title);

        for (let l = 0; l < 4; l++) {
            let id = this._model.player_id[l];
            let c  = class_name[(4 + id - viewpoint) % 4];

            let name = this.dummy_name[id] ||
                        this._model.player[id].replace(/\n.*$/,'');
            $(`.kaiju .player .${c}`, this._root).text(name);
        }

        show($('.kaiju', this._root));

        return this;
    }

    redraw(viewpoint) {

        if (viewpoint != null) this._viewpoint = viewpoint;
        else                   viewpoint = this._viewpoint;

        const model = this._model, view = this._view;

        hide($('.kaiju'), this._root);
        view.dialog = new HuleDialog($('.dialog', this._root), this._pai,
                                        model, viewpoint);
        this.summary();

        score($('.score', this._root), model, viewpoint);

        view.shan = new Shan($('.score .shan', this._root), this._pai,
                                model.shan).redraw();

        for (let l = 0; l < 4; l++) {
            let id = model.player_id[l];
            let c  = class_name[(4 + id - viewpoint) % 4];

            let name = this.dummy_name[id] ||
                            model.player[id].replace(/\n.*$/,'');
            $(`.player.${c}`, this._root).text(name);

            let open = model.player_id[l] == viewpoint;
            view.shoupai[l]
                    = new Shoupai($(`.shoupai.${c}`, this._root),
                                    this._pai, model.shoupai[l]
                                ).redraw(open || this.open_shoupai);

            view.he[l] = new He($(`.he.${c}`, this._root),
                                    this._pai, model.he[l]
                                ).redraw(this.he_type);

            view.say[l] = hide($(`.say.${c}`, this._root).text(''));
        }
        this._lunban = model.lunban;

        return this;
    }

    update(msg = {}) {

        const model = this._model, view = this._view;

        view.dialog.hide();
        this.summary();

        if (this._lizhi) {
            score($('.score', this._root), model, this._viewpoint);
            this._lizhi = false;
        }
        if (this._lunban >= 0 && this._lunban != model.lunban) {
            view.he[this._lunban].redraw();
            view.shoupai[this._lunban].redraw();
        }

        if (msg.zimo) {
            view.shan.update();
            view.shoupai[msg.zimo.l].redraw();
        }
        else if (msg.dapai) {
            fadeOut(view.say[msg.dapai.l]);
            view.shoupai[msg.dapai.l].dapai(msg.dapai.p);
            this.play_audio(this._audio.dapai);
            view.he[msg.dapai.l].dapai(msg.dapai.p);
            this._lizhi = msg.dapai.p.slice(-1) == '*';
        }
        else if (msg.fulou) {
            view.shoupai[msg.fulou.l].redraw();
        }
        else if (msg.gang) {
            view.shoupai[msg.gang.l].redraw();
        }
        else if (msg.gangzimo) {
            fadeOut(view.say[msg.gangzimo.l]);
            view.shan.update();
            view.shoupai[msg.gangzimo.l].redraw();
        }
        else if (msg.kaigang) {
            view.shan.redraw();
        }
        else if (msg.hule) {
            fadeOut($('.say', this._root));
            setTimeout(()=>{
                view.shoupai[msg.hule.l].redraw(true);
                view.dialog.hule(msg.hule);
                if (msg.hule.damanguan) this.play_audio(this._audio.gong);
            }, 400);
        }
        else if (msg.pingju) {
            fadeOut($('.say', this._root));
            let duration = 0;
            if (msg.pingju.name.match(/^三家和/))
                    duration = 400;
            else    view.he[this._lunban].redraw();
            setTimeout(()=>{
                for (let l = 0; l < 4; l++) {
                    let open = model.player_id[l] == this._viewpoint
                                || msg.pingju.shoupai[l];
                    view.shoupai[l].redraw(open);
                }
                view.dialog.pingju(msg.pingju);
            }, duration);
        }
        else {
            score($('.score', this._root), model, this._viewpoint);
        }

        class_name.forEach(c => $(`.${c}`, this._root).removeClass('lunban'));
        if (model.lunban >= 0) {
            let id = model.player_id[model.lunban];
            let c  = class_name[(4 + id - this._viewpoint) % 4];
            $(`.${c}`, this._root).addClass('lunban');
        }
        this._lunban = model.lunban;

        return this;
    }

    say(name, l) {
        this.play_audio(this._audio[name][l]);
        show(this._view.say[l].text(say_text[name]));
        return this;
    }

    summary(paipu) {
        if (this._view.dialog) this._view.dialog.hide();
        if (paipu) fadeIn(summary($('.summary', this._root), paipu,
                                                        this._viewpoint));
        else       hide($('.summary', this._root));
    }

    play_audio(audio) {
        if (this.sound_on) {
            audio.currentTime = 0;
            audio.play();
        }
    }

    players(players) {
        for (let id = 0; id < 4; id++) {
            let c = class_name[(4 + id - this._viewpoint) % 4];
            if (players[id])
                    $(`.player.${c}`, this._root).removeClass('disconnect');
            else    $(`.player.${c}`, this._root).addClass('disconnect');
        }
    }
}
