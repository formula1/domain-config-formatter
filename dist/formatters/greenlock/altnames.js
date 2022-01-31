"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatAltnames = void 0;
const sortHostnames_1 = require("./sortHostnames");
const altnames_1 = require("../reused/altnames");
function formatAltnames(subject, altnames) {
    if (typeof altnames === "undefined") {
        return [subject];
    }
    if (!Array.isArray(altnames)) {
        throw new Error("The altnames property is expected to be an array of strings");
    }
    const ret = [subject];
    (0, altnames_1.altnameItertator)(subject, altnames, (v) => (ret.push(v.subject)));
    ret.sort((0, sortHostnames_1.factory_sortHostnames)((s) => (s)));
    return ret;
}
exports.formatAltnames = formatAltnames;
//# sourceMappingURL=altnames.js.map