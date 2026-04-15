/*!
 *  電脳麻将 v0.6.3
 *
 *  Copyright(C) 2017 Satoshi Kobayashi
 *  Released under the MIT license
 *  https://github.com/kobalab/Majiang/blob/master/LICENSE
 */
"use strict";
global.Majiang = require('@kobalab/majiang-core');
global.Majiang.AI = require('@kobalab/majiang-ai');
global.Majiang.UI = require('./lib/');
global.Majiang.VERSION = '0.6.3';
global.jQuery = require('jquery');
global.$ = jQuery;

global.Majiang.Dev = {
    Game:   require('./dev/game'),
    Player: require('./dev/player'),
};
