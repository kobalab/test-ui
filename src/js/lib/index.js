"use strict";
module.exports = {
    pai:         require('./pai'),
    audio:       require('./audio'),
    Shoupai:     require('./shoupai'),
    Shan:        require('./shan'),
    Util:        Object.assign(require('./fadein'),
                               require('./selector'),
                               require('./scale'),
                               require('./flip'))
}
