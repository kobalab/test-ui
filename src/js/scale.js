const { scale } = require('./lib/scale');
$(function(){
    $(window).on('resize', ()=>scale($('.main'), $('.space')));
});
