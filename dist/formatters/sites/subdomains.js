"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unknownToHostConfig = exports.formatSubDomains = void 0;
const string_1 = require("../../util/string");
const array_1 = require("../../util/array");
const url_1 = require("../../validators/url");
const sortHostnames_1 = require("./sortHostnames");
function formatSubDomains(subject, subdomains) {
    const hostConfig = unknownToHostConfig(subject, subdomains);
    return ([hostConfig.top]
        .concat(hostConfig.wild.sort((0, sortHostnames_1.factory_sortHostnames)((s) => (s))))
        .concat(Object.values(hostConfig.direct).reduce((total, directItems) => {
        return total.concat(directItems);
    }, []).sort((0, sortHostnames_1.factory_sortHostnames)((s) => (s)))));
}
exports.formatSubDomains = formatSubDomains;
function unknownToHostConfig(subject, subdomains) {
    if (typeof subdomains === "undefined") {
        console.warn("subdomain's is expected top be set.", "Will default to just the hostname.", "This feature may be removed in a future release");
        return {
            top: subject,
            wild: [],
            direct: {}
        };
    }
    if (!Array.isArray(subdomains)) {
        throw new Error("The altnames property is expected to be an array of strings");
    }
    const subjectRegexp = new RegExp("\." + (0, string_1.escapeRegExp)(subject) + "$");
    const found = [subject];
    const wild = [];
    const direct = {};
    subdomains.forEach((subdomain) => {
        if (typeof subdomain !== "string") {
            throw new Error("Each subdomain is expected to be a string");
        }
        subdomain = subdomain.toLowerCase();
        if ((0, array_1.includes)(found, subdomain)) {
            console.warn("subdomain " + subdomain + " seems to have a duplicate declaration.", "The duplicate will be ignored, but it may throw an error in the future.");
            return;
        }
        if (!subjectRegexp.test(subdomain)) {
            throw new Error("subdomain " + subdomain + " is expected to extend the hostname" + subject);
        }
        (0, url_1.testWildOrDirectSubdomain)(subdomain);
        found.push(subdomain);
        if (/^\*/.test(subdomain)) {
            wild.push(subdomain);
            if (subdomain in direct) {
                console.warn("Seems that you have a wild card that also matches some direct subdomains.", "We will delete the direct subdomains but this may be removed in the future.");
                delete direct[subdomain];
            }
            return;
        }
        const wildCard = ["*"].concat(subdomain.split(".").slice(1)).join(".");
        if ((0, array_1.includes)(wild, wildCard)) {
            console.warn("Seems that you have a wild card that also matches some direct subdomains.", "We will delete the direct subdomains but this may be removed in the future.");
            return;
        }
        if (!(wildCard in direct)) {
            direct[wildCard] = [];
        }
        direct[wildCard].push(subdomain);
    });
    return {
        top: subject,
        wild: wild,
        direct: direct,
    };
}
exports.unknownToHostConfig = unknownToHostConfig;
//# sourceMappingURL=subdomains.js.map