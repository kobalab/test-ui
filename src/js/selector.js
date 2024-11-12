const { setSelector } = require('./lib/selector');
$(function(){
    $('.box, .plate').on('click', (ev)=>{
        $(".box, .plate").removeClass('selected');
        $(ev.target).addClass('selected');
    });

    setSelector($('.box'), 'box');
    setSelector($('.plate'), 'plate', { prev: 'ArrowUp', next: 'ArrowDown',
                                        focus: null, touch: false });
});
