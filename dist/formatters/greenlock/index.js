"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatJsonToGreenlock = void 0;
const sites_1 = require("./sites");
function formatJsonToGreenlock(json) {
    if (typeof json !== "object") {
        throw new Error("the config must be an object");
    }
    if (Array.isArray(json)) {
        throw new Error("the config cannot be an array");
    }
    return {
        sites: (0, sites_1.formatSites)(json.sites)
    };
}
exports.formatJsonToGreenlock = formatJsonToGreenlock;
//# sourceMappingURL=index.js.map