/*
 *  fadein.js
 */
const { show, hide, fadeIn, fadeOut } = require('./lib/fadein');

$(function(){
    const box = $('#box');
    $('input[value="show"]').on('click', ()=>show(box));
    $('input[value="hide"]').on('click', ()=>hide(box));
    $('input[value="fadeIn"]').on('click', ()=>fadeIn(box));
    $('input[value="fadeOut"]').on('click', ()=>fadeOut(box));
});
