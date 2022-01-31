"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.includes = void 0;
function includes(ari, v, cb) {
    if (!cb)
        cb = (a, b) => (a === b);
    for (var i = 0, l = ari.length; i < l; i++) {
        if (cb(ari[i], v))
            return true;
    }
    return false;
}
exports.includes = includes;
//# sourceMappingURL=array.js.map