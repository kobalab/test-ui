/*
 *  Majiang.UI.audio
 */
"use strict";

const $ = require('jquery');

module.exports = function(loaddata) {

    const audio = {};

    $('audio', loaddata).each((i, n)=>{
        let name = $(n).data('name');
        audio[name] = $(n);
    });

    return function(name){
        let new_audio = audio[name].clone()[0];
        let volume    = audio[name].attr('volume');
        if (volume) {
            new_audio.oncanplaythrough = ()=>{
                new_audio.volume = + volume;
                new_audio.oncanplaythrough = null;
            };
        }
        return new_audio;
    }
}
