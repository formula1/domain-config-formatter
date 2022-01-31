"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatJsonToProxy = void 0;
const email_1 = require("./email");
const unknownHost_1 = require("./unknownHost");
const target_1 = require("./target");
const sites_1 = require("./sites");
function formatJsonToProxy(value) {
    if (typeof value !== "object") {
        throw new Error("can only format objects");
    }
    if (Array.isArray(value)) {
        throw new Error("cannot format an array, need parts like maintainerEmail");
    }
    const defaultTarget = (0, target_1.formatDefaultTarget)(value.defaultTarget);
    const obj = {
        maintainerEmail: (0, email_1.formatEmail)(value.maintainerEmail),
        defaultTarget: defaultTarget,
        sites: (0, sites_1.formatSites)(value.sites, defaultTarget),
    };
    const unknownHost = (0, unknownHost_1.formatUnknownHost)(value.unknownHost, defaultTarget);
    if (unknownHost) {
        obj.unknownHost = unknownHost;
    }
    return obj;
}
exports.formatJsonToProxy = formatJsonToProxy;
//# sourceMappingURL=index.js.map