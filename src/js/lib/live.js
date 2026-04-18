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

    let last, prev;

    return function(message) {
        if (! message) {
            root.empty();
            prev = null;
        }
        else {
            if (message == prev || ! prev && message == last) message += ',';
            root.append($('<div>').text(message));
            if (! prev) last = message;
            prev = message;
        }
    }
}

module.exports = { live: live };
