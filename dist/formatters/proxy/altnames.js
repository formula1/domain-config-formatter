"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatAltnames = void 0;
const array_1 = require("../../util/array");
const altnames_1 = require("../reused/altnames");
const target_1 = require("./target");
function formatAltnames(subject, subdomains, defaultTarget) {
    if (typeof subdomains === "undefined") {
        return {
            top: subject,
            wild: {},
            direct: {}
        };
    }
    if (!Array.isArray(subdomains)) {
        throw new Error("The altnames property is expected to be an array of strings");
    }
    const wildKeys = [];
    const wild = {};
    const direct = {};
    (0, altnames_1.altnameItertator)(subject, subdomains, (o) => {
        const v = {
            subject: o.subject,
            target: true,
        };
        if (typeof o.target !== "undefined") {
            v.target = (0, target_1.formatTarget)(o.target, defaultTarget);
        }
        if (/^\*/.test(v.subject)) {
            wildKeys.push(v.subject);
            wild[v.subject] = v.target;
            if (v.subject in direct) {
                console.warn("Seems that you have a wild card that also matches some direct subdomains.", "We will delete the direct subdomains but this may be removed in the future.");
                delete direct[v.subject];
            }
            return;
        }
        const wildCard = ["*"].concat(v.subject.split(".").slice(1)).join(".");
        if ((0, array_1.includes)(wildKeys, wildCard)) {
            console.warn("Seems that you have a wild card that also matches some direct subdomains.", "We will delete the direct subdomains but this may be removed in the future.");
            return;
        }
        if (!(wildCard in direct)) {
            direct[wildCard] = {};
        }
        direct[wildCard][v.subject] = v.target;
    });
    return {
        top: subject,
        wild: wild,
        direct: direct,
    };
}
exports.formatAltnames = formatAltnames;
//# sourceMappingURL=altnames.js.map