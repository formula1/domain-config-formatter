"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDefaultProxy = void 0;
const types_1 = require("../types");
const url_1 = require("../validators/url");
const ip_1 = require("../validators/ip");
const url_2 = require("./url");
function formatDefaultProxy(value) {
    if (!value) {
        return {
            allow: types_1.TypeValidAllow.NONE
        };
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
    switch (allow) {
        case types_1.TypeValidAllow.NONE: return { allow: allow };
        case types_1.TypeValidAllow.IP: {
            return {
                allow: allow,
                restricted: formatRestricted(types_1.TypeValidAllow.IP, value.restricted),
                target: (0, url_2.formatHost)(value.target)
            };
        }
        case types_1.TypeValidAllow.HOSTS: {
            return {
                allow: allow,
                restricted: formatRestricted(types_1.TypeValidAllow.HOSTS, value.restricted),
                target: (0, url_2.formatHost)(value.target)
            };
        }
        case types_1.TypeValidAllow.ALL: {
            return {
                allow: allow,
                restricted: formatRestricted(types_1.TypeValidAllow.ALL, value.restricted),
                target: (0, url_2.formatHost)(value.target)
            };
        }
        default: {
            throw new Error("invalid allow in the default proxy");
        }
    }
}
exports.formatDefaultProxy = formatDefaultProxy;
function formatRestricted(allowedTypes, value) {
    if (!value)
        return [];
    if (!Array.isArray(value)) {
        throw new Error("When setting the restricted values for allow, it must be an array");
    }
    if (allowedTypes === types_1.TypeValidAllow.NONE)
        return [];
    return value.map((item) => {
        if (typeof item !== "string") {
            throw new Error("when setting restricted its expected to be an array of ips or hostnames");
        }
        RestrictedTypeTesters[allowedTypes](item);
        return item;
    });
}
const RestrictedTypeTesters = {
    [types_1.TypeValidAllow.ALL]: (item) => {
        // Todo
        try {
            return (0, url_1.testWildOrDirectDomain)(item);
        }
        catch (e) { }
        try {
            return (0, ip_1.testIP)(item);
        }
        catch (e) { }
        throw new Error("when allowing all with restrictions, need to provide an ip or direct domain name");
    },
    [types_1.TypeValidAllow.IP]: (item) => {
        (0, ip_1.testIP)(item);
    },
    [types_1.TypeValidAllow.HOSTS]: (item) => {
        (0, url_1.testWildOrDirectDomain)(item);
    }
};
//# sourceMappingURL=defaultProxy.js.map