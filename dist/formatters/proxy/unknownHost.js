"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatUnknownHost = void 0;
const types_1 = require("../../types");
const array_1 = require("../../util/array");
const url_1 = require("../../validators/url");
const target_1 = require("./target");
const BAD_HOSTS = ["localhost"];
const BAD_IPS = ["127.0.0.1"];
function formatUnknownHost(value, defaultTarget) {
    if (!value) {
        return;
    }
    if (typeof value !== "object") {
        throw new Error("default proxy needs to be an object");
    }
    if (Array.isArray(value)) {
        throw new Error("default proxy can't be an array");
    }
    const allow = value.allow;
    if (typeof allow !== "string") {
        throw new Error("The allow needs to be a string");
    }
    var ret;
    switch (allow) {
        case types_1.TypeValidAllow.NONE: return;
        case types_1.TypeValidAllow.IP: {
            return {
                allow: allow,
                blacklist: formatRestricted(types_1.TypeValidAllow.IP, value.blacklist),
                whitelist: formatRestricted(types_1.TypeValidAllow.IP, value.whitelist),
                target: (0, target_1.formatTarget)(value.target, defaultTarget)
            };
        }
        case types_1.TypeValidAllow.HOSTS: {
            ret = {
                allow: allow,
                blacklist: formatRestricted(types_1.TypeValidAllow.HOSTS, value.blacklist),
                whitelist: formatRestricted(types_1.TypeValidAllow.HOSTS, value.whitelist),
                target: (0, target_1.formatTarget)(value.target, defaultTarget)
            };
            break;
        }
        case types_1.TypeValidAllow.ALL: {
            ret = {
                allow: allow,
                blacklist: formatRestricted(types_1.TypeValidAllow.ALL, value.blacklist),
                whitelist: formatRestricted(types_1.TypeValidAllow.ALL, value.whitelist),
                target: (0, target_1.formatTarget)(value.target, defaultTarget)
            };
            break;
        }
        default: {
            throw new Error("invalid allow in the default proxy");
        }
    }
    if (ret.target.port === 443 || ret.target.port === 80) {
        if ((0, array_1.includes)(BAD_HOSTS, ret.target.hostname)) {
            throw new Error("The unkown port is " + ret.target.port + " and the hostname directs to the server");
        }
        if ((0, array_1.includes)(BAD_IPS, ret.target.hostname)) {
            throw new Error("The unkown port is " + ret.target.port + " and the hostname directs to the server");
        }
        console.warn("Setting the default port to 443 or 80 may result in an infinite loop", "If the default .", "just in case we've added localhost and 127.0.0.1 to the blacklist.");
        console.warn("Any proxy server you use should probably respect the X-Forwarded-For when it comes to blacklists");
        console.warn("But really infinite loops don't need to be port 443 or 80 to happen.", "We're just trying to be safe.");
        ret.blacklist.push(...BAD_HOSTS);
        ret.blacklist.push(...BAD_IPS);
    }
    return ret;
}
exports.formatUnknownHost = formatUnknownHost;
function formatRestricted(allowedTypes, value) {
    if (!value)
        return [];
    if (allowedTypes === types_1.TypeValidAllow.NONE)
        return [];
    if (!Array.isArray(value)) {
        throw new Error("When setting the restricted values for allow, it must be an array");
    }
    const found = [];
    value.forEach((item) => {
        if (typeof item !== "string") {
            throw new Error("when setting restricted its expected to be an array of ips or hostnames");
        }
        RestrictedTypeTesters[allowedTypes](item);
        if ((0, array_1.includes)(found, item))
            return;
        found.push(item);
    });
    return found;
}
const RestrictedTypeTesters = {
    [types_1.TypeValidAllow.ALL]: (item) => {
        // Todo
        try {
            return (0, url_1.testWildOrDirectDomain)(item);
        }
        catch (e) { }
        try {
            return (0, url_1.testIP)(item);
        }
        catch (e) { }
        throw new Error("when allowing all with restrictions, need to provide an ip or direct domain name");
    },
    [types_1.TypeValidAllow.IP]: (item) => {
        (0, url_1.testIP)(item);
    },
    [types_1.TypeValidAllow.HOSTS]: (item) => {
        (0, url_1.testWildOrDirectDomain)(item);
    }
};
//# sourceMappingURL=unknownHost.js.map