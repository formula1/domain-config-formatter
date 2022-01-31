"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.escapeRegExp = void 0;
// Thanks
// https://stackoverflow.com/questions/3115150/how-to-escape-regular-expression-special-characters-using-javascript
function escapeRegExp(string) {
    // $& means the whole matched string
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
exports.escapeRegExp = escapeRegExp;
//# sourceMappingURL=string.js.map