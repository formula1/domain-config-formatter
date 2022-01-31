"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.proxyToAllowed = exports.greenlockToAllowed = exports.greenlockToProxy = exports.proxyToGreenlock = void 0;
__exportStar(require("./greenlock"), exports);
__exportStar(require("./proxy"), exports);
const sortHostnames_1 = require("./greenlock/sortHostnames");
function proxyToGreenlock(pConfig) {
    const hostNameSorter = (0, sortHostnames_1.factory_sortHostnames)((site) => (site.subject));
    const altnameSorter = (0, sortHostnames_1.factory_sortHostnames)((altname) => (altname));
    return {
        sites: Object.values(pConfig.sites).map((site) => {
            return {
                subject: site.subject,
                altnames: [site.subject].concat(Object.keys(site.altnames.wild)).concat(Object.values(site.altnames.direct).reduce((total, direct) => {
                    return total.concat(Object.keys(direct));
                }, [])).sort(altnameSorter)
            };
        }).sort(hostNameSorter)
    };
}
exports.proxyToGreenlock = proxyToGreenlock;
function greenlockToProxy(gConfig) {
    console.log(gConfig);
    throw new Error("There are some properties that will be missing like maintainerEmail."
        + "\nCould probably just make it for the sites part but I haven't done that");
}
exports.greenlockToProxy = greenlockToProxy;
function greenlockToAllowed(gConfig) {
    console.log(gConfig);
    throw new Error("This function hasn't been implemented yet");
}
exports.greenlockToAllowed = greenlockToAllowed;
function proxyToAllowed(pConfig) {
    console.log(pConfig);
    throw new Error("This function hasn't been implemented yet");
}
exports.proxyToAllowed = proxyToAllowed;
//# sourceMappingURL=index.js.map