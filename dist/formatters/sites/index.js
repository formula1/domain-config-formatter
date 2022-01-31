"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatSites = void 0;
const url_1 = require("../url");
const hostname_1 = require("./hostname");
const subdomains_1 = require("./subdomains");
const sortHostnames_1 = require("./sortHostnames");
function formatSites(value, defaultTarget) {
    if (!Array.isArray(value)) {
        throw new Error("the sites array must be an array");
    }
    if (value.length === 0) {
        throw new Error("sites is expected to have at least one value");
    }
    const sortHostnames = (0, sortHostnames_1.factory_sortHostnames)((h) => (h.subject));
    const formatHostName = (0, hostname_1.formatHostNameFactory)();
    return value.map((value) => {
        if (typeof value !== "object") {
            throw new Error("each site must be an object, got " + value);
        }
        if (Array.isArray(value)) {
            throw new Error("each site must not be an array");
        }
        const subject = formatHostName(value.subject);
        return {
            subject: subject,
            altnames: (0, subdomains_1.formatSubDomains)(subject, value.altnames),
            target: (0, url_1.formatTarget)(value.target, defaultTarget),
        };
    }).sort(sortHostnames);
}
exports.formatSites = formatSites;
//# sourceMappingURL=index.js.map