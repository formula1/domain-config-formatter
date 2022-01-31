"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatHostname = exports.formatHostNameFactory = exports.HostNameFormatter = exports.hostnameRegexp = void 0;
const url_1 = require("../../validators/url");
exports.hostnameRegexp = /^((?!-)[A-Za-z0-9-]{1, 63}(?<!-)\\.)+[A-Za-z]{2, 6}$/;
class HostNameFormatter {
    constructor() {
        this.foundHosts = [];
    }
    formatHostname(hostname) {
        return formatHostname(this.foundHosts, hostname);
    }
}
exports.HostNameFormatter = HostNameFormatter;
function formatHostNameFactory() {
    const foundHosts = [];
    return function (hostname) {
        return formatHostname(foundHosts, hostname);
    };
}
exports.formatHostNameFactory = formatHostNameFactory;
function formatHostname(foundHosts, hostname) {
    if (typeof hostname !== "string") {
        throw new Error("each site is expected to have a hostname");
    }
    (0, url_1.testHostname)(hostname);
    if (foundHosts.includes(hostname)) {
        throw new Error("seems like you have a duplicate config for " + hostname);
    }
    foundHosts.push(hostname);
    return hostname;
}
exports.formatHostname = formatHostname;
//# sourceMappingURL=hostname.js.map