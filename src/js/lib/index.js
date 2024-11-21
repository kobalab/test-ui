"use strict";
module.exports = {
    pai:         require('./pai'),
    audio:       require('./audio'),
    mianzi:      require('./mianzi'),
    Util:        Object.assign(require('./fadein'),
                               require('./selector'),
                               require('./scale'),
                               require('./flip'))
}
