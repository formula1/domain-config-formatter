"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deepEqual = exports.copy = void 0;
const array_1 = require("./array");
function copy(json) {
    return JSON.parse(JSON.stringify(json));
}
exports.copy = copy;
function deepEqual(a, b) {
    if (typeof a !== "object")
        return a === b;
    if (typeof b !== "object")
        return false;
    if (a === null)
        return a === b;
    if (Array.isArray(a) && Array.isArray(b)) {
        if (a.length !== b.length)
            return false;
        return !a.some((item) => {
            return !(0, array_1.includes)(b, item, deepEqual);
        });
    }
    if (Array.isArray(a) || Array.isArray(b)) {
        return false;
    }
    const akeys = Object.keys(a);
    const bkeys = Object.keys(b);
    if (akeys.length !== bkeys.length)
        return false;
    return !akeys.some((key) => {
        if (!(key in b))
            return true;
        return !deepEqual(a[key], b[key]);
    });
}
exports.deepEqual = deepEqual;
//# sourceMappingURL=json.js.map