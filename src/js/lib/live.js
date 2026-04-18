/*
 *  live.js
 */
"use strict";

function live(root, mode, attr = {}) {
    root.empty()
        .attr('aria-live', mode);
    for (let key of Object.keys(attr)) {
        root.attr(key, attr[key]);
    }
    return function(message) {
        if (! message) root.empty();
        else root.append($('<div>').text(message));
    }
}

module.exports = { live: live };
