"use strict";
module.exports = {
    pai:         require('./pai'),
    Util:        Object.assign(require('./fadein'),
                               require('./selector'),
                               require('./scale'))
}
