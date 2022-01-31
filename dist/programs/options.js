"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatOptions = void 0;
function formatOptions(opts) {
    return Object.keys(opts).reduce((ret, key) => {
        ret[key.toLowerCase()] = opts[key];
        return ret;
    }, {});
}
exports.formatOptions = formatOptions;
//# sourceMappingURL=options.js.map